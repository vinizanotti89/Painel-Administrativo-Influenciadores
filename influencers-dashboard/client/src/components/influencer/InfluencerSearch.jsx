// InfluencerSearch.jsx - Componente de busca aprimorado
import React, { useState } from 'react';
import { Loader } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ApiErrorAlert from '@/components/ui/ApiErrorAlert';
import useTranslation from '@/hooks/useTranslation';

// Importando serviços
import instagramService from '@/services/instagram';
import youtubeService from '@/services/youtube';
import linkedinService from '@/services/linkedin';
import { adaptPlatformData } from '@/services/adapters';

// Imagens para estados de erro e perfil padrão
import defaultProfileImage from '@/assets/default_profile.png';

const InfluencerSearch = () => {
    const { t } = useTranslation();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPlatform, setSelectedPlatform] = useState('all');
    const [error, setError] = useState(null);
    const [isSearching, setIsSearching] = useState(false);
    const [searchResults, setSearchResults] = useState([]);

    // Função para calcular pontuação de confiança (Trust Score)
    const calculateTrustScore = (result) => {
        if (!result) return 0;

        // Se já temos um trustScore calculado pelo serviço, usamos ele
        if (result.trustScore !== undefined) return result.trustScore;

        // Caso contrário, calculamos com base em métricas disponíveis
        const engagementWeight = 0.6;
        const followersWeight = 0.4;

        const engagement = parseFloat(result.metrics?.engagement) || 0;
        const followers = parseInt(result.followers) || 0;

        // Normalização de followers (assumindo 100k como um bom número)
        const followerScore = Math.min(followers / 100000 * 100, 100);

        // Normalização de engagement (assumindo 5% como um bom engagement)
        const engagementScore = Math.min(engagement * 20, 100);

        const trustScore = Math.round(
            (engagementScore * engagementWeight) + (followerScore * followersWeight)
        );

        return Math.min(trustScore, 100);
    };

    // Função para formatar números (K, M)
    const formatNumber = (num) => {
        if (!num) return '0';
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        }
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    };

    // Função para determinar a classe de trustScore
    const getTrustScoreClass = (score) => {
        if (score >= 80) return 'high';
        if (score >= 60) return 'medium';
        return 'low';
    };

    // Função para buscar influenciador
    const searchInfluencer = async () => {
        if (!searchTerm.trim()) {
            setError(t('search.errors.emptySearch'));
            return;
        }

        setIsSearching(true);
        setError(null);
        setSearchResults([]);

        try {
            let results = [];

            // Buscar em todas as plataformas selecionadas
            if (selectedPlatform === 'all' || selectedPlatform === 'instagram') {
                try {
                    const instagramResult = await instagramService.getProfileByUsername(searchTerm);
                    if (instagramResult) {
                        const adaptedResult = adaptPlatformData(instagramResult, 'instagram');
                        // Adicionar categorias ou propriedades adicionais ao influenciador se necessário
                        results.push({
                            ...adaptedResult,
                            trustScore: calculateTrustScore(adaptedResult)
                        });
                    }
                } catch (error) {
                    console.error('Erro ao buscar no Instagram:', error);
                    // Não interrompe a busca em outras plataformas
                }
            }

            if (selectedPlatform === 'all' || selectedPlatform === 'youtube') {
                try {
                    const youtubeResult = await youtubeService.getChannelByIdentifier(searchTerm);
                    if (youtubeResult) {
                        const adaptedResult = adaptPlatformData(youtubeResult, 'youtube');
                        results.push({
                            ...adaptedResult,
                            trustScore: calculateTrustScore(adaptedResult)
                        });
                    }
                } catch (error) {
                    console.error('Erro ao buscar no YouTube:', error);
                }
            }

            if (selectedPlatform === 'all' || selectedPlatform === 'linkedin') {
                try {
                    const linkedinResult = await linkedinService.getProfileByUsername(searchTerm);
                    if (linkedinResult) {
                        const adaptedResult = adaptPlatformData(linkedinResult, 'linkedin');
                        results.push({
                            ...adaptedResult,
                            trustScore: calculateTrustScore(adaptedResult)
                        });
                    }
                } catch (error) {
                    console.error('Erro ao buscar no LinkedIn:', error);
                }
            }

            if (results.length === 0) {
                setError(t('search.errors.noResults'));
            } else {
                setSearchResults(results);
            }
        } catch (error) {
            console.error('Erro na busca:', error);
            setError(error.message || t('search.errors.general'));
        } finally {
            setIsSearching(false);
        }
    };

    // Função para lidar com a tecla Enter
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            searchInfluencer();
        }
    };

    return (
        <div className="influencer-search">
            <div className="search-form mb-6">
                <div className="search-input-group flex gap-2 mb-4">
                    <Input
                        type="text"
                        placeholder={t('search.placeholder')}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="search-input flex-grow"
                    />

                    <Select
                        value={selectedPlatform}
                        onValueChange={setSelectedPlatform}
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder={t('search.platforms.all')} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">{t('search.platforms.all')}</SelectItem>
                            <SelectItem value="instagram">Instagram</SelectItem>
                            <SelectItem value="youtube">YouTube</SelectItem>
                            <SelectItem value="linkedin">LinkedIn</SelectItem>
                        </SelectContent>
                    </Select>

                    <Button
                        onClick={searchInfluencer}
                        disabled={isSearching}
                        className="search-button"
                    >
                        {isSearching ? (
                            <>
                                <Loader className="mr-2 h-4 w-4 animate-spin" />
                                {t('search.searching')}
                            </>
                        ) : t('search.button')}
                    </Button>
                </div>
            </div>

            {error && (
                <ApiErrorAlert
                    error={error}
                    platform={selectedPlatform}
                    onClose={() => setError(null)}
                    className="mb-6"
                />
            )}

            {/* Estado de carregamento */}
            {isSearching && (
                <div className="loading-state flex flex-col items-center justify-center py-8">
                    <Loader className="h-8 w-8 animate-spin mb-2" />
                    <p>{t('search.searching')}</p>
                </div>
            )}

            {/* Resultados vazios */}
            {!isSearching && searchResults.length === 0 && searchTerm && !error && (
                <div className="empty-results flex flex-col items-center justify-center py-8">
                    <p className="text-center text-gray-500">
                        {t('search.noResults')}
                    </p>
                </div>
            )}

            {/* Resultados da busca */}
            <div className="search-results grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {searchResults.map((result, index) => (
                    <Card key={`${result.platform}-${result.id || index}`} className="result-card">
                        <CardContent className="result-content p-4">
                            <div className="result-header flex items-center mb-4">
                                <div className="result-avatar-container mr-3">
                                    {result.thumbnailUrl ? (
                                        <img
                                            src={result.thumbnailUrl}
                                            alt={result.username}
                                            className="result-avatar w-12 h-12 rounded-full object-cover"
                                            onError={(e) => {
                                                e.target.src = defaultProfileImage;
                                            }}
                                        />
                                    ) : (
                                        <div className="result-avatar w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                                            <span className="text-gray-500 font-bold">
                                                {result.username ? result.username.charAt(0).toUpperCase() : '?'}
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <div className="result-info flex-grow">
                                    <h3 className="result-name font-medium text-lg">{result.username}</h3>
                                    <div className="flex items-center">
                                        <Badge className={`platform-badge ${result.platform.toLowerCase()}`}>
                                            {result.platform}
                                        </Badge>
                                        <span className="ml-2 text-sm text-gray-500">
                                            {formatNumber(result.followers)} {t('search.stats.followers')}
                                        </span>
                                    </div>
                                </div>
                                <div className={`trust-score ${getTrustScoreClass(result.trustScore)} ml-2 text-center`}>
                                    <div className="score-value font-bold">
                                        {result.trustScore}%
                                    </div>
                                    <div className="score-label text-xs">
                                        {t('search.stats.trust')}
                                    </div>
                                </div>
                            </div>

                            <div className="result-stats grid grid-cols-3 gap-2 mb-4">
                                <div className="stat-item text-center p-2 bg-gray-50 rounded">
                                    <span className="stat-label block text-xs text-gray-500">{t('search.stats.followers')}</span>
                                    <span className="stat-value font-medium">{formatNumber(result.followers || 0)}</span>
                                </div>

                                {result.metrics?.engagement !== undefined && (
                                    <div className="stat-item text-center p-2 bg-gray-50 rounded">
                                        <span className="stat-label block text-xs text-gray-500">{t('search.stats.engagement')}</span>
                                        <span className="stat-value font-medium">
                                            {typeof result.metrics.engagement === 'number'
                                                ? `${result.metrics.engagement.toFixed(2)}%`
                                                : result.metrics.engagement}
                                        </span>
                                    </div>
                                )}

                                {result.metrics?.posts !== undefined && (
                                    <div className="stat-item text-center p-2 bg-gray-50 rounded">
                                        <span className="stat-label block text-xs text-gray-500">{t('search.stats.posts')}</span>
                                        <span className="stat-value font-medium">{result.metrics.posts}</span>
                                    </div>
                                )}

                                {result.metrics?.videos !== undefined && (
                                    <div className="stat-item text-center p-2 bg-gray-50 rounded">
                                        <span className="stat-label block text-xs text-gray-500">{t('search.stats.videos')}</span>
                                        <span className="stat-value font-medium">{result.metrics.videos}</span>
                                    </div>
                                )}

                                {result.metrics?.views !== undefined && (
                                    <div className="stat-item text-center p-2 bg-gray-50 rounded">
                                        <span className="stat-label block text-xs text-gray-500">{t('search.stats.views')}</span>
                                        <span className="stat-value font-medium">{formatNumber(result.metrics.views)}</span>
                                    </div>
                                )}
                            </div>

                            <div className="result-actions flex justify-between">
                                <Button
                                    size="sm"
                                    className="view-details-btn"
                                    onClick={() => window.location.href = `/influencer/${result.platform.toLowerCase()}/${result.id || result.username}`}
                                >
                                    {t('search.viewDetails')}
                                </Button>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="analyze-btn"
                                    onClick={() => window.location.href = `/analyze/${result.platform.toLowerCase()}/${result.id || result.username}`}
                                >
                                    {t('search.analyze')}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default InfluencerSearch;