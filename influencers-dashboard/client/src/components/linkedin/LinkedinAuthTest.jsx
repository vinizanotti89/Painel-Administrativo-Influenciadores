import React, { useEffect } from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import useAsyncState from '@/hooks/useAsyncState';
import { linkedinService } from '@/services/linkedin';
import { errorService } from '@/lib/errorMessages';
import useTranslation from '@/hooks/useTranslation';
import '@/styles/components/linkedin/LinkedinAuthTest.css';

/**
 * Componente para testar a autenticação com a API do LinkedIn
 * Exibe o status da conexão e informações do perfil se conectado
 */
const LinkedinAuthTest = React.forwardRef(({ className = '', ...props }, ref) => {
    const { t } = useTranslation();

    // Usando o hook unificado de estado assíncrono
    const {
        data,
        loading,
        error,
        execute: testConnection,
        isSuccess,
        isError
    } = useAsyncState(linkedinService.testConnection.bind(linkedinService), {
        platform: 'linkedin',
        errorCategory: errorService.ERROR_CATEGORIES.API,
        onError: (err) => {
            errorService.reportError('linkedin_connection_error', err, { component: 'LinkedinAuthTest' });
        }
    });

    useEffect(() => {
        testConnection();
    }, [testConnection]);

    return (
        <div className={`linkedin-auth-container ${className}`} ref={ref} {...props}>
            <h2 className="linkedin-auth-title">{t('linkedin.auth.title')}</h2>

            {loading && (
                <div className="linkedin-auth-pending">
                    <div className="linkedin-auth-spinner"></div>
                    <span>{t('linkedin.auth.testing')}</span>
                </div>
            )}

            {isSuccess && data && (
                <>
                    <Alert className="linkedin-auth-success-alert">
                        <CheckCircle className="linkedin-auth-success-icon" />
                        <AlertDescription className="linkedin-auth-success-message">
                            {t('linkedin.auth.success')}
                        </AlertDescription>
                    </Alert>

                    <div className="linkedin-auth-data-container">
                        <h3 className="linkedin-auth-data-title">{t('linkedin.auth.profileData')}</h3>
                        <pre className="linkedin-auth-data-content">
                            {JSON.stringify(data, null, 2)}
                        </pre>
                    </div>

                    {data.permissions && (
                        <div className="linkedin-auth-permissions">
                            <h3 className="linkedin-auth-permissions-title">{t('linkedin.auth.permissions')}</h3>
                            <ul className="linkedin-auth-permissions-list">
                                {data.permissions.map(permission => (
                                    <li key={permission}>{permission}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </>
            )}

            {isError && (
                <Alert variant="destructive" className="linkedin-auth-error">
                    <AlertCircle className="linkedin-auth-error-icon" />
                    <AlertDescription className="linkedin-auth-error-message">
                        {t('linkedin.auth.errorPrefix')} {error?.message || t('errors.unknown')}
                    </AlertDescription>
                </Alert>
            )}
        </div>
    );
});

LinkedinAuthTest.displayName = 'LinkedinAuthTest';

export default LinkedinAuthTest;