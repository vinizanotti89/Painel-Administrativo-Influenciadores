import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from './card';
import { Badge } from './badge';
import { formatNumber, formatCurrency, truncateText } from '@/lib/utils';
import { normalizeApiError, ASYNC_OPERATIONS } from '@/lib/errorMessages';
import '@/styles/components/ui/InfluencerCard.css';

/**
 * Componente para exibir dados de um influenciador com suporte para 
 * estados de carregamento e tratamento padronizado de erros.
 */
const InfluencerCard = ({
    data,
    loading = false,
    error = null,
    onRetry = () => { },
    onClick = null,
    className = '',
}) => {
    // Normaliza o erro usando a função do sistema centralizado de erros
    const normalizedError = error ? normalizeApiError(error) : null;

    // Renderiza o estado de carregamento
    if (loading) {
        return (
            <Card className={`influencer-card influencer-card-loading ${className}`}>
                <div className="influencer-card-loading-content">
                    <div className="influencer-card-loading-avatar"></div>
                    <div className="influencer-card-loading-info">
                        <div className="influencer-card-loading-name"></div>
                        <div className="influencer-card-loading-metrics"></div>
                    </div>
                </div>
                <div className="influencer-card-loading-message">
                    {ASYNC_OPERATIONS.loading}
                </div>
            </Card>
        );
    }

    // Renderiza o estado de erro com mensagem normalizada
    if (normalizedError) {
        return (
            <Card className={`influencer-card influencer-card-error ${className}`}>
                <CardContent>
                    <div className="influencer-card-error-content">
                        <svg className="influencer-card-error-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" y1="8" x2="12" y2="12" />
                            <line x1="12" y1="16" x2="12.01" y2="16" />
                        </svg>
                        <p className="influencer-card-error-message">{normalizedError}</p>
                        <button
                            onClick={onRetry}
                            className="button button-primary button-sm"
                        >
                            Tentar novamente
                        </button>
                    </div>
                </CardContent>
            </Card>
        );
    }

    // Se não tiver dados
    if (!data) {
        return null;
    }

    // Extrair dados do influenciador
    const {
        name,
        username,
        avatarUrl,
        platforms = [],
        followers,
        engagementRate,
        averageLikes,
        averageComments,
        trustScore,
        pricePerPost,
        categories = [],
        bio,
    } = data;

    // Função para obter a classe do Trust Score 
    const getTrustScoreClass = (score) => {
        if (score >= 80) return 'high';
        if (score >= 50) return 'medium';
        return 'low';
    };

    // Função para obter o ícone da plataforma
    const getPlatformIcon = (platform) => {
        switch (platform.toLowerCase()) {
            case 'instagram':
                return (
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                );
            case 'youtube':
                return (
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                        <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                    </svg>
                );
            case 'linkedin':
                return (
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                );
            default:
                return null;
        }
    };

    return (
        <Card
            className={`influencer-card ${onClick ? 'influencer-card-clickable' : ''} ${className}`}
            onClick={onClick}
        >
            <CardHeader className="influencer-card-header">
                <div className="influencer-card-avatar">
                    {avatarUrl ? (
                        <img src={avatarUrl} alt={name} className="influencer-card-avatar-img" />
                    ) : (
                        <div className="influencer-card-avatar-placeholder">
                            {name ? name.charAt(0).toUpperCase() : '?'}
                        </div>
                    )}
                </div>

                <div className="influencer-card-title-wrapper">
                    <CardTitle className="influencer-card-title">{name}</CardTitle>

                    <div className="influencer-card-username">
                        @{username}
                    </div>

                    <div className="influencer-card-platforms">
                        {platforms.map((platform, index) => (
                            <span key={index} className={`influencer-card-platform influencer-card-platform-${platform.toLowerCase()}`}>
                                {getPlatformIcon(platform)}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="influencer-card-trust-score">
                    <div className={`trust-score ${getTrustScoreClass(trustScore)}`}>
                        {trustScore}
                    </div>
                    <span className="trust-score-label">Trust Score</span>
                </div>
            </CardHeader>

            <CardContent className="influencer-card-content">
                {bio && (
                    <div className="influencer-card-bio">
                        {truncateText(bio, 100)}
                    </div>
                )}

                <div className="influencer-card-metrics">
                    <div className="influencer-card-metric">
                        <span className="influencer-card-metric-value">{formatNumber(followers)}</span>
                        <span className="influencer-card-metric-label">Seguidores</span>
                    </div>

                    <div className="influencer-card-metric">
                        <span className="influencer-card-metric-value">{engagementRate.toFixed(2)}%</span>
                        <span className="influencer-card-metric-label">Engajamento</span>
                    </div>

                    <div className="influencer-card-metric">
                        <span className="influencer-card-metric-value">{formatNumber(averageLikes)}</span>
                        <span className="influencer-card-metric-label">Likes</span>
                    </div>

                    <div className="influencer-card-metric">
                        <span className="influencer-card-metric-value">{formatNumber(averageComments)}</span>
                        <span className="influencer-card-metric-label">Comentários</span>
                    </div>
                </div>

                {pricePerPost && (
                    <div className="influencer-card-price">
                        <span className="influencer-card-price-label">Média por post:</span>
                        <span className="influencer-card-price-value">{formatCurrency(pricePerPost)}</span>
                    </div>
                )}

                {categories.length > 0 && (
                    <div className="influencer-card-categories">
                        {categories.map((category, index) => (
                            <Badge key={index} variant="secondary" className="influencer-card-category">
                                {category}
                            </Badge>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default InfluencerCard;