import React, { useState, useCallback, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SearchBar } from '@/components/ui/SearchBar';
import ApiErrorAlert from '@/components/ui/ApiErrorAlert';

// Serviços de API
import useTranslation from '@/hooks/useTranslation';
import useApiCall from '@/hooks/useApiCall';
import { errorService } from '@/lib/errorMessages';
import { adaptPlatformData } from '@/services/adapters';
import instagramService from '@/services/instagram';
import youtubeService from '@/services/youtube';
import linkedinService from '@/services/linkedin';

// Imagens para estados de erro e perfil padrão
import errorImage from '@/assets/error_404.png';
import notFoundImage from '@/assets/not_found.png';
import defaultProfileImage from '@/assets/default_profile.png';

// Importação do arquivo CSS
import '@/styles/pages/InfluencerList.css';

const InfluencerList = React.forwardRef(({ className = '', ...props }, ref) => {
  const { t, language } = useTranslation();

  const [filters, setFilters] = useState({
    search: '',
    category: '',
    platform: ''
  });

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    pageSize: 10
  });

  // Usando o hook de API aprimorado
  const {
    data: influencers,
    loading,
    error,
    execute: fetchInfluencers,
    lastError,
    clearLastError
  } = useApiCall(null, {
    showErrorToast: true,
    errorMessage: 'influencerList.fetchError',
    platform: filters.platform || 'api'
  });

  // Função para carregar influenciadores das diferentes plataformas
  const loadInfluencers = useCallback(async () => {
    try {
      let results = [];

      // Se não houver termo de busca, retorna vazio
      if (!filters.search.trim()) {
        return [];
      }

      // Array para armazenar promessas de pesquisa
      const searchPromises = [];
      const platformErrors = {};

      // Configura as promessas de busca com base nas plataformas selecionadas
      if (!filters.platform || filters.platform.toLowerCase() === 'instagram') {
        searchPromises.push(
          instagramService.analyzeInfluencer(filters.search)
            .then(data => {
              if (data) {
                const adaptedData = adaptPlatformData(data, 'instagram');
                results.push(adaptedData);
              }
            })
            .catch(error => {
              console.error('Instagram search error:', error);
              platformErrors.instagram = error;
            })
        );
      }

      if (!filters.platform || filters.platform.toLowerCase() === 'youtube') {
        searchPromises.push(
          youtubeService.analyzeInfluencer(filters.search)
            .then(data => {
              if (data) {
                const adaptedData = adaptPlatformData(data, 'youtube');
                results.push(adaptedData);
              }
            })
            .catch(error => {
              console.error('YouTube search error:', error);
              platformErrors.youtube = error;
            })
        );
      }

      if (!filters.platform || filters.platform.toLowerCase() === 'linkedin') {
        searchPromises.push(
          linkedinService.analyzeInfluencer(filters.search)
            .then(data => {
              if (data) {
                const adaptedData = adaptPlatformData(data, 'linkedin');
                results.push(adaptedData);
              }
            })
            .catch(error => {
              console.error('LinkedIn search error:', error);
              platformErrors.linkedin = error;
            })
        );
      }

      // Aguarda todas as promessas serem resolvidas, mesmo que algumas falhem
      await Promise.allSettled(searchPromises);

      // Se todas as plataformas falharam e não temos resultados, lança o erro da plataforma específica ou um erro genérico
      if (results.length === 0 && Object.keys(platformErrors).length > 0) {
        // Se foi selecionada uma plataforma específica, lança o erro dessa plataforma
        if (filters.platform && platformErrors[filters.platform.toLowerCase()]) {
          throw platformErrors[filters.platform.toLowerCase()];
        }
        // Caso contrário, lança um erro genérico
        throw new Error(t('influencerList.noResultsFoundError'));
      }

      // Filtra resultados por categoria se necessário
      if (filters.category && results.length > 0) {
        results = results.filter(inf =>
          inf.categories?.some(cat =>
            cat.toLowerCase().includes(filters.category.toLowerCase())
          )
        );
      }

      // Calcula total de páginas
      const totalPages = Math.ceil(results.length / pagination.pageSize);
      setPagination(prev => ({
        ...prev,
        totalPages: Math.max(1, totalPages)
      }));

      // Aplica paginação
      const startIndex = (pagination.currentPage - 1) * pagination.pageSize;
      const endIndex = startIndex + pagination.pageSize;

      return results.slice(startIndex, endIndex);
    } catch (err) {
      errorService.reportError('influencer_search_failed', err, {
        filters,
        component: 'InfluencerList'
      });
      throw err;
    }
  }, [filters, pagination.currentPage, pagination.pageSize, t]);

  // Executa a busca quando os filtros ou a página mudam
  useEffect(() => {
    fetchInfluencers(loadInfluencers);
  }, [fetchInfluencers, loadInfluencers, filters, pagination.currentPage, language]);

  // Tratamento de mudança de página
  const handlePageChange = (page) => {
    setPagination(prev => ({
      ...prev,
      currentPage: page
    }));
  };

  // Manipula a busca
  const handleSearch = (value) => {
    setFilters(prev => ({
      ...prev,
      search: value,
      // Reseta para a primeira página quando a busca muda
      page: 1
    }));
  };

  // Formata números para exibição
  const formatNumber = (num) => {
    if (!num && num !== 0) return '0';

    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  // Determina classe CSS para o Trust Score
  const getTrustScoreClass = (score) => {
    if (!score && score !== 0) return 'medium';

    if (score >= 80) return 'high';
    if (score >= 60) return 'medium';
    return 'low';
  };

  return (
    <div className={`influencer-list-container ${className}`} ref={ref} {...props}>
      <div className="list-header">
        <h2>{t('influencerList.title')}</h2>
        <Button
          onClick={() => window.location.href = '/influencer/new'}
          className="add-button"
        >
          {t('influencerList.addButton')}
        </Button>
      </div>

      <Card className="filter-card">
        <CardContent className="filter-content">
          <div className="filter-section">
            <SearchBar
              placeholder={t('influencerList.searchPlaceholder')}
              onSearch={handleSearch}
              className="search-input"
              maxWidth="100%"
              realtime={false}
              debounceTime={500}
            />

            <Select
              value={filters.category}
              onValueChange={(value) => setFilters(prev => ({ ...prev, category: value }))}
            >
              <SelectTrigger className="category-select">
                <SelectValue placeholder={t('influencerList.allCategories')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">{t('influencerList.allCategories')}</SelectItem>
                <SelectItem value="Saúde">{t('categories.health')}</SelectItem>
                <SelectItem value="Nutrição">{t('categories.nutrition')}</SelectItem>
                <SelectItem value="Fitness">{t('categories.fitness')}</SelectItem>
                <SelectItem value="Beleza">{t('categories.beauty')}</SelectItem>
                <SelectItem value="Lifestyle">{t('categories.lifestyle')}</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filters.platform}
              onValueChange={(value) => setFilters(prev => ({ ...prev, platform: value, page: 1 }))}
            >
              <SelectTrigger className="platform-select">
                <SelectValue placeholder={t('influencerList.allPlatforms')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">{t('influencerList.allPlatforms')}</SelectItem>
                <SelectItem value="instagram">Instagram</SelectItem>
                <SelectItem value="youtube">YouTube</SelectItem>
                <SelectItem value="linkedin">LinkedIn</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Alerta de Erro */}
      {lastError && (
        <ApiErrorAlert
          error={lastError}
          platform={filters.platform || undefined}
          onClose={clearLastError}
          autoClose={false}
          className="mb-4"
        />
      )}

      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>{t('influencerList.loading')}</p>
        </div>
      ) : error ? (
        <div className="error-message">
          <img src={errorImage} alt="Error" className="error-image" />
          <p>{error.message || t('influencerList.errorMessage')}</p>
        </div>
      ) : (
        <Card className="table-card">
          <CardContent className="table-content">
            {(!influencers || influencers.length === 0) ? (
              <div className="no-results">
                {filters.search ? (
                  <>
                    <img src={notFoundImage} alt="No results" className="no-results-image" />
                    <p>{t('influencerList.noResults')}</p>
                  </>
                ) : (
                  <p>{t('influencerList.searchPrompt')}</p>
                )}
              </div>
            ) : (
              <>
                <table className="influencers-table">
                  <thead>
                    <tr>
                      <th>{t('influencerList.table.name')}</th>
                      <th>{t('influencerList.table.platform')}</th>
                      <th>{t('influencerList.table.followers')}</th>
                      <th>{t('influencerList.table.categories')}</th>
                      <th>{t('influencerList.table.trustScore')}</th>
                      <th>{t('influencerList.table.fakeNews')}</th>
                      <th>{t('influencerList.table.actions')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {influencers.map(influencer => (
                      <tr key={`${influencer.platform}-${influencer.id}`}>
                        <td className="influencer-name">
                          <div className="name-with-image">
                            <img
                              src={influencer.profilePictureUrl || influencer.thumbnailUrl || defaultProfileImage}
                              alt={influencer.username || influencer.fullName}
                              className="profile-thumbnail"
                              onError={(e) => {
                                e.target.src = defaultProfileImage;
                              }}
                            />
                            {influencer.username || influencer.fullName || influencer.name}
                          </div>
                        </td>
                        <td>
                          <Badge>{influencer.platform}</Badge>
                        </td>
                        <td>{formatNumber(influencer.followers || influencer.followersCount)}</td>
                        <td>
                          <div className="categories-cell">
                            {influencer.categories ? influencer.categories.map(category => (
                              <Badge key={category} variant="outline" className="category-badge">
                                {category}
                              </Badge>
                            )) : (
                              <Badge variant="outline" className="category-badge">
                                {t('categories.notClassified')}
                              </Badge>
                            )}
                          </div>
                        </td>
                        <td>
                          <span className={`trust-score-badge ${getTrustScoreClass(influencer.trustScore)}`}>
                            {influencer.trustScore ? `${influencer.trustScore}%` : 'N/A'}
                          </span>
                        </td>
                        <td>
                          <Badge
                            variant={influencer.jaPostouFakeNews ? "destructive" : "outline"}
                            className="status-badge"
                          >
                            {influencer.jaPostouFakeNews ? t('influencerList.yes') : t('influencerList.no')}
                          </Badge>
                        </td>
                        <td>
                          <a
                            href={`/influencer/${influencer.platform.toLowerCase()}/${influencer.id}`}
                            className="view-details"
                          >
                            {t('influencerList.viewDetails')}
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {pagination.totalPages > 1 && (
                  <div className="pagination">
                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        variant={pagination.currentPage === page ? "default" : "outline"}
                        onClick={() => handlePageChange(page)}
                        className={`pagination-button ${pagination.currentPage === page ? 'active' : ''}`}
                      >
                        {page}
                      </Button>
                    ))}
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
});

InfluencerList.displayName = 'InfluencerList';

export default InfluencerList;