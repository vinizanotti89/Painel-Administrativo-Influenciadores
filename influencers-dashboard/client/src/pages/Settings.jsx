import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/Input';
import { Switch } from '@/components/ui/Switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useTheme } from '@/contexts/ThemeContext';
import useTranslation from '@/hooks/useTranslation';

// Serviços de API
import instagramService from '@/services/instagram';
import youtubeService from '@/services/youtube';
import linkedinService from '@/services/linkedin';
import { errorService } from '@/lib/errorMessages';
import ApiErrorAlert from '@/components/ui/ApiErrorAlert';

// Importação de estilos
import '@/styles/pages/settings.css';

const Settings = React.forwardRef(({ className = '', ...props }, ref) => {
  const { theme, toggleTheme } = useTheme();
  const { t } = useTranslation();
  const [darkMode, setDarkMode] = useState(theme === 'dark');

  const [accounts, setAccounts] = useState({
    instagram: null,
    youtube: null,
    linkedin: null,
  });

  const [loading, setLoading] = useState({
    instagram: false,
    youtube: false,
    linkedin: false,
  });

  const [connectionStatus, setConnectionStatus] = useState({
    instagram: false,
    youtube: false,
    linkedin: false,
  });

  const [userPreferences, setUserPreferences] = useState({
    emailNotifications: false,
    pushNotifications: true,
    reportFrequency: 'weekly',
    email: '',
    language: 'pt',
  });

  const [alerts, setAlerts] = useState({
    success: null,
    error: null,
  });

  // Efeito para carregar preferências do usuário
  useEffect(() => {
    try {
      // Carregar preferências do localStorage
      const savedPrefs = localStorage.getItem('user_preferences');
      if (savedPrefs) {
        setUserPreferences(JSON.parse(savedPrefs));
      }

      // Atualizar estado do tema
      setDarkMode(theme === 'dark');

      // Verificar status das conexões com as APIs
      checkInstagramConnection();
      checkYoutubeConnection();
      checkLinkedinConnection();
    } catch (error) {
      console.error('Erro ao inicializar configurações:', error);
      errorService.reportError('settings_init_error', error, { component: 'Settings' });
    }
  }, [theme]);

  // Função para verificar conexão com Instagram
  const checkInstagramConnection = async () => {
    setLoading(prev => ({ ...prev, instagram: true }));
    try {
      const token = localStorage.getItem('instagram_token');
      setConnectionStatus(prev => ({ ...prev, instagram: false }));

      // Tenta obter perfil para verificar se o token é válido
      const profile = await instagramService.getProfile();
      if (profile && profile.id) {
        setAccounts(prev => ({
          ...prev,
          instagram: {
            id: profile.id,
            username: profile.username || 'Instagram User',
            profilePicture: profile.profile_picture_url,
            mediaCount: profile.media_count || 0
          }
        }));
        setConnectionStatus(prev => ({ ...prev, instagram: true }));
      } else {
        // Se não conseguir obter o perfil, considera desconectado
        setConnectionStatus(prev => ({ ...prev, instagram: false }));
      }
    } catch (error) {
      console.error('Erro ao verificar conexão com Instagram:', error);
      setConnectionStatus(prev => ({ ...prev, instagram: false }));
      localStorage.removeItem('instagram_token'); // Remove token inválido
    } finally {
      setLoading(prev => ({ ...prev, instagram: false }));
    }
  };

  // Função para verificar conexão com YouTube
  const checkYoutubeConnection = async () => {
    setLoading(prev => ({ ...prev, youtube: true }));
    try {
      const token = localStorage.getItem('youtube_token');
      setConnectionStatus(prev => ({ ...prev, instagram: false }));

      // Tenta obter canal para verificar se o token é válido
      const channelData = await youtubeService.getChannel();
      if (channelData && channelData.id) {
        setAccounts(prev => ({
          ...prev,
          youtube: {
            id: channelData.id,
            name: channelData.snippet?.title || 'YouTube Channel',
            profilePicture: channelData.snippet?.thumbnails?.default?.url,
            subscribers: channelData.statistics?.subscriberCount || '0',
            videos: channelData.statistics?.videoCount || '0'
          }
        }));
        setConnectionStatus(prev => ({ ...prev, youtube: true }));
      } else {
        // Se não conseguir obter o canal, considera desconectado
        setConnectionStatus(prev => ({ ...prev, youtube: false }));
      }
    } catch (error) {
      console.error('Erro ao verificar conexão com YouTube:', error);
      setConnectionStatus(prev => ({ ...prev, youtube: false }));

      // Se o erro for de autenticação, tenta renovar o token
      if (error.response && error.response.status === 401) {
        try {
          await youtubeService.refreshToken();
          // Tenta novamente após renovar o token
          checkYoutubeConnection();
          return;
        } catch (refreshError) {
          console.error('Erro ao renovar token do YouTube:', refreshError);
          localStorage.removeItem('youtube_token'); // Remove token inválido
        }
      }
    } finally {
      setLoading(prev => ({ ...prev, youtube: false }));
    }
  };

  // Função para verificar conexão com LinkedIn
  const checkLinkedinConnection = async () => {
    setLoading(prev => ({ ...prev, linkedin: true }));
    try {
      const token = localStorage.getItem('linkedin_token');
      setConnectionStatus(prev => ({ ...prev, instagram: false }));

      // Tenta obter perfil para verificar se o token é válido
      const profile = await linkedinService.getProfile();
      if (profile && profile.id) {
        setAccounts(prev => ({
          ...prev,
          linkedin: {
            id: profile.id,
            name: `${profile.localizedFirstName || ''} ${profile.localizedLastName || ''}`.trim() || 'LinkedIn User',
            profilePicture: profile.profilePicture?.displayImage || null,
            connections: profile.numConnections || '0',
            industry: profile.industry || '-'
          }
        }));
        setConnectionStatus(prev => ({ ...prev, linkedin: true }));
      } else {
        // Se não conseguir obter o perfil, considera desconectado
        setConnectionStatus(prev => ({ ...prev, linkedin: false }));
      }
    } catch (error) {
      console.error('Erro ao verificar conexão com LinkedIn:', error);
      setConnectionStatus(prev => ({ ...prev, linkedin: false }));
      localStorage.removeItem('linkedin_token'); // Remove token inválido
    } finally {
      setLoading(prev => ({ ...prev, linkedin: false }));
    }
  };

  // Conectar Instagram
  const connectInstagram = () => {
    try {
      setLoading(prev => ({ ...prev, instagram: true }));
      const authUrl = instagramService.generateAuthUrl();
      window.location.href = authUrl;
    } catch (error) {
      console.error('Erro ao gerar URL de autenticação do Instagram:', error);
      showAlert('error', t('settings.alerts.error.instagramConnection'));
      setLoading(prev => ({ ...prev, instagram: false }));
    }
  };

  // Conectar YouTube
  const connectYoutube = () => {
    try {
      setLoading(prev => ({ ...prev, youtube: true }));
      const authUrl = youtubeService.generateAuthUrl();
      window.location.href = authUrl;
    } catch (error) {
      console.error('Erro ao gerar URL de autenticação do YouTube:', error);
      showAlert('error', t('settings.alerts.error.youtubeConnection'));
      setLoading(prev => ({ ...prev, youtube: false }));
    }
  };

  // Conectar LinkedIn
  const connectLinkedin = () => {
    try {
      setLoading(prev => ({ ...prev, linkedin: true }));
      const authUrl = linkedinService.generateAuthUrl();
      window.location.href = authUrl;
    } catch (error) {
      console.error('Erro ao gerar URL de autenticação do LinkedIn:', error);
      showAlert('error', t('settings.alerts.error.linkedinConnection'));
      setLoading(prev => ({ ...prev, linkedin: false }));
    }
  };

  // Desconectar Instagram
  const disconnectInstagram = async () => {
    setLoading(prev => ({ ...prev, instagram: true }));
    try {
      await instagramService.logout();
      setAccounts(prev => ({ ...prev, instagram: null }));
      setConnectionStatus(prev => ({ ...prev, instagram: false }));
      showAlert('success', t('settings.alerts.success.instagramDisconnected'));
    } catch (error) {
      console.error('Erro ao desconectar Instagram:', error);
      showAlert('error', t('settings.alerts.error.instagramDisconnection'));
    } finally {
      setLoading(prev => ({ ...prev, instagram: false }));
    }
  };

  // Desconectar YouTube
  const disconnectYoutube = async () => {
    setLoading(prev => ({ ...prev, youtube: true }));
    try {
      await youtubeService.logout();
      setAccounts(prev => ({ ...prev, youtube: null }));
      setConnectionStatus(prev => ({ ...prev, youtube: false }));
      showAlert('success', t('settings.alerts.success.youtubeDisconnected'));
    } catch (error) {
      console.error('Erro ao desconectar YouTube:', error);
      showAlert('error', t('settings.alerts.error.youtubeDisconnection'));
    } finally {
      setLoading(prev => ({ ...prev, youtube: false }));
    }
  };

  // Desconectar LinkedIn
  const disconnectLinkedin = async () => {
    setLoading(prev => ({ ...prev, linkedin: true }));
    try {
      await linkedinService.logout();
      setAccounts(prev => ({ ...prev, linkedin: null }));
      setConnectionStatus(prev => ({ ...prev, linkedin: false }));
      showAlert('success', t('settings.alerts.success.linkedinDisconnected'));
    } catch (error) {
      console.error('Erro ao desconectar LinkedIn:', error);
      showAlert('error', t('settings.alerts.error.linkedinDisconnection'));
    } finally {
      setLoading(prev => ({ ...prev, linkedin: false }));
    }
  };

  // Salvar preferências
  const saveUserPreferences = () => {
    try {
      // Validar email se as notificações por email estiverem ativadas
      if (userPreferences.emailNotifications && !validateEmail(userPreferences.email)) {
        showAlert('error', t('settings.alerts.error.invalidEmail'));
        return;
      }

      // Salvar preferências no localStorage
      localStorage.setItem('user_preferences', JSON.stringify(userPreferences));

      // Se houver mudança de idioma
      if (userPreferences.language !== t.language) {
        localStorage.setItem('app-language', userPreferences.language);
        // Recarregar a página para aplicar mudança de idioma
        window.location.reload();
        return;
      }

      showAlert('success', t('settings.alerts.success.preferencesSaved'));
    } catch (error) {
      console.error('Erro ao salvar preferências:', error);
      showAlert('error', t('settings.alerts.error.savePreferences'));
    }
  };

  // Validar formato de email
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  // Exportar dados em CSV
  const exportCSV = async () => {
    try {
      setLoading(prev => ({ ...prev, exporting: true }));

      // Verificar se há alguma API conectada
      if (!connectionStatus.instagram && !connectionStatus.youtube && !connectionStatus.linkedin) {
        showAlert('error', t('settings.alerts.error.noConnectedPlatforms'));
        setLoading(prev => ({ ...prev, exporting: false }));
        return;
      }

      // Fazer requisição para o endpoint de exportação CSV
      const response = await fetch('/api/export/csv', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify({
          platforms: {
            instagram: connectionStatus.instagram,
            youtube: connectionStatus.youtube,
            linkedin: connectionStatus.linkedin
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Erro na resposta: ${response.status}`);
      }

      // Baixar o arquivo CSV
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `influencers_export_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      showAlert('success', t('settings.alerts.success.csvExport'));
    } catch (error) {
      console.error('Erro ao exportar CSV:', error);
      showAlert('error', t('settings.alerts.error.csvExport'));
    } finally {
      setLoading(prev => ({ ...prev, exporting: false }));
    }
  };

  // Exportar dados em PDF
  const exportPDF = async () => {
    try {
      setLoading(prev => ({ ...prev, exporting: true }));

      // Verificar se há alguma API conectada
      if (!connectionStatus.instagram && !connectionStatus.youtube && !connectionStatus.linkedin) {
        showAlert('error', t('settings.alerts.error.noConnectedPlatforms'));
        setLoading(prev => ({ ...prev, exporting: false }));
        return;
      }

      // Fazer requisição para o endpoint de exportação PDF
      const response = await fetch('/api/export/pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify({
          platforms: {
            instagram: connectionStatus.instagram,
            youtube: connectionStatus.youtube,
            linkedin: connectionStatus.linkedin
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Erro na resposta: ${response.status}`);
      }

      // Baixar o arquivo PDF
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `influencers_report_${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      showAlert('success', t('settings.alerts.success.pdfExport'));
    } catch (error) {
      console.error('Erro ao exportar PDF:', error);
      showAlert('error', t('settings.alerts.error.pdfExport'));
    } finally {
      setLoading(prev => ({ ...prev, exporting: false }));
    }
  };

  // Exibir alertas
  const showAlert = (type, message, duration = 5000) => {
    setAlerts({
      success: type === 'success' ? message : null,
      error: type === 'error' ? message : null
    });

    // Limpar alertas após o tempo definido
    setTimeout(() => {
      setAlerts({ success: null, error: null });
    }, duration);
  };

  // Renderizar detalhes da conta Instagram
  const renderInstagramAccount = () => {
    if (loading.instagram) {
      return <div className="loading-indicator">{t('settings.common.checkingConnection')}</div>;
    }

    if (connectionStatus.instagram && accounts.instagram) {
      return (
        <div className="account-details">
          <div className="account-info">
            <img
              src={accounts.instagram.profilePicture || '/assets/default_profile.png'}
              alt={t('settings.accounts.instagram.profileAlt')}
              className="account-avatar"
              onError={(e) => { e.target.src = '/assets/default_profile.png' }}
            />
            <div className="account-meta">
              <div className="account-name">{accounts.instagram.username}</div>
              <div className="account-stats">
                {accounts.instagram.mediaCount} {t('settings.accounts.instagram.posts')}
              </div>
            </div>
          </div>
          <Button
            variant="destructive"
            onClick={disconnectInstagram}
            disabled={loading.instagram}
            className="disconnect-btn"
          >
            {t('settings.common.disconnect')}
          </Button>
        </div>
      );
    }

    return (
      <div className="connect-account">
        <p>{t('settings.accounts.instagram.connectPrompt')}</p>
        <Button
          onClick={connectInstagram}
          disabled={loading.instagram}
          className="connect-btn instagram-btn"
        >
          {loading.instagram ? t('settings.common.connecting') : t('settings.accounts.instagram.connect')}
        </Button>
      </div>
    );
  };

  // Renderizar detalhes da conta YouTube
  const renderYoutubeAccount = () => {
    if (loading.youtube) {
      return <div className="loading-indicator">{t('settings.common.checkingConnection')}</div>;
    }

    if (connectionStatus.youtube && accounts.youtube) {
      return (
        <div className="account-details">
          <div className="account-info">
            <img
              src={accounts.youtube.profilePicture || '/assets/default_profile.png'}
              alt={t('settings.accounts.youtube.profileAlt')}
              className="account-avatar"
              onError={(e) => { e.target.src = '/assets/default_profile.png' }}
            />
            <div className="account-meta">
              <div className="account-name">{accounts.youtube.name}</div>
              <div className="account-stats">
                {accounts.youtube.subscribers} {t('settings.accounts.youtube.subscribers')} • {accounts.youtube.videos} {t('settings.accounts.youtube.videos')}
              </div>
            </div>
          </div>
          <Button
            variant="destructive"
            onClick={disconnectYoutube}
            disabled={loading.youtube}
            className="disconnect-btn"
          >
            {t('settings.common.disconnect')}
          </Button>
        </div>
      );
    }

    return (
      <div className="connect-account">
        <p>{t('settings.accounts.youtube.connectPrompt')}</p>
        <Button
          onClick={connectYoutube}
          disabled={loading.youtube}
          className="connect-btn youtube-btn"
        >
          {loading.youtube ? t('settings.common.connecting') : t('settings.accounts.youtube.connect')}
        </Button>
      </div>
    );
  };

  // Renderizar detalhes da conta LinkedIn
  const renderLinkedinAccount = () => {
    if (loading.linkedin) {
      return <div className="loading-indicator">{t('settings.common.checkingConnection')}</div>;
    }

    if (connectionStatus.linkedin && accounts.linkedin) {
      return (
        <div className="account-details">
          <div className="account-info">
            <img
              src={accounts.linkedin.profilePicture || '/assets/default_profile.png'}
              alt={t('settings.accounts.linkedin.profileAlt')}
              className="account-avatar"
              onError={(e) => { e.target.src = '/assets/default_profile.png' }}
            />
            <div className="account-meta">
              <div className="account-name">{accounts.linkedin.name}</div>
              <div className="account-stats">
                {accounts.linkedin.connections} {t('settings.accounts.linkedin.connections')} • {accounts.linkedin.industry}
              </div>
            </div>
          </div>
          <Button
            variant="destructive"
            onClick={disconnectLinkedin}
            disabled={loading.linkedin}
            className="disconnect-btn"
          >
            {t('settings.common.disconnect')}
          </Button>
        </div>
      );
    }

    return (
      <div className="connect-account">
        <p>{t('settings.accounts.linkedin.connectPrompt')}</p>
        <Button
          onClick={connectLinkedin}
          disabled={loading.linkedin}
          className="connect-btn linkedin-btn"
        >
          {loading.linkedin ? t('settings.common.connecting') : t('settings.accounts.linkedin.connect')}
        </Button>
      </div>
    );
  };

  return (
    <div className={`settings-container ${className}`} ref={ref} {...props}>
      <h1 className="settings-title">{t('settings.title')}</h1>

      {/* Alertas */}
      {alerts.success && (
        <Alert className="alert-success">
          <AlertDescription>{alerts.success}</AlertDescription>
        </Alert>
      )}

      {alerts.error && (
        <ApiErrorAlert
          error={alerts.error}
          onClose={() => setAlerts({ ...alerts, error: null })}
          autoClose={true}
          autoCloseTime={5000}
        />
      )}

      <Tabs defaultValue="accounts" className="settings-tabs">
        <TabsList className="settings-tabs-list">
          <TabsTrigger value="accounts">{t('settings.tabs.accounts')}</TabsTrigger>
          <TabsTrigger value="preferences">{t('settings.tabs.preferences')}</TabsTrigger>
          <TabsTrigger value="exports">{t('settings.tabs.exports')}</TabsTrigger>
        </TabsList>

        {/* Contas Conectadas */}
        <TabsContent value="accounts" className="settings-tabs-content">
          <Card className="settings-card">
            <CardHeader>
              <CardTitle>{t('settings.accounts.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="platforms-grid">
                <Card className="platform-card">
                  <CardHeader className="platform-header">
                    <div className="platform-title">
                      <div className="platform-icon instagram-icon"></div>
                      <h3>Instagram</h3>
                    </div>
                    <Badge variant={connectionStatus.instagram ? "success" : "outline"}>
                      {connectionStatus.instagram ? t('settings.common.connected') : t('settings.common.disconnected')}
                    </Badge>
                  </CardHeader>
                  <CardContent className="platform-content">
                    {renderInstagramAccount()}
                  </CardContent>
                </Card>

                <Card className="platform-card">
                  <CardHeader className="platform-header">
                    <div className="platform-title">
                      <div className="platform-icon youtube-icon"></div>
                      <h3>YouTube</h3>
                    </div>
                    <Badge variant={connectionStatus.youtube ? "success" : "outline"}>
                      {connectionStatus.youtube ? t('settings.common.connected') : t('settings.common.disconnected')}
                    </Badge>
                  </CardHeader>
                  <CardContent className="platform-content">
                    {renderYoutubeAccount()}
                  </CardContent>
                </Card>

                <Card className="platform-card">
                  <CardHeader className="platform-header">
                    <div className="platform-title">
                      <div className="platform-icon linkedin-icon"></div>
                      <h3>LinkedIn</h3>
                    </div>
                    <Badge variant={connectionStatus.linkedin ? "success" : "outline"}>
                      {connectionStatus.linkedin ? t('settings.common.connected') : t('settings.common.disconnected')}
                    </Badge>
                  </CardHeader>
                  <CardContent className="platform-content">
                    {renderLinkedinAccount()}
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preferências */}
        <TabsContent value="preferences" className="settings-tabs-content">
          <Card className="settings-card">
            <CardHeader>
              <CardTitle>{t('settings.preferences.appearance.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="theme-toggle">
                <span>{t('settings.preferences.appearance.darkMode')}</span>
                <Switch
                  checked={darkMode}
                  onCheckedChange={() => {
                    toggleTheme();
                    setDarkMode(!darkMode);
                  }}
                  aria-label={t('settings.preferences.appearance.toggleTheme')}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="settings-card">
            <CardHeader>
              <CardTitle>{t('settings.preferences.notifications.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="notification-settings">
                <div className="notification-option">
                  <div className="notification-label">
                    <span>{t('settings.preferences.notifications.email')}</span>
                  </div>
                  <Switch
                    checked={userPreferences.emailNotifications}
                    onCheckedChange={(checked) => setUserPreferences(prev => ({
                      ...prev,
                      emailNotifications: checked
                    }))}
                  />
                </div>

                {userPreferences.emailNotifications && (
                  <div className="notification-email">
                    <Input
                      type="email"
                      placeholder={t('settings.preferences.notifications.emailPlaceholder')}
                      value={userPreferences.email}
                      onChange={(e) => setUserPreferences(prev => ({
                        ...prev,
                        email: e.target.value
                      }))}
                    />
                  </div>
                )}

                <div className="notification-option">
                  <div className="notification-label">
                    <span>{t('settings.preferences.notifications.push')}</span>
                  </div>
                  <Switch
                    checked={userPreferences.pushNotifications}
                    onCheckedChange={(checked) => setUserPreferences(prev => ({
                      ...prev,
                      pushNotifications: checked
                    }))}
                  />
                </div>

                <div className="notification-option">
                  <div className="notification-label">
                    <span>{t('settings.preferences.notifications.reportFrequency')}</span>
                  </div>
                  <select
                    value={userPreferences.reportFrequency}
                    onChange={(e) => setUserPreferences(prev => ({
                      ...prev,
                      reportFrequency: e.target.value
                    }))}
                    className="report-frequency-select"
                  >
                    <option value="daily">{t('settings.preferences.notifications.frequencies.daily')}</option>
                    <option value="weekly">{t('settings.preferences.notifications.frequencies.weekly')}</option>
                    <option value="monthly">{t('settings.preferences.notifications.frequencies.monthly')}</option>
                  </select>
                </div>
              </div>

              <Button
                onClick={saveUserPreferences}
                className="save-preferences-btn"
              >
                {t('settings.preferences.saveButton')}
              </Button>
            </CardContent>
          </Card>

          <Card className="settings-card">
            <CardHeader>
              <CardTitle>{t('settings.preferences.language.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="language-settings">
                <select
                  value={userPreferences.language}
                  onChange={(e) => setUserPreferences(prev => ({
                    ...prev,
                    language: e.target.value
                  }))}
                  className="language-select"
                >
                  <option value="pt">{t('settings.preferences.language.options.portuguese')}</option>
                  <option value="en">{t('settings.preferences.language.options.english')}</option>
                </select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Exportação */}
        <TabsContent value="exports" className="settings-tabs-content">
          <Card className="settings-card">
            <CardHeader>
              <CardTitle>{t('settings.exports.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="export-description">
                {t('settings.exports.description')}
              </p>

              <div className="export-options">
                <div className="export-option">
                  <h4>{t('settings.exports.csv.title')}</h4>
                  <p>{t('settings.exports.csv.description')}</p>
                  <Button
                    onClick={exportCSV}
                    className="export-btn"
                    disabled={loading.exporting || (!connectionStatus.instagram && !connectionStatus.youtube && !connectionStatus.linkedin)}
                  >
                    {loading.exporting ? t('settings.common.exporting') : t('settings.exports.csv.button')}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
});

Settings.displayName = 'Settings';

export default Settings;
