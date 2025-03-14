import React, { useEffect } from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import useAsyncState from '@/hooks/useAsyncState';
import instagramService from '@/services/instagram';
import { useLanguage } from '@/contexts/LanguageContext';
import { errorService } from '@/lib/errorMessages';
import '@/styles/components/instagram/InstagramAuthTest.css';

const InstagramAuthTest = React.forwardRef(({ className = '', ...props }, ref) => {
    const { language } = useLanguage();

    // Usando o hook unificado de estado assíncrono
    const {
        data,
        loading,
        error,
        execute: testConnection,
        isSuccess,
        isError
    } = useAsyncState(instagramService.testConnection.bind(instagramService), {
        platform: 'instagram',
        errorCategory: errorService.ERROR_CATEGORIES.API,
        onError: (err) => {
            errorService.reportError('instagram_connection_error', err, { component: 'InstagramAuthTest' });
        }
    });

    useEffect(() => {
        testConnection();
    }, [testConnection]);

    const texts = {
        pt: {
            title: 'Teste de Autenticação da API Instagram',
            testing: 'Testando conexão com a API...',
            success: 'Conexão estabelecida com sucesso!',
            profileData: 'Dados do perfil:',
            permissions: 'Permissões ativas:',
            errorPrefix: 'Erro ao conectar com a API:'
        },
        en: {
            title: 'Instagram API Authentication Test',
            testing: 'Testing API connection...',
            success: 'Connection established successfully!',
            profileData: 'Profile data:',
            permissions: 'Active permissions:',
            errorPrefix: 'Error connecting to API:'
        }
    };

    const t = texts[language];

    return (
        <div className={`instagram-auth-container ${className}`} ref={ref} {...props}>
            <h2 className="instagram-auth-title">{t.title}</h2>

            {loading && (
                <div className="instagram-auth-pending">
                    <div className="instagram-auth-spinner"></div>
                    <span>{t.testing}</span>
                </div>
            )}

            {isSuccess && data && (
                <>
                    <Alert className="instagram-auth-success-alert">
                        <CheckCircle className="instagram-auth-success-icon" />
                        <AlertDescription className="instagram-auth-success-message">
                            {t.success}
                        </AlertDescription>
                    </Alert>

                    <div className="instagram-auth-data-container">
                        <h3 className="instagram-auth-data-title">{t.profileData}</h3>
                        <pre className="instagram-auth-data-content">
                            {JSON.stringify(data, null, 2)}
                        </pre>
                    </div>

                    {data.permissions && (
                        <div className="instagram-auth-permissions">
                            <h3 className="instagram-auth-permissions-title">{t.permissions}</h3>
                            <ul className="instagram-auth-permissions-list">
                                {data.permissions.map(permission => (
                                    <li key={permission}>{permission}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </>
            )}

            {isError && (
                <Alert variant="destructive" className="instagram-auth-error">
                    <AlertCircle className="instagram-auth-error-icon" />
                    <AlertDescription className="instagram-auth-error-message">
                        {t.errorPrefix} {error?.message || 'Erro desconhecido'}
                    </AlertDescription>
                </Alert>
            )}
        </div>
    );
});

InstagramAuthTest.displayName = 'InstagramAuthTest';

export default InstagramAuthTest;