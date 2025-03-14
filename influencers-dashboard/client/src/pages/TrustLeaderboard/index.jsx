import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { SearchBar } from '@/components/ui/SearchBar';
import ApiErrorAlert from '@/components/ui/ApiErrorAlert';
import ErrorBoundary from '@/components/ui/ErrorBoundary';

// Serviços de API
import { influencersApi } from '@/services/api';
import useTranslation from '@/hooks/useTranslation';
import useApiCall from '@/hooks/useApiCall';

import '@/styles/pages/TrustLeaderboard.css';

const TrustLeaderboard = () => {
    const { t } = useTranslation();
    const [influencers, setInfluencers] = useState([]);
    const [metrics, setMetrics] = useState({
        totalVerifiedClaims: 0,
        averageTrustScore: 0,
        activeInfluencers: 0
    });
    const [searchQuery, setSearchQuery] = useState('');

    // Usando o hook useApiCall para gerenciar o estado e erros da chamada
    const {
        data,
        loading,
        error,
        execute: fetchInfluencers
    } = useApiCall(
        influencersApi.getAll,
        {
            showErrorToast: true,
            errorMessage: 'errors.leaderboard.fetch'
        }
    );

    // Efeito para carregar os dados iniciais
    useEffect(() => {
        fetchInfluencers({
            trustScore: 'desc', // Ordenar por trustScore decrescente
            limit: 50,          // Limitar a 50 resultados
            verified: true      // Apenas influenciadores verificados
        });
    }, [fetchInfluencers]);

    // Efeito para processar os dados quando recebidos da API
    useEffect(() => {
        if (data && data.data) {
            // Garantir que temos um array para trabalhar
            const influencersList = Array.isArray(data.data) ? data.data : [data.data];

            // Filtrar por termo de busca se existir
            const filteredList = searchQuery
                ? influencersList.filter(inf =>
                    inf.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    inf.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    inf.category?.toLowerCase().includes(searchQuery.toLowerCase())
                )
                : influencersList;

            setInfluencers(filteredList);

            // Calcular métricas
            calculateMetrics(filteredList);
        }
    }, [data, searchQuery]);

    // Função para buscar influenciadores com filtragem
    const handleSearch = (query) => {
        setSearchQuery(query);
        if (query.trim() !== '') {
            // Se houver consulta, buscar na API com filtro
            fetchInfluencers({
                search: query,
                trustScore: 'desc',
                limit: 50
            });
        } else {
            // Sem consulta, buscar todos (com ordenação)
            fetchInfluencers({
                trustScore: 'desc',
                limit: 50,
                verified: true
            });
        }
    };

    // Calcula métricas agregadas do leaderboard
    const calculateMetrics = (influencersList) => {
        if (!influencersList || influencersList.length === 0) {
            setMetrics({
                totalVerifiedClaims: 0,
                averageTrustScore: 0,
                activeInfluencers: 0
            });
            return;
        }

        const totalVerified = influencersList.reduce((sum, inf) =>
            sum + (inf.statistics?.verifiedClaims || 0), 0);

        const avgTrust = influencersList.reduce((sum, inf) =>
            sum + (inf.trustScore || 0), 0) / influencersList.length;

        setMetrics({
            totalVerifiedClaims: totalVerified,
            averageTrustScore: avgTrust.toFixed(1),
            activeInfluencers: influencersList.length
        });
    };

    // Formata números de seguidores para exibição
    const formatFollowers = (count) => {
        if (!count && count !== 0) return '0';

        if (count >= 1000000) {
            return `${(count / 1000000).toFixed(1)}M`;
        }
        if (count >= 1000) {
            return `${(count / 1000).toFixed(1)}K`;
        }
        return count.toString();
    };

    // Retorna a classe CSS com base no Trust Score
    const getTrustScoreClass = (score) => {
        if (score >= 80) return 'high';
        if (score >= 60) return 'medium';
        return 'low';
    };

    return (
        <ErrorBoundary
            componentName="TrustLeaderboard"
            fallback={
                <div className="error-message">
                    {t('leaderboard.error.fallback')}
                </div>
            }
        >
            <div className="leaderboard-container">
                <div className="leaderboard-header">
                    <h1 className="leaderboard-title">{t('leaderboard.title')}</h1>
                    <p className="leaderboard-description">
                        {t('leaderboard.description')}
                    </p>

                    {/* Barra de pesquisa */}
                    <div className="search-container">
                        <SearchBar
                            placeholder={t('leaderboard.search')}
                            onSearch={handleSearch}
                            debounceTime={500}
                            realtime={true}
                            maxWidth="450px"
                            className="leaderboard-search"
                        />
                    </div>
                </div>

                {/* Exibe alerta de erro se houver */}
                {error && (
                    <ApiErrorAlert
                        error={error}
                        onClose={() => { }}
                        className="mb-4"
                    />
                )}

                <div className="metrics-grid">
                    <Card className="metric-card">
                        <CardHeader>
                            <CardTitle>{t('leaderboard.metrics.activeInfluencers')}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="metric-value">{metrics.activeInfluencers}</p>
                        </CardContent>
                    </Card>

                    <Card className="metric-card">
                        <CardHeader>
                            <CardTitle>{t('leaderboard.metrics.verifiedClaims')}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="metric-value">{metrics.totalVerifiedClaims}</p>
                        </CardContent>
                    </Card>

                    <Card className="metric-card">
                        <CardHeader>
                            <CardTitle>{t('leaderboard.metrics.averageTrustScore')}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="metric-value">{metrics.averageTrustScore}%</p>
                        </CardContent>
                    </Card>
                </div>

                {loading ? (
                    <div className="loading-spinner">{t('leaderboard.loading')}</div>
                ) : influencers.length === 0 ? (
                    <div className="no-results">
                        {t('leaderboard.noResults')}
                    </div>
                ) : (
                    <Card className="leaderboard-table-card">
                        <table className="leaderboard-table">
                            <thead>
                                <tr>
                                    <th>{t('leaderboard.table.rank')}</th>
                                    <th>{t('leaderboard.table.influencer')}</th>
                                    <th>{t('leaderboard.table.category')}</th>
                                    <th>{t('leaderboard.table.trustScore')}</th>
                                    <th>{t('leaderboard.table.trend')}</th>
                                    <th>{t('leaderboard.table.followers')}</th>
                                    <th>{t('leaderboard.table.verifiedClaims')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {influencers.map((influencer, index) => (
                                    <tr key={influencer.id || index}>
                                        <td>#{index + 1}</td>
                                        <td className="influencer-name">
                                            {influencer.username || influencer.name}
                                            {influencer.platform && (
                                                <Badge variant="outline" className="platform-badge">
                                                    {influencer.platform}
                                                </Badge>
                                            )}
                                        </td>
                                        <td>
                                            <Badge className="category-badge">
                                                {influencer.category || t('categories.general')}
                                            </Badge>
                                        </td>
                                        <td>
                                            <span className={`trust-score-badge ${getTrustScoreClass(influencer.trustScore)}`}>
                                                {influencer.trustScore || 0}%
                                            </span>
                                        </td>
                                        <td>
                                            {influencer.trend === 'down' ? (
                                                <TrendingDown className="trend-icon down" aria-label={t('leaderboard.trend.down')} />
                                            ) : (
                                                <TrendingUp className="trend-icon up" aria-label={t('leaderboard.trend.up')} />
                                            )}
                                        </td>
                                        <td className="followers-count">
                                            {formatFollowers(influencer.followers)}
                                        </td>
                                        <td className="verified-claims">
                                            {influencer.statistics?.verifiedClaims || 0}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </Card>
                )}
            </div>
        </ErrorBoundary>
    );
};

export default TrustLeaderboard;