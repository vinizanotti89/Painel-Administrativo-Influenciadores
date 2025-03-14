import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SearchBar } from '@/components/ui/SearchBar';

// Serviços de API
import useTranslation from "@/hooks/useTranslation";
import { errorService } from '@/lib/errorMessages';
import ApiErrorAlert from '@/components/ui/ApiErrorAlert';
import useApiCall from '@/hooks/useApiCall';
import useAsyncState from '@/hooks/useAsyncState';

// Adapters
import { adaptPlatformData } from '@/services/adapters';

// Serviços de API
import instagramService from '@/services/instagram';
import youtubeService from '@/services/youtube';
import linkedinService from '@/services/linkedin';
import { influencersApi } from '@/services/api';

// Imagens para estados de erro e perfil padrão
import errorImage from '@/assets/error_404.png';
import notFoundImage from '@/assets/not_found.png';
import defaultProfileImage from '@/assets/default_profile.png';

import '@/styles/pages/HealthClaims.css';

/**
 * Componente para análise de alegações de saúde feitas por influenciadores
 * Exibe alertas de verificação de fatos para conteúdos relacionados à saúde
 */
const HealthClaims = React.forwardRef((props, ref) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [searchUsername, setSearchUsername] = useState('');
  const [claimFilter, setClaimFilter] = useState('all');
  const [contentStats, setContentStats] = useState({
    totalContent: 0,
    relevantContent: 0,
    claimsByVerification: {
      verified: 0,
      partially: 0,
      misleading: 0,
      incorrect: 0,
      unverified: 0
    }
  });

  // Hook para carregar dados do influenciador
  const {
    data: influencer,
    loading: loadingInfluencer,
    error: influencerError,
    execute: fetchInfluencer
  } = useApiCall(null, {
    showErrorToast: true,
    errorMessage: 'healthClaims.error.loadingInfluencer'
  });

  // Hook para carregar alegações de saúde
  const {
    data: claims,
    loading: loadingClaims,
    error: claimsError,
    execute: fetchClaims
  } = useAsyncState(null, {
    initialData: [],
    showErrorToast: true,
    errorMessage: 'healthClaims.error.loadingClaims'
  });

  // Efeito para carregar dados do influenciador quando o ID muda
  useEffect(() => {
    if (id) {
      const loadInfluencer = async () => {
        try {
          // Primeiro tenta carregar do banco de dados interno
          const result = await fetchInfluencer(() => influencersApi.getById(id));
          if (result) return;

          // Se não encontrar, busca nas plataformas
          const platformServices = [
            { name: 'instagram', service: instagramService.getProfileByUsername },
            { name: 'youtube', service: youtubeService.getChannelByIdentifier },
            { name: 'linkedin', service: linkedinService.getProfileByUsername }
          ];

          for (const { name, service } of platformServices) {
            try {
              const data = await service(id);
              if (data) {
                // Adapta os dados para o formato padrão do dashboard
                const adaptedData = adaptPlatformData(data, name);
                await fetchInfluencer(() => Promise.resolve(adaptedData));
                break;
              }
            } catch (err) {
              console.warn(`Failed to fetch from ${name}:`, err);
              // Continua para o próximo serviço
            }
          }
        } catch (error) {
          errorService.reportError('healthclaims_influencer_load_error', error, { id });
          console.error('Error fetching influencer:', error);
        }
      };

      loadInfluencer();
    }
  }, [id, fetchInfluencer]);

  // Efeito para carregar alegações quando o influenciador é carregado
  useEffect(() => {
    if (influencer) {
      fetchHealthClaims(influencer.id, influencer.platform);
    }
  }, [influencer]);

  // Função para buscar pelo nome de usuário
  const handleSearch = (username) => {
    if (!username.trim()) return;

    navigate(`/influencer/health-claims/${username}`);
  };

  // Função para buscar alegações de saúde com base na plataforma
  const fetchHealthClaims = async (influencerId, platform) => {
    try {
      let contentItems = [];

      // Busca conteúdo específico da plataforma
      if (platform.toLowerCase() === 'instagram') {
        contentItems = await instagramService.getRecentMedia(influencerId);
      } else if (platform.toLowerCase() === 'youtube') {
        contentItems = await youtubeService.getRecentVideosForChannel(influencerId);
      } else if (platform.toLowerCase() === 'linkedin') {
        contentItems = await linkedinService.getUserPosts(influencerId);
      }

      // Extrai as alegações de saúde do conteúdo
      const { claims: extractedClaims, stats } = await extractHealthClaims(contentItems, platform);

      fetchClaims(() => Promise.resolve(extractedClaims));
      setContentStats(stats);
    } catch (error) {
      errorService.reportError('healthclaims_data_load_error', error, { platform });
      console.error('Error fetching health claims:', error);
      throw error;
    }
  };

  // Função para extrair alegações de saúde dos conteúdos
  const extractHealthClaims = async (contentItems, platform) => {
    try {
      // Palavras-chave para detectar conteúdo relacionado à saúde
      const healthKeywords = t('healthClaims.keywords', { returnObjects: true }) || [
        'saúde', 'cura', 'tratamento', 'prevenir', 'prevenção', 'vitamina',
        'suplemento', 'remédio', 'medicamento', 'terapia', 'dieta', 'emagrecer'
      ];

      // Marcadores de alegações potencialmente questionáveis
      const questionableClaims = t('healthClaims.questionableMarkers', { returnObjects: true }) || [
        'milagroso', 'cura tudo', 'revolucionário', 'médicos não querem que você saiba'
      ];

      // Lista para armazenar as alegações encontradas
      const extractedClaims = [];
      let relevantContent = 0;
      let claimId = 1;

      // Processa cada item de conteúdo
      for (const item of contentItems) {
        // Extrai texto do conteúdo com base na plataforma
        const contentData = extractContentData(item, platform);
        if (!contentData.text) continue;

        // Verifica se o conteúdo contém palavras-chave de saúde
        const containsHealthTopic = healthKeywords.some(keyword =>
          contentData.text.toLowerCase().includes(keyword.toLowerCase())
        );

        if (containsHealthTopic) {
          relevantContent++;

          // Verifica a presença de alegações questionáveis
          const questionableMarkers = questionableClaims.filter(marker =>
            contentData.text.toLowerCase().includes(marker.toLowerCase())
          );

          // Se tiver marcadores questionáveis ou for escolhido para verificação (simulado)
          const shouldAnalyze = questionableMarkers.length > 0 || Math.random() < 0.3;

          if (shouldAnalyze) {
            // Chama a API de análise (em ambiente de produção, seria uma API real de fact-checking)
            // Por enquanto, usando uma simulação
            const claim = await simulateFactCheck(contentData, questionableMarkers);
            if (claim) {
              extractedClaims.push({
                id: claimId++,
                ...claim,
                source: `${platform} - ${contentData.date}`,
                sourceUrl: contentData.mediaUrl,
                sourceId: contentData.sourceId
              });
            }
          }
        }
      }

      // Atualiza as estatísticas de conteúdo
      const stats = {
        totalContent: contentItems.length,
        relevantContent,
        claimsByVerification: {
          verified: extractedClaims.filter(c => c.verificationStatus === 'verified').length,
          partially: extractedClaims.filter(c => c.verificationStatus === 'partially').length,
          misleading: extractedClaims.filter(c => c.verificationStatus === 'misleading').length,
          incorrect: extractedClaims.filter(c => c.verificationStatus === 'incorrect').length,
          unverified: extractedClaims.filter(c => c.verificationStatus === 'unverified').length
        }
      };

      return { claims: extractedClaims, stats };
    } catch (error) {
      console.error('Error extracting health claims:', error);
      throw error;
    }
  };

  // Extrai dados do conteúdo específicos da plataforma
  const extractContentData = (item, platform) => {
    let text = '';
    let mediaUrl = '';
    let date = '';
    let sourceId = '';

    // Extrai dados específicos por plataforma
    if (platform.toLowerCase() === 'instagram') {
      text = item.caption || '';
      mediaUrl = item.permalink || '';
      date = new Date(item.timestamp).toLocaleDateString();
      sourceId = item.id;
    } else if (platform.toLowerCase() === 'youtube') {
      text = (item.snippet?.description || '') + ' ' + (item.snippet?.title || '');
      mediaUrl = `https://www.youtube.com/watch?v=${item.id}`;
      date = item.snippet?.publishedAt ? new Date(item.snippet.publishedAt).toLocaleDateString() : '';
      sourceId = item.id;
    } else if (platform.toLowerCase() === 'linkedin') {
      text = item.commentary?.text || '';
      mediaUrl = item.permalink || '';
      date = item.created?.time ? new Date(item.created.time).toLocaleDateString() : '';
      sourceId = item.id;
    }

    return { text, mediaUrl, date, sourceId };
  };

  // Simulação de verificação de fatos para o ambiente de desenvolvimento
  // Em produção, isso seria substituído por uma API real de fact-checking
  const simulateFactCheck = async (contentData, questionableMarkers) => {
    // Extrai uma alegação do texto (simplificado para demonstração)
    // Em produção, isso usaria NLP mais sofisticado
    const text = contentData.text;
    let extractedClaim = '';
    let verificationStatus = '';
    let factCheck = '';

    // Simulação de extração de alegação baseada em marcadores
    if (questionableMarkers.length > 0) {
      const marker = questionableMarkers[0];
      const markerIndex = text.toLowerCase().indexOf(marker.toLowerCase());
      const words = text.split(' ');
      let wordIndex = 0;
      let markerWordIndex = 0;

      // Encontra o índice da palavra com o marcador
      for (let i = 0; i < words.length; i++) {
        wordIndex += words[i].length + 1; // +1 pelo espaço
        if (wordIndex > markerIndex) {
          markerWordIndex = i;
          break;
        }
      }

      // Extrai palavras antes e depois do marcador
      const start = Math.max(0, markerWordIndex - 7);
      const end = Math.min(words.length, markerWordIndex + 8);
      extractedClaim = words.slice(start, end).join(' ');

      // Status de verificação simulado
      const randomFactor = Math.random();
      if (randomFactor < 0.2) {
        verificationStatus = 'incorrect';
        factCheck = t('healthClaims.verification.incorrect');
      } else if (randomFactor < 0.5) {
        verificationStatus = 'misleading';
        factCheck = t('healthClaims.verification.misleading');
      } else if (randomFactor < 0.8) {
        verificationStatus = 'partially';
        factCheck = t('healthClaims.verification.partially');
      } else {
        verificationStatus = 'verified';
        factCheck = t('healthClaims.verification.verified');
      }
    } else {
      // Para conteúdo sem marcadores óbvios
      const words = text.split(' ');
      const start = Math.min(words.length, 5);
      const end = Math.min(words.length, start + 10);
      extractedClaim = words.slice(start, end).join(' ');

      const randomFactor = Math.random();
      if (randomFactor < 0.7) {
        verificationStatus = 'verified';
        factCheck = t('healthClaims.verification.verified');
      } else {
        verificationStatus = 'partially';
        factCheck = t('healthClaims.verification.partially');
      }
    }

    // Explicação baseada no status
    let explanation = t(`healthClaims.explanations.${verificationStatus}`);

    // Gera estudos relacionados (simulado)
    const studiesCount = Math.floor(Math.random() * 3) + 1;
    const studyTemplates = t('healthClaims.studyTemplates', { returnObjects: true }) || [];
    const studies = [];

    for (let i = 0; i < studiesCount; i++) {
      if (studyTemplates.length > 0) {
        studies.push(studyTemplates[Math.floor(Math.random() * studyTemplates.length)]);
      }
    }

    return {
      content: extractedClaim,
      verificationStatus,
      studies,
      factCheck,
      explanation
    };
  };

  // Filtrar alegações
  const filteredClaims = claims.filter(claim => {
    if (claimFilter === 'all') return true;
    return claim.verificationStatus === claimFilter;
  });

  // Status de cada alegação
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'verified': return 'success';
      case 'partially': return 'warning';
      case 'misleading': return 'error';
      case 'incorrect': return 'error';
      default: return 'neutral';
    }
  };

  // Renderiza o componente de carregamento
  if (loadingInfluencer) {
    return <div className="health-claims-loading">{t('healthClaims.loading')}</div>;
  }

  // Renderiza o erro, se houver
  if (influencerError) {
    return (
      <div className="health-claims-error">
        <img src={errorImage} alt={t('healthClaims.error')} className="error-image" />
        <ApiErrorAlert
          error={influencerError}
          autoClose={false}
          className="mb-6"
        />
        <Button onClick={() => navigate(-1)}>{t('healthClaims.back')}</Button>
      </div>
    );
  }

  // Se não houver influenciador
  if (!influencer) {
    return (
      <div className="health-claims-error">
        <img src={notFoundImage} alt={t('healthClaims.notFound')} className="error-image" />
        <p>{t('healthClaims.notFound')}</p>
        <div className="search-container">
          <SearchBar
            placeholder={t('healthClaims.searchPlaceholder')}
            onSearch={handleSearch}
            realtime={false}
            maxWidth="400px"
            className="mb-4"
          />
        </div>
        <Button onClick={() => navigate(-1)}>{t('healthClaims.back')}</Button>
      </div>
    );
  }

  return (
    <div className="health-claims-container" ref={ref}>
      <div className="claims-header">
        <div className="influencer-info">
          <img
            src={influencer.thumbnailUrl || influencer.profileUrl || defaultProfileImage}
            alt={influencer.username || influencer.name}
            className="influencer-avatar"
            onError={(e) => { e.target.src = defaultProfileImage }}
          />
          <div>
            <h1 className="claims-title">{t('healthClaims.title')}</h1>
            <h2 className="influencer-name">{influencer.username || influencer.name}</h2>
            <Badge>{influencer.platform}</Badge>
          </div>
        </div>

        <div className="search-box">
          <SearchBar
            placeholder={t('healthClaims.searchPlaceholder')}
            onSearch={handleSearch}
            realtime={false}
            compact={true}
          />
        </div>
      </div>

      <div className="claims-stats-container">
        <Card className="stats-card">
          <CardHeader>
            <CardTitle>{t('healthClaims.stats.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-label">{t('healthClaims.stats.totalContent')}</span>
                <span className="stat-value">{contentStats.totalContent}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">{t('healthClaims.stats.healthContent')}</span>
                <span className="stat-value">{contentStats.relevantContent}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">{t('healthClaims.stats.verifiedClaims')}</span>
                <span className="stat-value success">{contentStats.claimsByVerification.verified}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">{t('healthClaims.stats.partiallyClaims')}</span>
                <span className="stat-value warning">{contentStats.claimsByVerification.partially}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">{t('healthClaims.stats.misleadingClaims')}</span>
                <span className="stat-value error">
                  {contentStats.claimsByVerification.misleading + contentStats.claimsByVerification.incorrect}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {loadingClaims ? (
        <div className="claims-loading">
          <p>{t('healthClaims.claimsLoading')}</p>
        </div>
      ) : (
        <>
          <div className="claims-filter-container">
            <Select
              value={claimFilter}
              onValueChange={setClaimFilter}
            >
              <SelectTrigger className="filter-select">
                <SelectValue placeholder={t('healthClaims.filter.placeholder')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('healthClaims.filter.allClaims')}</SelectItem>
                <SelectItem value="verified">{t('healthClaims.filter.verified')}</SelectItem>
                <SelectItem value="partially">{t('healthClaims.filter.partially')}</SelectItem>
                <SelectItem value="misleading">{t('healthClaims.filter.misleading')}</SelectItem>
                <SelectItem value="incorrect">{t('healthClaims.filter.incorrect')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="claims-list">
            {filteredClaims.length > 0 ? (
              filteredClaims.map(claim => (
                <Card key={claim.id} className="claim-card">
                  <CardHeader className="claim-card-header">
                    <div className="claim-header-content">
                      <CardTitle className="claim-title">{t('healthClaims.claim.title')}</CardTitle>
                      <Badge className={`verification-badge ${getStatusBadgeClass(claim.verificationStatus)}`}>
                        {claim.factCheck}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="claim-content">
                      <p className="claim-text">"{claim.content}"</p>
                      <div className="claim-source">
                        <span className="source-label">{t('healthClaims.claim.source')}</span>
                        <a href={claim.sourceUrl} target="_blank" rel="noopener noreferrer" className="source-link">
                          {claim.source}
                        </a>
                      </div>
                    </div>

                    <div className="claim-verification">
                      <h4 className="verification-title">{t('healthClaims.claim.analysis')}</h4>
                      <p className="verification-text">{claim.explanation}</p>
                    </div>

                    {claim.studies && claim.studies.length > 0 && (
                      <div className="claim-studies">
                        <h4 className="studies-title">{t('healthClaims.claim.studies')}</h4>
                        <ul className="studies-list">
                          {claim.studies.map((study, index) => (
                            <li key={index} className="study-item">
                              <a href={study.url} target="_blank" rel="noopener noreferrer" className="study-link">
                                {study.title}
                              </a>
                              <p className="study-conclusion">
                                <span className="conclusion-label">{t('healthClaims.claim.conclusion')}</span> {study.conclusion}
                              </p>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="no-claims-card">
                <CardContent>
                  <p className="no-claims-text">
                    {t('healthClaims.claim.noClaims')}{' '}
                    {claimFilter !== 'all' ? `${t('healthClaims.claim.withStatus')} "${claimFilter}" ` : ''}
                    {t('healthClaims.claim.found')}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </>
      )}
    </div>
  );
});

HealthClaims.displayName = 'HealthClaims';

export default HealthClaims;