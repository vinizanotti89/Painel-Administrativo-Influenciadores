import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { SearchBar } from '@/components/ui/SearchBar';

// Serviços de API
import { adaptPlatformData } from '@/services/adapters';
import instagramService from '@/services/instagram';
import youtubeService from '@/services/youtube';
import linkedinService from '@/services/linkedin';
import api, { influencersApi, reportsApi } from '@/services/api';
import useTranslation from '@/hooks/useTranslation';
import useApiCall from '@/hooks/useApiCall';
import ApiErrorAlert from '@/components/ui/ApiErrorAlert';
import ErrorBoundary from '@/components/ui/ErrorBoundary';
import { useToast } from '@/components/ui/Toast';

// Imagens para estados de erro e perfil padrão
import errorImage from '@/assets/error_404.png';

import '@/styles/pages/Reports.css';

const Reports = React.forwardRef(({ className = '', ...props }, ref) => {
  const { t, language } = useTranslation();
  const { toast } = useToast();

  // Estados do componente
  const [reportType, setReportType] = useState('influencer');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [reportData, setReportData] = useState(null);
  const [recentReports, setRecentReports] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    pageSize: 5
  });

  // Hook useApiCall para melhor tratamento de erros e estados
  const {
    execute,
    loading,
    lastError,
    clearLastError
  } = useApiCall(null, {
    platform: selectedPlatform.toLowerCase() || undefined,
    showErrorToast: true
  });

  // Hook para carregar relatórios recentes
  const {
    execute: fetchRecentReports,
    loading: loadingRecentReports,
    data: fetchedRecentReports
  } = useApiCall(
    () => reportsApi.getAll({ limit: 10, page: pagination.currentPage }),
    {
      immediate: true,
      onSuccess: (data) => {
        if (data && data.items) {
          setRecentReports(data.items);
          setPagination(prev => ({
            ...prev,
            totalPages: Math.ceil(data.total / prev.pageSize)
          }));
        }
      }
    }
  );

  // Função para gerar relatório com base nos dados das APIs
  const generateReport = async () => {
    if (
      (reportType === 'influencer' && !searchTerm) ||
      (reportType === 'category' && !selectedCategory) ||
      (reportType === 'monthly' && !selectedPeriod)
    ) {
      return execute(() => Promise.reject(new Error(t('reports.error.requiredFields'))));
    }

    // Define a função que será executada baseada no tipo de relatório
    let reportFunction;

    if (reportType === 'influencer') {
      reportFunction = () => generateInfluencerReport(searchTerm, selectedPlatform);
    } else if (reportType === 'category') {
      reportFunction = () => generateCategoryReport(selectedCategory, selectedPlatform);
    } else if (reportType === 'monthly') {
      reportFunction = () => generateMonthlyReport(selectedPeriod, selectedPlatform);
    }

    const reportResult = await execute(reportFunction);

    if (reportResult) {
      setReportData(reportResult);

      // Criar um novo relatório e enviar para a API
      const newReport = {
        name: getReportName(reportType, reportResult),
        type: reportType,
        platform: selectedPlatform || 'all',
        data: reportResult,
        parameters: {
          searchTerm,
          category: selectedCategory,
          period: selectedPeriod,
          platform: selectedPlatform
        }
      };

      try {
        // Criar relatório na API
        const savedReport = await execute(() => reportsApi.create(newReport));

        if (savedReport) {
          // Atualizar a lista de relatórios recentes
          fetchRecentReports();

          toast({
            title: t('reports.success.reportCreated'),
            description: t('reports.success.reportCreatedDescription'),
            variant: 'success'
          });
        }
      } catch (error) {
        console.error('Error saving report:', error);
        // Continuar mesmo se não conseguir salvar o relatório
      }
    }
  };

  // Gerar nome do relatório com base no tipo e resultado
  const getReportName = (type, result) => {
    const date = new Date().toLocaleDateString(language === 'pt' ? 'pt-BR' : 'en-US', {
      month: 'long',
      year: 'numeric'
    });

    if (type === 'influencer') {
      return `${t('reports.reportNames.influencer')} - ${result.influencerName || searchTerm}`;
    } else if (type === 'category') {
      return `${t('reports.reportNames.category')} - ${selectedCategory}`;
    } else if (type === 'monthly') {
      return `${t('reports.reportNames.monthly')} - ${date}`;
    }

    return t('reports.reportNames.new');
  };

  // Gerar relatório de influenciador específico
  const generateInfluencerReport = async (term, platform) => {
    try {
      if (!term || term.trim() === '') {
        throw new Error(t('reports.error.missingInfluencerName'));
      }

      const platformData = {};
      const platformPromises = [];
      const cleanTerm = term.trim();

      // Função auxiliar para processar dados de uma plataforma
      const processPlatformData = async (platformName, serviceCall) => {
        try {
          console.log(`Fetching data for ${platformName}...`);
          const rawData = await serviceCall();

          if (!rawData) {
            console.warn(`No data returned from ${platformName} service`);
            return null;
          }

          // Adaptar dados através da função adaptPlatformData
          const adaptedData = adaptPlatformData(rawData, platformName);

          if (!adaptedData) {
            console.warn(`Failed to adapt ${platformName} data`);
            return null;
          }

          console.log(`Successfully processed ${platformName} data:`, adaptedData);
          return adaptedData;
        } catch (error) {
          console.error(`Error fetching ${platformName} data:`, error);
          return null;
        }
      };

      // Adicionar promessas com base na plataforma selecionada
      if (!platform || platform.toLowerCase() === 'instagram') {
        platformPromises.push(
          processPlatformData('instagram', () => instagramService.analyzeInfluencer(cleanTerm))
            .then(data => {
              if (data) platformData.instagram = data;
            })
        );
      }

      if (!platform || platform.toLowerCase() === 'youtube') {
        platformPromises.push(
          processPlatformData('youtube', () => youtubeService.analyzeInfluencer(cleanTerm))
            .then(data => {
              if (data) platformData.youtube = data;
            })
        );
      }

      if (!platform || platform.toLowerCase() === 'linkedin') {
        platformPromises.push(
          processPlatformData('linkedin', () => linkedinService.analyzeInfluencer(cleanTerm))
            .then(data => {
              if (data) platformData.linkedin = data;
            })
        );
      }

      // Aguardar todas as requisições completarem
      await Promise.allSettled(platformPromises);

      // Verificar se temos dados de alguma plataforma
      if (Object.keys(platformData).length === 0) {
        throw new Error(t('reports.error.noInfluencerData'));
      }

      // Validar os dados recebidos de cada plataforma
      Object.entries(platformData).forEach(([platform, data]) => {
        if (!data.followers && !data.metrics) {
          console.warn(`Warning: Missing core data for ${platform}`, data);
        }
      });

      // Construir e retornar o relatório completo
      const summary = generateInfluencerSummary(platformData);

      return {
        influencerName: term,
        generatedAt: new Date().toISOString(),
        platforms: platformData,
        summary,
        query: {
          term: cleanTerm,
          platform: platform || 'all'
        }
      };
    } catch (error) {
      console.error('Error generating influencer report:', error);
      throw error;
    }
  };

  // Gerar um sumário para o relatório de influenciador
  const generateInfluencerSummary = (platformData) => {
    const summary = {
      totalFollowers: 0,
      averageTrustScore: 0,
      platforms: Object.keys(platformData).length,
      topPlatform: null,
      engagementRate: 0
    };

    let highestFollowers = 0;
    let totalTrustScore = 0;
    let trustScoreCount = 0;
    let totalEngagement = 0;
    let engagementCount = 0;

    // Calcular dados agregados de todas as plataformas
    Object.entries(platformData).forEach(([platform, data]) => {
      // Obter seguidores com base na plataforma
      let followers = 0;

      if (data.followers) {
        followers = typeof data.followers === 'number' ? data.followers : parseInt(data.followers) || 0;
        summary.totalFollowers += followers;
      }

      // Verificar plataforma com mais seguidores
      if (followers > highestFollowers) {
        highestFollowers = followers;
        summary.topPlatform = platform.charAt(0).toUpperCase() + platform.slice(1);
      }

      // Cálculo do Trust Score
      if (data.trustScore) {
        totalTrustScore += data.trustScore;
        trustScoreCount++;
      }

      // Cálculo do Engagement
      if (data.metrics && data.metrics.engagement) {
        const engagement = typeof data.metrics.engagement === 'string'
          ? parseFloat(data.metrics.engagement)
          : data.metrics.engagement;

        if (!isNaN(engagement)) {
          totalEngagement += engagement;
          engagementCount++;
        }
      }
    });

    // Calcular média do trust score e engagement
    if (trustScoreCount > 0) {
      summary.averageTrustScore = Math.round(totalTrustScore / trustScoreCount);
    }

    if (engagementCount > 0) {
      summary.engagementRate = (totalEngagement / engagementCount).toFixed(2);
    }

    return summary;
  };

  // Gerar relatório por categoria
  const generateCategoryReport = async (category, platform) => {
    try {
      // Buscar influenciadores por categoria através da API centralizada
      const response = await influencersApi.getAll({
        category,
        platform: platform ? platform.toLowerCase() : undefined,
        limit: 50
      });

      if (!response || !response.data || response.data.length === 0) {
        throw new Error(t('reports.error.noCategoryData'));
      }

      const influencersByCategory = response.data;

      // Calcular estatísticas da categoria
      const categorySummary = {
        totalInfluencers: influencersByCategory.length,
        avgFollowers: 0,
        avgEngagement: 0,
        topInfluencers: influencersByCategory
          .sort((a, b) => (b.followers || 0) - (a.followers || 0))
          .slice(0, 5)
      };

      if (influencersByCategory.length > 0) {
        // Calcular médias
        let totalFollowers = 0;
        let totalEngagement = 0;
        let engagementCount = 0;

        influencersByCategory.forEach(inf => {
          if (inf.followers) {
            totalFollowers += typeof inf.followers === 'number' ? inf.followers : parseInt(inf.followers) || 0;
          }

          if (inf.metrics && inf.metrics.engagement) {
            const engagement = typeof inf.metrics.engagement === 'string'
              ? parseFloat(inf.metrics.engagement)
              : inf.metrics.engagement;

            if (!isNaN(engagement)) {
              totalEngagement += engagement;
              engagementCount++;
            }
          }
        });

        categorySummary.avgFollowers = Math.round(totalFollowers / influencersByCategory.length);

        if (engagementCount > 0) {
          categorySummary.avgEngagement = (totalEngagement / engagementCount).toFixed(2);
        }
      }

      return {
        category,
        platforms: platform || t('reports.platforms.all'),
        generatedAt: new Date().toISOString(),
        influencers: influencersByCategory,
        summary: categorySummary
      };
    } catch (error) {
      console.error(t('reports.error.categoryReportGeneration'), error);
      throw error;
    }
  };

  // Gerar relatório mensal
  const generateMonthlyReport = async (period, platform) => {
    try {
      const startDate = getStartDateForPeriod(period);
      const endDate = new Date().toISOString();

      // Parâmetros para a API
      const params = {
        startDate,
        endDate,
        platform: platform ? platform.toLowerCase() : undefined,
        period
      };

      // Usar a API para buscar métricas do período
      const metricsResponse = await influencersApi.getAll({
        ...params,
        includeMetrics: true
      });

      if (!metricsResponse || !metricsResponse.data || metricsResponse.data.length === 0) {
        throw new Error(t('reports.error.noMetricsData'));
      }

      // Estruturar dados para o relatório
      const reportData = {
        period,
        startDate,
        endDate,
        platforms: {},
        summary: {
          totalNewInfluencers: 0,
          growthRate: 0,
          topCategories: []
        }
      };

      // Processar dados por plataforma
      const influencersByPlatform = {};

      metricsResponse.data.forEach(inf => {
        const platformKey = inf.platform.toLowerCase();

        if (!influencersByPlatform[platformKey]) {
          influencersByPlatform[platformKey] = {
            influencers: [],
            newInfluencers: 0,
            categories: {}
          };
        }

        influencersByPlatform[platformKey].influencers.push(inf);

        // Contar novos influenciadores
        if (new Date(inf.createdAt) >= new Date(startDate)) {
          influencersByPlatform[platformKey].newInfluencers++;
          reportData.summary.totalNewInfluencers++;
        }

        // Contar categorias
        if (inf.category) {
          const category = inf.category.toLowerCase();
          influencersByPlatform[platformKey].categories[category] =
            (influencersByPlatform[platformKey].categories[category] || 0) + 1;
        }
      });

      // Adicionar dados por plataforma ao relatório
      Object.entries(influencersByPlatform).forEach(([platform, data]) => {
        reportData.platforms[platform] = {
          totalInfluencers: data.influencers.length,
          newInfluencers: data.newInfluencers,
          categories: Object.entries(data.categories).map(([name, count]) => ({ name, count }))
        };
      });

      // Buscar dados históricos para calcular a taxa de crescimento
      const historicalParams = { ...params };

      switch (period) {
        case 'week':
          historicalParams.startDate = new Date(new Date(startDate).getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
          historicalParams.endDate = startDate;
          break;
        case 'month':
          const historicalStartDate = new Date(startDate);
          historicalStartDate.setMonth(historicalStartDate.getMonth() - 1);
          historicalParams.startDate = historicalStartDate.toISOString();
          historicalParams.endDate = startDate;
          break;
        case 'quarter':
          const quarterStartDate = new Date(startDate);
          quarterStartDate.setMonth(quarterStartDate.getMonth() - 3);
          historicalParams.startDate = quarterStartDate.toISOString();
          historicalParams.endDate = startDate;
          break;
        case 'year':
          const yearStartDate = new Date(startDate);
          yearStartDate.setFullYear(yearStartDate.getFullYear() - 1);
          historicalParams.startDate = yearStartDate.toISOString();
          historicalParams.endDate = startDate;
          break;
      }

      // Buscar dados históricos
      try {
        const historicalResponse = await influencersApi.getAll({
          ...historicalParams,
          includeMetrics: false,
          countOnly: true
        });

        if (historicalResponse && historicalResponse.total > 0) {
          const previousTotal = historicalResponse.total;
          const currentTotal = metricsResponse.total;

          // Calcular taxa de crescimento
          if (previousTotal > 0) {
            const growthRate = ((currentTotal - previousTotal) / previousTotal) * 100;
            reportData.summary.growthRate = Math.round(growthRate);
          }
        }
      } catch (error) {
        console.error('Error fetching historical data:', error);
        // Continuar mesmo se não puder calcular a taxa de crescimento
      }

      // Calcular top categorias
      const allCategories = {};

      Object.values(influencersByPlatform).forEach(platformData => {
        Object.entries(platformData.categories).forEach(([category, count]) => {
          allCategories[category] = (allCategories[category] || 0) + count;
        });
      });

      reportData.summary.topCategories = Object.entries(allCategories)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5)
        .map(cat => ({
          name: t(`categories.${cat.name.toLowerCase()}`, { defaultValue: cat.name }),
          count: cat.count
        }));

      return reportData;
    } catch (error) {
      console.error(t('reports.error.monthlyReportGeneration'), error);
      throw error;
    }
  };

  // Função para determinar a data de início com base no período selecionado
  const getStartDateForPeriod = (period) => {
    const now = new Date();
    let startDate = new Date();

    if (period === 'week') {
      startDate.setDate(now.getDate() - 7);
    } else if (period === 'month') {
      startDate.setMonth(now.getMonth() - 1);
    } else if (period === 'quarter') {
      startDate.setMonth(now.getMonth() - 3);
    } else if (period === 'year') {
      startDate.setFullYear(now.getFullYear() - 1);
    }

    return startDate.toISOString();
  };

  // Determina classe CSS para o Trust Score
  const getTrustScoreClass = (score) => {
    if (score >= 80) return 'high';
    if (score >= 60) return 'medium';
    return 'low';
  };

  // Formata números para exibição
  const formatNumber = (num) => {
    if (num === undefined || num === null) return '0';

    if (typeof num === 'string') {
      num = parseFloat(num);
    }

    if (isNaN(num)) return '0';

    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  // Funções para exportação e impressão
  const handleExportPDF = async () => {
    if (!reportData) {
      return execute(() => Promise.reject(new Error(t('reports.error.noReportToExport'))));
    }

    try {
      // Chamar API para gerar PDF
      const result = await execute(() =>
        api.post('/reports/export', {
          format: 'pdf',
          data: reportData
        }, { responseType: 'blob' })
      );

      if (result && result.data) {
        // Criar URL para download do blob
        const url = window.URL.createObjectURL(new Blob([result.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${reportData.influencerName || reportData.category || 'report'}_${new Date().toISOString().split('T')[0]}.pdf`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast({
          title: t('reports.success.exportSuccess'),
          description: t('reports.success.pdfExported'),
          variant: 'success'
        });
      }
    } catch (error) {
      console.error('PDF export error:', error);
      toast({
        title: t('reports.error.exportFailed'),
        description: t('reports.error.pdfExportFailed'),
        variant: 'destructive'
      });
    }
  };

  const handleExportCSV = async () => {
    if (!reportData) {
      return execute(() => Promise.reject(new Error(t('reports.error.noReportToExport'))));
    }

    try {
      // Chamar API para gerar CSV
      const result = await execute(() =>
        api.post('/reports/export', {
          format: 'csv',
          data: reportData
        }, { responseType: 'blob' })
      );

      if (result && result.data) {
        // Criar URL para download do blob
        const url = window.URL.createObjectURL(new Blob([result.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${reportData.influencerName || reportData.category || 'report'}_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast({
          title: t('reports.success.exportSuccess'),
          description: t('reports.success.csvExported'),
          variant: 'success'
        });
      }
    } catch (error) {
      console.error('CSV export error:', error);
      toast({
        title: t('reports.error.exportFailed'),
        description: t('reports.error.csvExportFailed'),
        variant: 'destructive'
      });
    }
  };

  const handlePrint = () => {
    if (!reportData) {
      return execute(() => Promise.reject(new Error(t('reports.error.noReportToPrint'))));
    }

    window.print();
  };

  // Tratamento de mudança de página nos relatórios recentes
  const handlePageChange = (page) => {
    setPagination(prev => ({
      ...prev,
      currentPage: page
    }));
  };

  // Atualizar lista de relatórios recentes quando mudar a página
  useEffect(() => {
    fetchRecentReports();
  }, [pagination.currentPage]);

  // Função para abrir um relatório existente
  const handleViewReport = async (reportId) => {
    try {
      const result = await execute(() => reportsApi.getById(reportId));
      if (result && result.data) {
        setReportData(result.data);
        setReportType(result.type);

        // Atualizar outros estados com base nos parâmetros do relatório
        if (result.parameters) {
          setSearchTerm(result.parameters.searchTerm || '');
          setSelectedCategory(result.parameters.category || '');
          setSelectedPeriod(result.parameters.period || 'month');
          setSelectedPlatform(result.parameters.platform || '');
        }

        toast({
          title: t('reports.success.reportLoaded'),
          description: t('reports.success.reportLoadedDescription'),
          variant: 'success'
        });
      }
    } catch (error) {
      console.error('Error loading report:', error);
      toast({
        title: t('reports.error.loadFailed'),
        description: t('reports.error.reportLoadFailed'),
        variant: 'destructive'
      });
    }
  };

  // Função para baixar um relatório existente
  const handleDownloadReport = async (reportId, format = 'pdf') => {
    try {
      // Chamar API para baixar relatório
      const result = await execute(() =>
        api.get(`/reports/${reportId}/export`, {
          params: { format },
          responseType: 'blob'
        })
      );

      if (result && result.data) {
        // Criar URL para download do blob
        const url = window.URL.createObjectURL(new Blob([result.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `report_${reportId}_${new Date().toISOString().split('T')[0]}.${format}`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast({
          title: t('reports.success.downloadSuccess'),
          description: t(`reports.success.${format}Downloaded`),
          variant: 'success'
        });
      }
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: t('reports.error.downloadFailed'),
        description: t('reports.error.reportDownloadFailed'),
        variant: 'destructive'
      });
    }
  };

  // Função para buscar influenciador usando a SearchBar
  const handleSearchInfluencer = (query) => {
    setSearchTerm(query);
    return Promise.resolve();
  };

  return (
    <ErrorBoundary
      fallback={
        <div className="error-container">
          <img src={errorImage} alt={t('common.error')} className="error-image" />
          <h2>{t('reports.error.somethingWentWrong')}</h2>
          <p>{t('reports.error.tryAgainLater')}</p>
        </div>
      }
    >
      <div className="reports-container" ref={ref} {...props}>
        <div className="reports-header">
          <h1 className="reports-title">{t('reports.title')}</h1>
          {reportData && (
            <div className="reports-actions">
              <Button onClick={handleExportPDF} size="sm" variant="outline">
                {t('reports.actions.exportPDF')}
              </Button>
              <Button onClick={handleExportCSV} size="sm" variant="outline">
                {t('reports.actions.exportCSV')}
              </Button>
              <Button onClick={handlePrint} size="sm" variant="outline">
                {t('reports.actions.print')}
              </Button>
            </div>
          )}
        </div>

        <div className="reports-grid">
          <Card className="report-card">
            <CardHeader>
              <CardTitle>{t('reports.newReport')}</CardTitle>
            </CardHeader>
            <CardContent>
              {lastError && (
                <ApiErrorAlert
                  error={lastError}
                  platform={selectedPlatform.toLowerCase()}
                  onClose={clearLastError}
                />
              )}

              <div className="report-form">
                <div className="form-group report-type-selector">
                  <label>{t('reports.form.reportType')}</label>
                  <div className="report-type-buttons">
                    <Button
                      variant={reportType === 'influencer' ? 'default' : 'outline'}
                      onClick={() => setReportType('influencer')}
                      className="report-type-button"
                    >
                      {t('reports.types.influencer')}
                    </Button>
                    <Button
                      variant={reportType === 'category' ? 'default' : 'outline'}
                      onClick={() => setReportType('category')}
                      className="report-type-button"
                    >
                      {t('reports.types.category')}
                    </Button>
                    <Button
                      variant={reportType === 'monthly' ? 'default' : 'outline'}
                      onClick={() => setReportType('monthly')}
                      className="report-type-button"
                    >
                      {t('reports.types.monthly')}
                    </Button>
                  </div>
                </div>

                {/* Campos específicos para cada tipo de relatório */}
                {reportType === 'influencer' && (
                  <div className="form-group">
                    <label>{t('reports.form.influencerName')}</label>
                    <SearchBar
                      placeholder={t('reports.form.searchInfluencer')}
                      onSearch={handleSearchInfluencer}
                      maxWidth="100%"
                    />
                  </div>
                )}

                {reportType === 'category' && (
                  <div className="form-group">
                    <label>{t('reports.form.category')}</label>
                    <Select
                      value={selectedCategory}
                      onValueChange={setSelectedCategory}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t('reports.form.selectCategory')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tech">{t('categories.tech')}</SelectItem>
                        <SelectItem value="beauty">{t('categories.beauty')}</SelectItem>
                        <SelectItem value="fashion">{t('categories.fashion')}</SelectItem>
                        <SelectItem value="fitness">{t('categories.fitness')}</SelectItem>
                        <SelectItem value="food">{t('categories.food')}</SelectItem>
                        <SelectItem value="travel">{t('categories.travel')}</SelectItem>
                        <SelectItem value="lifestyle">{t('categories.lifestyle')}</SelectItem>
                        <SelectItem value="gaming">{t('categories.gaming')}</SelectItem>
                        <SelectItem value="education">{t('categories.education')}</SelectItem>
                        <SelectItem value="finance">{t('categories.finance')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {reportType === 'monthly' && (
                  <div className="form-group">
                    <label>{t('reports.form.period')}</label>
                    <Select
                      value={selectedPeriod}
                      onValueChange={setSelectedPeriod}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t('reports.form.selectPeriod')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="week">{t('reports.periods.week')}</SelectItem>
                        <SelectItem value="month">{t('reports.periods.month')}</SelectItem>
                        <SelectItem value="quarter">{t('reports.periods.quarter')}</SelectItem>
                        <SelectItem value="year">{t('reports.periods.year')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="form-group">
                  <label>{t('reports.form.platform')}</label>
                  <Select
                    value={selectedPlatform}
                    onValueChange={setSelectedPlatform}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t('reports.form.selectPlatform')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">{t('reports.platforms.all')}</SelectItem>
                      <SelectItem value="instagram">{t('reports.platforms.instagram')}</SelectItem>
                      <SelectItem value="youtube">{t('reports.platforms.youtube')}</SelectItem>
                      <SelectItem value="linkedin">{t('reports.platforms.linkedin')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  onClick={generateReport}
                  disabled={loading}
                  className="generate-button"
                >
                  {loading ? (
                    <>
                      <span className="loading-spinner mr-2" />
                      {t('reports.generating')}
                    </>
                  ) : (
                    t('reports.generate')
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {reportData ? (
            <Card className="report-card report-preview">
              <CardHeader>
                <CardTitle>
                  {reportType === 'influencer' && `${t('reports.reportTypes.influencer')}: ${reportData.influencerName}`}
                  {reportType === 'category' && `${t('reports.reportTypes.category')}: ${reportData.category}`}
                  {reportType === 'monthly' && `${t('reports.reportTypes.monthly')}: ${t(`reports.periods.${reportData.period}`)}`}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Sumário do relatório */}
                <div className="report-summary">
                  {reportType === 'influencer' && reportData.summary && (
                    <>
                      <div className="summary-item">
                        <span className="summary-label">{t('reports.summary.totalFollowers')}</span>
                        <span className="summary-value">{formatNumber(reportData.summary.totalFollowers)}</span>
                      </div>
                      <div className="summary-item">
                        <span className="summary-label">{t('reports.summary.engagement')}</span>
                        <span className="summary-value">{reportData.summary.engagementRate}%</span>
                      </div>
                      <div className="summary-item">
                        <span className="summary-label">{t('reports.summary.trustScore')}</span>
                        <span className="summary-value">
                          {reportData.summary.averageTrustScore}
                          <span className={`trust-score ${getTrustScoreClass(reportData.summary.averageTrustScore)}`}>
                            {reportData.summary.averageTrustScore >= 80 ? t('reports.trustScore.high') :
                              reportData.summary.averageTrustScore >= 60 ? t('reports.trustScore.medium') :
                                t('reports.trustScore.low')}
                          </span>
                        </span>
                      </div>
                      <div className="summary-item">
                        <span className="summary-label">{t('reports.summary.topPlatform')}</span>
                        <span className="summary-value">{reportData.summary.topPlatform || '-'}</span>
                      </div>
                    </>
                  )}

                  {reportType === 'category' && reportData.summary && (
                    <>
                      <div className="summary-item">
                        <span className="summary-label">{t('reports.summary.totalInfluencers')}</span>
                        <span className="summary-value">{reportData.summary.totalInfluencers}</span>
                      </div>
                      <div className="summary-item">
                        <span className="summary-label">{t('reports.summary.avgFollowers')}</span>
                        <span className="summary-value">{formatNumber(reportData.summary.avgFollowers)}</span>
                      </div>
                      <div className="summary-item">
                        <span className="summary-label">{t('reports.summary.avgEngagement')}</span>
                        <span className="summary-value">{reportData.summary.avgEngagement}%</span>
                      </div>
                    </>
                  )}

                  {reportType === 'monthly' && reportData.summary && (
                    <>
                      <div className="summary-item">
                        <span className="summary-label">{t('reports.summary.totalNewInfluencers')}</span>
                        <span className="summary-value">{reportData.summary.totalNewInfluencers}</span>
                      </div>
                      <div className="summary-item">
                        <span className="summary-label">{t('reports.summary.growthRate')}</span>
                        <span className="summary-value">{reportData.summary.growthRate}%</span>
                      </div>
                    </>
                  )}
                </div>

                {/* Conteúdo específico por tipo de relatório */}
                {reportType === 'influencer' && reportData.platforms && (
                  <div className="report-section">
                    <h3 className="section-title">{t('reports.platforms.title')}</h3>
                    <div className="platforms-grid">
                      {Object.entries(reportData.platforms).map(([platform, data]) => (
                        <div key={platform} className="platform-card">
                          <h5>{t(`reports.platforms.${platform.toLowerCase()}`)}</h5>
                          <div className="platform-stats">
                            <div>
                              <span className="stat-label">{t('reports.stats.followers')}:</span>
                              <span className="stat-value">{data.followersFormatted || formatNumber(data.followers)}</span>
                            </div>
                            <div>
                              <span className="stat-label">{t('reports.stats.engagement')}:</span>
                              <span className="stat-value">{data.engagement}%</span>
                            </div>
                            {data.trustScore && (
                              <div>
                                <span className="stat-label">{t('reports.stats.trustScore')}:</span>
                                <span className="stat-value">
                                  {data.trustScore}
                                  <span className={`trust-score ${getTrustScoreClass(data.trustScore)}`}>
                                    {data.trustScore >= 80 ? t('reports.trustScore.high') :
                                      data.trustScore >= 60 ? t('reports.trustScore.medium') :
                                        t('reports.trustScore.low')}
                                  </span>
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {reportType === 'category' && reportData.summary && reportData.summary.topInfluencers && (
                  <div className="report-section top-influencers">
                    <h3 className="section-title">{t('reports.topInfluencers')}</h3>
                    <div className="influencers-list">
                      {reportData.summary.topInfluencers.map((influencer, index) => (
                        <div key={influencer.id || `inf-${index}`} className="influencer-item">
                          <div className="influencer-rank">{index + 1}</div>
                          <div className="influencer-name">{influencer.username || influencer.fullName || '-'}</div>
                          <div className="influencer-platform">{influencer.platform || '-'}</div>
                          <div className="influencer-followers">{formatNumber(influencer.followers)} {t('reports.stats.followers')}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {reportType === 'monthly' && reportData.platforms && (
                  <div className="report-section">
                    <h3 className="section-title">{t('reports.platformBreakdown')}</h3>
                    <div className="platforms-grid">
                      {Object.entries(reportData.platforms).map(([platform, data]) => (
                        <div key={platform} className="platform-card">
                          <h5>{t(`reports.platforms.${platform.toLowerCase()}`)}</h5>
                          <div className="platform-stats">
                            <div>
                              <span className="stat-label">{t('reports.stats.totalInfluencers')}:</span>
                              <span className="stat-value">{data.totalInfluencers}</span>
                            </div>
                            <div>
                              <span className="stat-label">{t('reports.stats.newInfluencers')}:</span>
                              <span className="stat-value">{data.newInfluencers}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {reportType === 'monthly' && reportData.summary && reportData.summary.topCategories && (
                  <div className="report-section top-categories">
                    <h3 className="section-title">{t('reports.topCategories')}</h3>
                    <div className="categories-list">
                      {reportData.summary.topCategories.map((category, index) => (
                        <div key={`cat-${index}`} className="category-item">
                          <div className="category-name">{category.name}</div>
                          <div className="category-count">{category.count} {t('reports.stats.influencers')}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : null}
        </div>

        <div className="recent-reports">
          <h2 className="section-title">{t('reports.recentReports')}</h2>
          {loadingRecentReports ? (
            <div className="loading-container">
              <div className="loading-spinner large-spinner" />
              <p>{t('reports.loadingReports')}</p>
            </div>
          ) : recentReports.length === 0 ? (
            <p className="no-reports-message">{t('reports.noReportsFound')}</p>
          ) : (
            <>
              <div className="reports-table-container">
                <table className="reports-table">
                  <thead>
                    <tr>
                      <th>{t('reports.table.name')}</th>
                      <th>{t('reports.table.type')}</th>
                      <th>{t('reports.table.platform')}</th>
                      <th>{t('reports.table.createdAt')}</th>
                      <th>{t('reports.table.status')}</th>
                      <th>{t('reports.table.actions')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentReports.map((report) => (
                      <tr key={report.id} className="table-row">
                        <td>{report.name}</td>
                        <td>
                          <span className="report-type-badge">
                            {t(`reports.types.${report.type}`)}
                          </span>
                        </td>
                        <td>{t(`reports.platforms.${report.platform}`)}</td>
                        <td>
                          {new Date(report.createdAt).toLocaleDateString(
                            language === 'pt' ? 'pt-BR' : 'en-US',
                            {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            }
                          )}
                        </td>
                        <td>
                          <span className={`status-badge ${report.status === 'completed' ? 'success' : 'pending'}`}>
                            {t(`reports.status.${report.status}`)}
                          </span>
                        </td>
                        <td className="actions-cell">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleViewReport(report.id)}
                            className="action-button"
                          >
                            {t('reports.actions.view')}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDownloadReport(report.id, 'pdf')}
                            className="action-button"
                          >
                            PDF
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDownloadReport(report.id, 'csv')}
                            className="action-button"
                          >
                            CSV
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Paginação */}
              {pagination.totalPages > 1 && (
                <div className="pagination">
                  <Button
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={pagination.currentPage <= 1}
                    size="sm"
                    variant="outline"
                  >
                    {t('pagination.previous')}
                  </Button>
                  <span className="page-info">
                    {t('pagination.page', { current: pagination.currentPage, total: pagination.totalPages })}
                  </span>
                  <Button
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={pagination.currentPage >= pagination.totalPages}
                    size="sm"
                    variant="outline"
                  >
                    {t('pagination.next')}
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
});

Reports.displayName = 'Reports';

export default Reports;