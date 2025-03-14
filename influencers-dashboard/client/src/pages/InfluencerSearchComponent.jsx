import React, { useState, useCallback } from 'react';
import { Loader } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SearchBar } from '@/components/ui/SearchBar';
import ApiErrorAlert from '@/components/ui/ApiErrorAlert';
import ErrorBoundary from '@/components/ui/ErrorBoundary';
import { useToast } from '@/components/ui/Toast';

// Serviços de API
import instagramService from '@/services/instagram';
import youtubeService from '@/services/youtube';
import linkedinService from '@/services/linkedin';
import { adaptPlatformData } from '@/services/adapters';
import useApiCall from '@/hooks/useApiCall';
import useInfluencerSearch from '@/hooks/useInfluencerSearch';
import useTranslation from '@/hooks/useTranslation';

// Imagens para estados de erro e perfil padrão
import errorImage from '@/assets/error_404.png';
import notFoundImage from '@/assets/not_found.png';
import defaultProfileImage from '@/assets/default_profile.png';

import '@/styles/pages/InfluencerSearchComponent.css';

const InfluencerSearchComponent = React.forwardRef(({ className = '', ...props }, ref) => {
    const { t } = useTranslation();
    const { toast } = useToast();

    // Estado para selecionar plataforma
    const [selectedPlatform, setSelectedPlatform] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');

    // Usa o hook useApiCall para monitorar uma chamada específica
    const { execute: fetchInfluencer, loading: singleFetchLoading, error: singleFetchError } = useApiCall(null, {
        showErrorToast: true,
        platform: selectedPlatform || 'all',
        errorMessage: 'errors.influencerFetchFailed'
    });

    // Hook para busca de influenciadores
    const searchInfluencers = useCallback(async (params) => {
        // Na implementação real, isso usaria a API de back-end
        const fetchFunction = async (filters) => {
            try {
                const platformRequests = [];

                if (!filters.platform || filters.platform === 'instagram') {
                    platformRequests.push(
                        instagramService.analyzeInfluencer(filters.search)
                            .then(data => adaptPlatformData(data, 'instagram'))
                            .catch(error => {
                                console.error('Instagram search error:', error);
                                return null;
                            })
                    );
                }

                if (!filters.platform || filters.platform === 'youtube') {
                    platformRequests.push(
                        youtubeService.analyzeInfluencer(filters.search)
                            .then(data => adaptPlatformData(data, 'youtube'))
                            .catch(error => {
                                console.error('YouTube search error:', error);
                                return null;
                            })
                    );
                }

                if (!filters.platform || filters.platform === 'linkedin') {
                    platformRequests.push(
                        linkedinService.analyzeInfluencer(filters.search)
                            .then(data => adaptPlatformData(data, 'linkedin'))
                            .catch(error => {
                                console.error('LinkedIn search error:', error);
                                return null;
                            })
                    );
                }

                const results = await Promise.allSettled(platformRequests);

                // Filtra resultados válidos
                let data = results
                    .filter(result => result.status === 'fulfilled' && result.value)
                    .map(result => result.value);

                // Aplica filtro de categoria se necessário
                if (filters.category) {
                    data = data.filter(inf =>
                        inf.audience &&
                        inf.audience.demographics &&
                        inf.audience.demographics.topCategories &&
                        inf.audience.demographics.topCategories.some(
                            cat => cat.toLowerCase().includes(filters.category.toLowerCase())
                        )
                    );
                }

                return {
                    data,
                    total: data.length,
                    hasMore: false
                };
            } catch (error) {
                console.error('Error searching influencers:', error);
                throw error;
            }
        };

        return await fetchFunction(params);
    }, []);

    const {
        filters,
        results,
        loading,
        error,
        totalResults,
        hasMore,
        updateFilters,
        loadMoreResults,
        resetFilters
    } = useInfluencerSearch({
        fetchFunction: searchInfluencers,
        initialFilters: {
            search: '',
            platform: '',
            category: '',
            limit: 12
        }
    });

    // Manipulador da pesquisa
    const handleSearch = useCallback((term) => {
        // Utiliza o hook useApiCall para verificar se o termo é válido antes de realizar a busca
        if (term) {
            fetchInfluencer(async () => {
                // Validação rápida do termo de busca
                if (term.length < 2) {
                    throw new Error(t('errors.searchTermTooShort'));
                }
                // Se passou da validação, prossegue com a busca
                updateFilters({
                    search: term,
                    platform: selectedPlatform,
                    category: selectedCategory
                });
                return true;
            });
        } else {
            updateFilters({
                search: term,
                platform: selectedPlatform,
                category: selectedCategory
            });
        }
    }, [updateFilters, selectedPlatform, selectedCategory, fetchInfluencer, t]);

    // Formata números para exibição
    const formatNumber = (num) => {
        if (!num && num !== 0) return '-';

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

    // Processar categorias de um influenciador para exibição
    const getCategories = (influencer) => {
        if (!influencer || !influencer.audience || !influencer.audience.demographics) {
            return [t('categories.general')];
        }

        // Primeiro tenta obter categorias diretas
        if (influencer.audience.demographics.topCategories) {
            return influencer.audience.demographics.topCategories;
        }

        // Caso contrário, tenta extrair das principais indústrias (LinkedIn)
        if (influencer.audience.demographics.topIndustries) {
            return influencer.audience.demographics.topIndustries.map(industry => industry.name);
        }

        // Para plataformas diferentes
        if (influencer.platform === 'Instagram') {
            return [t('categories.lifestyle')];
        } else if (influencer.platform === 'YouTube') {
            return [t('categories.entertainment')];
        } else if (influencer.platform === 'LinkedIn') {
            return [t('categories.professional')];
        }

        return [t('categories.general')];
    };

    return (
        <ErrorBoundary fallback={
            <div className="error-container">
                <img src={errorImage} alt="Error" className="error-image" />
                <h2>{t('errors.pageError')}</h2>
                <p>{t('errors.tryAgain')}</p>
                <Button onClick={() => window.location.reload()}>{t('actions.refresh')}</Button>
            </div>
        }>
            <div className={`search-component-container ${className}`} ref={ref} {...props}>
                <h1 className="search-component-title">{t('influencerSearch.title')}</h1>

                <div className="search-header">
                    <div className="search-filters">
                        <Select
                            value={selectedCategory}
                            onValueChange={(value) => {
                                setSelectedCategory(value);
                                updateFilters({ category: value });
                            }}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder={t('influencerSearch.filters.category')} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="">{t('influencerSearch.filters.allCategories')}</SelectItem>
                                <SelectItem value="health">{t('categories.health')}</SelectItem>
                                <SelectItem value="nutrition">{t('categories.nutrition')}</SelectItem>
                                <SelectItem value="fitness">{t('categories.fitness')}</SelectItem>
                                <SelectItem value="beauty">{t('categories.beauty')}</SelectItem>
                                <SelectItem value="lifestyle">{t('categories.lifestyle')}</SelectItem>
                                <SelectItem value="technology">{t('categories.technology')}</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select
                            value={selectedPlatform}
                            onValueChange={(value) => {
                                setSelectedPlatform(value);
                                updateFilters({ platform: value.toLowerCase() });
                            }}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder={t('influencerSearch.filters.platform')} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="">{t('influencerSearch.filters.allPlatforms')}</SelectItem>
                                <SelectItem value="instagram">Instagram</SelectItem>
                                <SelectItem value="youtube">YouTube</SelectItem>
                                <SelectItem value="linkedin">LinkedIn</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="search-bar-container">
                    <SearchBar
                        placeholder={t('influencerSearch.searchPlaceholder')}
                        onSearch={handleSearch}
                        maxWidth="100%"
                        realtime={false}
                        debounceTime={500}
                    />
                </div>

                {error && (
                    <ApiErrorAlert
                        error={error}
                        platform={selectedPlatform}
                        onClose={() => resetFilters()}
                        className="mb-4"
                    />
                )}

                {singleFetchError && !error && (
                    <ApiErrorAlert
                        error={singleFetchError}
                        platform={selectedPlatform}
                        onClose={() => { }}
                        className="mb-4"
                    />
                )}

                {results.length > 0 ? (
                    <div className="influencers-grid">
                        {results.map((influencer) => (
                            <Card key={influencer.id || `${influencer.platform}-${influencer.username}`} className="influencer-card">
                                <CardHeader>
                                    <div className="influencer-header">
                                        <img
                                            src={influencer.thumbnailUrl || defaultProfileImage}
                                            alt={influencer.username}
                                            className="profile-image"
                                            onError={(e) => {
                                                e.target.src = defaultProfileImage;
                                            }}
                                        />
                                        <div className="influencer-info">
                                            <CardTitle>{influencer.username}</CardTitle>
                                            <Badge>{influencer.platform}</Badge>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="influencer-stats">
                                        <div className="stat-row">
                                            <span className="stat-label">{t('influencerSearch.stats.followers')}:</span>
                                            <span>{formatNumber(influencer.followers)}</span>
                                        </div>
                                        <div className="stat-row">
                                            <span className="stat-label">{t('influencerSearch.stats.trustScore')}:</span>
                                            <span className={`trust-score ${getTrustScoreClass(influencer.trustScore)}`}>
                                                {influencer.trustScore ? `${influencer.trustScore}%` : '-'}
                                            </span>
                                        </div>

                                        {influencer.platform === 'Instagram' && (
                                            <div className="stat-row">
                                                <span className="stat-label">{t('influencerSearch.stats.posts')}:</span>
                                                <span>{influencer.metrics?.posts || '-'}</span>
                                            </div>
                                        )}

                                        {influencer.platform === 'YouTube' && (
                                            <>
                                                <div className="stat-row">
                                                    <span className="stat-label">{t('influencerSearch.stats.views')}:</span>
                                                    <span>{formatNumber(influencer.metrics?.views)}</span>
                                                </div>
                                                <div className="stat-row">
                                                    <span className="stat-label">{t('influencerSearch.stats.videos')}:</span>
                                                    <span>{influencer.metrics?.videos || '-'}</span>
                                                </div>
                                            </>
                                        )}

                                        {influencer.platform === 'LinkedIn' && (
                                            <div className="stat-row">
                                                <span className="stat-label">{t('influencerSearch.stats.connections')}:</span>
                                                <span>{formatNumber(influencer.followers)}</span>
                                            </div>
                                        )}

                                        <div className="categories">
                                            {getCategories(influencer).map((category, index) => (
                                                <Badge key={`${category}-${index}`} variant="outline" className="category-badge">
                                                    {category}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                    <Button
                                        className="details-button"
                                        onClick={() => {
                                            window.location.href = `/influencer-details/${influencer.id}`;
                                        }}
                                    >
                                        {t('influencerSearch.viewDetails')}
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    !loading && filters.search && (
                        <div className="no-results">
                            <img src={notFoundImage} alt="No Results" className="not-found-image" />
                            <p>{t('influencerSearch.noResults')}</p>
                        </div>
                    )
                )}

                {(loading || singleFetchLoading) && (
                    <div className="loading-container">
                        <Loader className="animate-spin" size={32} />
                        <p>{t('influencerSearch.loading')}</p>
                    </div>
                )}

                {hasMore && results.length > 0 && (
                    <div className="load-more-container">
                        <Button
                            onClick={loadMoreResults}
                            disabled={loading}
                            variant="outline"
                            className="load-more-button"
                        >
                            {loading ? (
                                <>
                                    <Loader className="animate-spin mr-2" size={16} />
                                    {t('influencerSearch.loading')}
                                </>
                            ) : (
                                t('influencerSearch.loadMore')
                            )}
                        </Button>
                    </div>
                )}
            </div>
        </ErrorBoundary>
    );
});

InfluencerSearchComponent.displayName = 'InfluencerSearchComponent';

export default InfluencerSearchComponent;