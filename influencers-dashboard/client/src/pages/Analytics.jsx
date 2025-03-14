import React, { useState, useEffect, forwardRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { errorService } from '@/lib/errorMessages';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SearchBar } from '@/components/ui/SearchBar';
import ApiErrorAlert from '@/components/ui/ApiErrorAlert';
import ErrorBoundary from '@/components/ui/ErrorBoundary';
import { useToast } from '@/components/ui/Toast';

// Serviços de API
import { adaptPlatformData } from '@/services/adapters';
import useApiCall from '@/hooks/useApiCall';
import useTranslation from '@/hooks/useTranslation';
import { influencersApi } from '@/services/api';
import instagramService from '@/services/instagram';
import youtubeService from '@/services/youtube';
import linkedinService from '@/services/linkedin';

// Importações das imagens para tratamento de erros
import errorImage from '@/assets/error_404.png';
import notFoundImage from '@/assets/not_found.png';
import defaultProfileImage from '@/assets/default_profile.png';

import '@/styles/pages/Analytics.css';

// Componente StatCard para exibir estatísticas individuais
const StatCard = forwardRef(({ title, value }, ref) => {
  return (
    <Card className="stat-card" ref={ref}>
      <div className="stat-content">
        <h3 className="stat-title">{title}</h3>
        <p className="stat-value">{value}</p>
      </div>
    </Card>
  );
});

StatCard.displayName = 'StatCard';

// Componente para exibir quando não há dados
const NoDataState = ({ message, image = notFoundImage }) => (
  <div className="no-data-container">
    <img src={image} alt="No data available" className="no-data-image" />
    <p className="no-data-message">{message}</p>
  </div>
);

const Analytics = forwardRef(({ className = '', influencerId = null, ...props }, ref) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [timeRange, setTimeRange] = useState('month');
  const [searchQuery, setSearchQuery] = useState('');
  const [analyticsData, setAnalyticsData] = useState({
    statistics: {
      totalClaims: 0,
      verificationRate: 0,
      activeInfluencers: 0,
      averageScore: 0
    },
    trendData: [],
    categoryData: []
  });

  // Hook para chamar a API de influenciadores
  const {
    data: influencerData,
    loading: loadingInfluencer,
    error: influencerError,
    execute: fetchInfluencer,
    lastError,
    clearLastError
  } = useApiCall(
    influencersApi.findByUsername,
    {
      showErrorToast: true,
      errorMessage: 'errors.influencerNotFound'
    }
  );

  // Hook para buscar métricas
  const {
    data: metricsData,
    loading: loadingMetrics,
    error: metricsError,
    execute: fetchMetrics
  } = useApiCall(
    influencerId ? () => influencersApi.getById(influencerId) : null,
    {
      showErrorToast: false,
      immediate: !!influencerId
    }
  );

  // Determina se está carregando
  const isLoading = loadingInfluencer || loadingMetrics;

  // Função auxiliar para obter o título traduzido de cada estatística
  const getStatTitle = (key) => {
    const statTitles = {
      totalClaims: t('analytics.stats.totalClaims'),
      verificationRate: t('analytics.stats.verificationRate'),
      activeInfluencers: t('analytics.stats.activeInfluencers'),
      averageScore: t('analytics.stats.averageScore')
    };

    return statTitles[key] || key;
  };

  // Formata o valor da estatística com base no tipo
  const formatStatValue = (key, value) => {
    switch (key) {
      case 'verificationRate':
        return `${value.toFixed(1)}%`;
      case 'averageScore':
        return `${value.toFixed(1)}`;
      case 'totalClaims':
      case 'activeInfluencers':
        return value.toString();
      default:
        return value.toString();
    }
  };

  // Função para realizar a busca de influenciador
  const handleSearch = async (query) => {
    if (!query) return;

    setSearchQuery(query);
    try {
      // Tenta encontrar por username em todas as plataformas
      await fetchInfluencer(query, 'all');
    } catch (error) {
      console.error('Error searching influencer:', error);
      // O toast já é exibido pelo hook useApiCall
    }
  };

  // Efeito para processar dados do influenciador quando disponíveis
  useEffect(() => {
    if (!influencerData) return;

    const fetchPlatformData = async () => {
      try {
        // Determinar a plataforma e buscar dados específicos
        if (influencerData.platform === 'Instagram') {
          try {
            const platformData = await instagramService.analyzeInfluencer(influencerData.username);
            const adaptedData = adaptPlatformData(platformData, 'instagram');
            processAnalyticsData(adaptedData, timeRange);
          } catch (error) {
            errorService.reportError('instagram_analysis_error', error, {
              component: 'Analytics',
              username: influencerData.username
            });
            toast({
              title: t('errors.platformError'),
              description: t('errors.instagramAnalysisError'),
              variant: 'error'
            });
          }
        } else if (influencerData.platform === 'YouTube') {
          try {
            const platformData = await youtubeService.analyzeInfluencer(influencerData.username);
            const adaptedData = adaptPlatformData(platformData, 'youtube');
            processAnalyticsData(adaptedData, timeRange);
          } catch (error) {
            errorService.reportError('youtube_analysis_error', error, {
              component: 'Analytics',
              username: influencerData.username
            });
            toast({
              title: t('errors.platformError'),
              description: t('errors.youtubeAnalysisError'),
              variant: 'error'
            });
          }
        } else if (influencerData.platform === 'LinkedIn') {
          try {
            const platformData = await linkedinService.analyzeInfluencer(influencerData.username);
            const adaptedData = adaptPlatformData(platformData, 'linkedin');
            processAnalyticsData(adaptedData, timeRange);
          } catch (error) {
            errorService.reportError('linkedin_analysis_error', error, {
              component: 'Analytics',
              username: influencerData.username
            });
            toast({
              title: t('errors.platformError'),
              description: t('errors.linkedinAnalysisError'),
              variant: 'error'
            });
          }
        }
      } catch (error) {
        console.error('Error fetching platform data:', error);
        toast({
          title: t('errors.generalError'),
          description: t('errors.dataFetchError'),
          variant: 'error'
        });
      }
    };

    fetchPlatformData();
  }, [influencerData, timeRange, t, toast]);

  // Efeito para processar métricas quando disponíveis (quando ID é fornecido)
  useEffect(() => {
    if (!metricsData) return;

    try {
      processAnalyticsData(metricsData, timeRange);
    } catch (error) {
      console.error('Error processing metrics data:', error);
      toast({
        title: t('errors.processingError'),
        description: t('errors.metricsProcessingError'),
        variant: 'error'
      });
    }
  }, [metricsData, timeRange, t, toast]);

  // Função principal para processar os dados analíticos
  const processAnalyticsData = (data, selectedTimeRange) => {
    if (!data) return;

    try {
      // Extrair estatísticas básicas
      const statistics = {
        totalClaims: data.metrics?.posts || 0,
        verificationRate: calculateVerificationRate(data),
        activeInfluencers: 1, // Sempre 1 quando analisando um único influenciador
        averageScore: data.trustScore || 0
      };

      // Gerar dados de tendência baseados no período selecionado
      const trendData = generateTrendData(data, selectedTimeRange);

      // Gerar dados de categorias
      const categoryData = generateCategoryData(data);

      setAnalyticsData({
        statistics,
        trendData,
        categoryData
      });
    } catch (error) {
      console.error('Error processing analytics data:', error);
      errorService.reportError('analytics_processing_error', error, {
        component: 'Analytics',
        dataType: typeof data
      });
    }
  };

  // Calcula taxa de verificação com base nos dados do influenciador
  const calculateVerificationRate = (data) => {
    if (!data) return 0;

    // Usando trustScore como aproximação para taxa de verificação
    return data.trustScore || 0;
  };

  // Gera dados de tendência com base no período
  const generateTrendData = (data, selectedTimeRange) => {
    if (!data) return [];

    // Gerar pontos de data para o período selecionado
    const datePoints = generateDatePoints(selectedTimeRange);

    // Em uma implementação real, esses dados viriam da API
    return datePoints.map((point, index) => {
      // Calculando valores baseados nos dados reais do influenciador
      const baseValue = data.metrics?.engagement || 0;
      // Variação decrescente a partir do valor base
      const factor = (datePoints.length - index) / datePoints.length;
      const total = Math.max(0, baseValue * factor);
      const verified = Math.max(0, total * (data.trustScore ? data.trustScore / 100 : 0.7));

      return {
        date: point.label,
        total: Math.round(total),
        verified: Math.round(verified),
        timestamp: point.timestamp
      };
    });
  };

  // Gera pontos de data baseados no período selecionado
  const generateDatePoints = (selectedTimeRange) => {
    const datePoints = [];
    const { language } = useTranslation();

    switch (selectedTimeRange) {
      case 'week':
        // Últimos 7 dias
        for (let i = 6; i >= 0; i--) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          datePoints.push({
            label: `${date.getDate()}/${date.getMonth() + 1}`,
            timestamp: date.getTime()
          });
        }
        break;

      case 'month':
        // Dividido em 10 pontos para o último mês
        for (let i = 9; i >= 0; i--) {
          const date = new Date();
          date.setDate(date.getDate() - Math.floor(i * 3));
          datePoints.push({
            label: `${date.getDate()}/${date.getMonth() + 1}`,
            timestamp: date.getTime()
          });
        }
        break;

      case 'year':
        // Últimos 12 meses
        for (let i = 11; i >= 0; i--) {
          const date = new Date();
          date.setMonth(date.getMonth() - i);

          const monthNames = language === 'pt'
            ? ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
            : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

          datePoints.push({
            label: monthNames[date.getMonth()],
            timestamp: date.getTime()
          });
        }
        break;

      default:
        // Padrão: último mês
        for (let i = 9; i >= 0; i--) {
          const date = new Date();
          date.setDate(date.getDate() - Math.floor(i * 3));
          datePoints.push({
            label: `${date.getDate()}/${date.getMonth() + 1}`,
            timestamp: date.getTime()
          });
        }
    }

    return datePoints;
  };

  // Gera dados de categoria com base nos dados do influenciador
  const generateCategoryData = (data) => {
    if (!data || !data.audience) {
      return [
        { name: t('analytics.categories.entertainment'), value: 3 },
        { name: t('analytics.categories.lifestyle'), value: 2 },
        { name: t('analytics.categories.technology'), value: 2 }
      ];
    }

    // Se tivermos dados de demografia
    if (data.audience.demographics) {
      const demographics = data.audience.demographics;
      const categories = [];

      // Usar faixas etárias
      if (demographics.ageGroups) {
        Object.entries(demographics.ageGroups).forEach(([age, percentage]) => {
          let category;
          if (age === '18-24') {
            category = t('analytics.categories.entertainment');
          } else if (age === '25-34') {
            category = t('analytics.categories.technology');
          } else if (age === '35-44') {
            category = t('analytics.categories.business');
          } else {
            category = t('analytics.categories.lifestyle');
          }

          const existingCategoryIndex = categories.findIndex(c => c.name === category);
          if (existingCategoryIndex >= 0) {
            categories[existingCategoryIndex].value += percentage / 10;
          } else {
            categories.push({ name: category, value: percentage / 10 });
          }
        });
      }

      // Adicionar categorias baseadas em gênero
      if (demographics.genderSplit) {
        if (demographics.genderSplit.female > 60) {
          categories.push({ name: t('analytics.categories.fashion'), value: demographics.genderSplit.female / 10 });
        }
        if (demographics.genderSplit.male > 60) {
          categories.push({ name: t('analytics.categories.sports'), value: demographics.genderSplit.male / 10 });
        }
      }

      // Usar países/indústrias
      if (demographics.topCountries) {
        demographics.topCountries.forEach(country => {
          if (country.percentage > 20) {
            categories.push({ name: t('analytics.categories.travel'), value: country.percentage / 10 });
          }
        });
      }

      if (demographics.topIndustries) {
        demographics.topIndustries.forEach(industry => {
          categories.push({ name: industry.name, value: industry.percentage / 10 });
        });
      }

      // Ordenar e limitar
      return categories
        .sort((a, b) => b.value - a.value)
        .slice(0, 8);
    }

    // Categorias com base na plataforma
    if (data.platform) {
      switch (data.platform.toLowerCase()) {
        case 'instagram':
          return [
            { name: t('analytics.categories.fashion'), value: 5 },
            { name: t('analytics.categories.beauty'), value: 4 },
            { name: t('analytics.categories.lifestyle'), value: 3 },
            { name: t('analytics.categories.travel'), value: 2 }
          ];
        case 'youtube':
          return [
            { name: t('analytics.categories.entertainment'), value: 5 },
            { name: t('analytics.categories.technology'), value: 4 },
            { name: t('analytics.categories.gaming'), value: 3 },
            { name: t('analytics.categories.education'), value: 2 }
          ];
        case 'linkedin':
          return [
            { name: t('analytics.categories.business'), value: 5 },
            { name: t('analytics.categories.technology'), value: 4 },
            { name: t('analytics.categories.marketing'), value: 3 },
            { name: t('analytics.categories.finance'), value: 2 }
          ];
        default:
          break;
      }
    }

    // Categorias padrão se não houver dados demográficos
    return [
      { name: t('analytics.categories.entertainment'), value: 5 },
      { name: t('analytics.categories.lifestyle'), value: 4 },
      { name: t('analytics.categories.technology'), value: 3 },
      { name: t('analytics.categories.travel'), value: 2 },
      { name: t('analytics.categories.fashion'), value: 1 }
    ];
  };

  // Handler para mudança no período de tempo
  const handleTimeRangeChange = (value) => {
    setTimeRange(value);

    // Se temos dados do influenciador, reprocessar para o novo período
    if (influencerData) {
      processAnalyticsData(influencerData, value);
    }

    // Se temos métricas, reprocessar para o novo período
    if (metricsData) {
      processAnalyticsData(metricsData, value);
    }
  };

  // Cores para o gráfico de pizza
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28DFF', '#FF6B6B', '#4ECDC4', '#FF9F40'];

  return (
    <ErrorBoundary
      componentName="Analytics"
      fallback={
        <div className="error-container">
          <img src={errorImage} alt="Error occurred" className="error-image" />
          <h2>{t('errors.componentError')}</h2>
          <p>{t('errors.tryAgainLater')}</p>
        </div>
      }
    >
      <div className={`analytics-container ${className}`} ref={ref} {...props}>
        <div className="analytics-header">
          <h1 className="analytics-title">{t('analytics.title')}</h1>

          {!influencerId && (
            <div className="search-container">
              <SearchBar
                placeholder={t('search.influencerPlaceholder')}
                onSearch={handleSearch}
                realtime={false}
                className="influencer-search"
              />
            </div>
          )}

          <Select
            value={timeRange}
            onValueChange={handleTimeRangeChange}
            className="time-range-select"
          >
            <SelectTrigger>
              <SelectValue placeholder={t('analytics.timeRanges.selectLabel')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">{t('analytics.timeRanges.week')}</SelectItem>
              <SelectItem value="month">{t('analytics.timeRanges.month')}</SelectItem>
              <SelectItem value="year">{t('analytics.timeRanges.year')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {lastError && (
          <ApiErrorAlert
            error={lastError}
            onClose={clearLastError}
            autoClose={true}
            autoCloseTime={5000}
          />
        )}

        {isLoading ? (
          <div className="loading-spinner">
            {t('analytics.loading')}
          </div>
        ) : influencerError || metricsError ? (
          <NoDataState
            message={t('analytics.noDataAvailable')}
            image={notFoundImage}
          />
        ) : (
          (!influencerData && !metricsData && !searchQuery) ? (
            // Estado inicial - sem busca
            <div className="initial-state">
              <p>{t('analytics.searchToStart')}</p>
            </div>
          ) : (!influencerData && !metricsData && searchQuery) ? (
            // Busca realizada, mas sem resultados
            <NoDataState
              message={t('analytics.noInfluencerFound')}
              image={notFoundImage}
            />
          ) : (
            // Dados disponíveis - mostrar análise
            <>
              {influencerData && (
                <div className="influencer-profile">
                  <img
                    src={influencerData.thumbnailUrl || defaultProfileImage}
                    alt={influencerData.username}
                    className="influencer-avatar"
                  />
                  <div className="influencer-info">
                    <h2 className="influencer-name">{influencerData.username}</h2>
                    <div className="platform-badge">
                      {influencerData.platform || ''}
                    </div>
                  </div>
                </div>
              )}

              <div className="analytics-grid stats-grid">
                {Object.entries(analyticsData.statistics).map(([key, value]) => (
                  <StatCard
                    key={key}
                    title={getStatTitle(key)}
                    value={formatStatValue(key, value)}
                  />
                ))}
              </div>

              <div className="analytics-grid charts-grid">
                <div className="chart-container trend-chart">
                  <h2>{t('analytics.charts.claimsTrend')}</h2>
                  <ResponsiveContainer width="100%" height="85%">
                    <LineChart
                      data={analyticsData.trendData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="total"
                        name={t('analytics.charts.total')}
                        stroke="#8884d8"
                        activeDot={{ r: 8 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="verified"
                        name={t('analytics.charts.verified')}
                        stroke="#82ca9d"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="chart-container category-chart">
                  <h2>{t('analytics.charts.categoryDistribution')}</h2>
                  <ResponsiveContainer width="100%" height="85%">
                    <PieChart>
                      <Pie
                        data={analyticsData.categoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {analyticsData.categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value} ${t('analytics.charts.mentions')}`, t('analytics.charts.amount')]} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </>
          )
        )}
      </div>
    </ErrorBoundary>
  );
});

Analytics.displayName = 'Analytics';

export default Analytics;