import React, { useEffect } from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import useAsyncState from '@/hooks/useAsyncState';
import { youtubeService } from '@/services/youtube';
import { errorService } from '@/lib/errorMessages';
import useTranslation from '@/hooks/useTranslation';
import '@/styles/components/youtube/YouTubeAuthTest.css';

/**
 * Componente para testar a autenticação com a API do YouTube
 * Exibe o status da conexão e dados do canal se conectado
 */
const YouTubeAuthTest = React.forwardRef(({ className = '', ...props }, ref) => {
    const { t } = useTranslation();

    // Usando o hook unificado de estado assíncrono
    const {
        data,
        loading,
        error,
        execute: testConnection,
        isSuccess,
        isError
    } = useAsyncState(youtubeService.testConnection.bind(youtubeService), {
        platform: 'youtube',
        errorCategory: errorService.ERROR_CATEGORIES.API,
        onError: (err) => {
            errorService.reportError('youtube_connection_error', err, { component: 'YouTubeAuthTest' });
        }
    });

    useEffect(() => {
        testConnection();
    }, [testConnection]);

    return (
        <div className={`youtube-auth-container ${className}`} ref={ref} {...props}>
            <h2 className="youtube-auth-title">{t('youtube.auth.title')}</h2>

            {loading && (
                <div className="youtube-auth-pending">
                    <div className="youtube-auth-spinner"></div>
                    <span>{t('youtube.auth.testing')}</span>
                </div>
            )}

            {isSuccess && data && (
                <>
                    <Alert className="youtube-auth-success-alert">
                        <CheckCircle className="youtube-auth-success-icon" />
                        <AlertDescription className="youtube-auth-success-message">
                            {t('youtube.auth.success')}
                        </AlertDescription>
                    </Alert>

                    <div className="youtube-auth-card">
                        <div className="youtube-auth-card-header">
                            <h3 className="youtube-auth-card-title">{t('youtube.auth.channelData')}</h3>
                        </div>
                        <div className="youtube-auth-card-content">
                            <div className="youtube-auth-channel-info">
                                {data?.channel?.snippet?.thumbnails?.default?.url && (
                                    <img
                                        src={data.channel.snippet.thumbnails.default.url}
                                        alt={t('youtube.auth.channelImage')}
                                        className="youtube-auth-channel-image"
                                    />
                                )}
                                <div className="youtube-auth-channel-details">
                                    <h3 className="youtube-auth-channel-name">
                                        {data?.channel?.snippet?.title}
                                    </h3>
                                    <p className="youtube-auth-channel-subscribers">
                                        {data?.channel?.statistics?.subscriberCount} {t('youtube.auth.subscribers')}
                                    </p>
                                </div>
                            </div>

                            <div className="youtube-auth-stats-grid">
                                <div className="youtube-auth-stat-item">
                                    {t('youtube.auth.views')} {data?.channel?.statistics?.viewCount}
                                </div>
                                <div className="youtube-auth-stat-item">
                                    {t('youtube.auth.videos')} {data?.channel?.statistics?.videoCount}
                                </div>
                                <div className="youtube-auth-stat-item">
                                    {t('youtube.auth.engagement')} {
                                        youtubeService.calculateChannelEngagement(
                                            [],
                                            data?.channel?.statistics || {}
                                        )
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {isError && (
                <Alert variant="destructive" className="youtube-auth-error">
                    <AlertCircle className="youtube-auth-error-icon" />
                    <AlertDescription className="youtube-auth-error-message">
                        {t('youtube.auth.errorPrefix')} {error?.message || t('errors.unknown')}
                    </AlertDescription>
                </Alert>
            )}
        </div>
    );
});

YouTubeAuthTest.displayName = 'YouTubeAuthTest';

export default YouTubeAuthTest;