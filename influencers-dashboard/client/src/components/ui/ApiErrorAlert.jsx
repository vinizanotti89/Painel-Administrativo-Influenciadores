import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import useTranslation from '@/hooks/useTranslation';
import '@/styles/components/ui/ApiErrorAlert.css';

/**
 * Componente para exibir erros de API com tratamento para diferentes plataformas
 * e sugestões de solução para o usuário
 */
const ApiErrorAlert = ({ error, platform = '', onClose, className = '' }) => {
    const { t } = useTranslation();

    // Determina o título de erro com base na plataforma
    const getErrorTitle = () => {
        if (!error) return t('errors.generic.title');

        if (platform) {
            // Tente obter mensagem específica para esta plataforma
            const platformKey = platform.toLowerCase();
            if (platformKey === 'instagram') {
                return t('errors.instagram.title');
            } else if (platformKey === 'youtube') {
                return t('errors.youtube.title');
            } else if (platformKey === 'linkedin') {
                return t('errors.linkedin.title');
            }
        }

        // Mensagem genérica para qualquer erro
        return t('errors.generic.title');
    };

    // Determina a mensagem de erro com base no tipo de erro
    const getErrorMessage = () => {
        if (!error) return t('errors.generic.message');

        const errorString = typeof error === 'string' ? error.toLowerCase() : '';

        // Verifique os padrões comuns de erro
        if (errorString.includes('not found') || errorString.includes('404')) {
            return t('errors.notFound.message');
        }
        else if (errorString.includes('timeout') || errorString.includes('time out')) {
            return t('errors.timeout.message');
        }
        else if (errorString.includes('rate limit') || errorString.includes('too many requests') || errorString.includes('429')) {
            return t('errors.rateLimit.message');
        }
        else if (errorString.includes('authentication') || errorString.includes('auth') || errorString.includes('unauthorized') || errorString.includes('401')) {
            return t('errors.authentication.message');
        }
        else if (errorString.includes('forbidden') || errorString.includes('403')) {
            return t('errors.forbidden.message');
        }
        else if (errorString.includes('server error') || errorString.includes('5xx') || errorString.includes('500')) {
            return t('errors.server.message');
        }

        // Erro específico da plataforma ou erro genérico
        if (platform) {
            const platformKey = platform.toLowerCase();
            if (platformKey === 'instagram' || platformKey === 'youtube' || platformKey === 'linkedin') {
                return t(`errors.${platformKey}.message`);
            }
        }

        // Mensagem genérica para qualquer outro tipo de erro
        return typeof error === 'string' ? error : t('errors.generic.message');
    };

    // Retorna sugestões para corrigir o erro
    const getErrorSuggestion = () => {
        if (!error) return '';

        const errorString = typeof error === 'string' ? error.toLowerCase() : '';

        if (errorString.includes('not found') || errorString.includes('404')) {
            return t('errors.notFound.suggestion');
        }
        else if (errorString.includes('timeout') || errorString.includes('time out')) {
            return t('errors.timeout.suggestion');
        }
        else if (errorString.includes('rate limit') || errorString.includes('too many requests') || errorString.includes('429')) {
            return t('errors.rateLimit.suggestion');
        }

        // Sugestão específica para plataforma
        if (platform) {
            const platformKey = platform.toLowerCase();
            if (platformKey === 'instagram' || platformKey === 'youtube' || platformKey === 'linkedin') {
                return t(`errors.${platformKey}.suggestion`);
            }
        }

        return t('errors.generic.suggestion');
    };

    if (!error) return null;

    return (
        <div className={`api-error-alert bg-red-50 border-l-4 border-red-400 p-4 mb-4 rounded ${className}`}>
            <div className="flex items-start justify-between">
                <div className="flex items-start">
                    <AlertTriangle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                    <div>
                        <h3 className="text-sm font-medium text-red-800">
                            {getErrorTitle()}
                        </h3>
                        <div className="mt-1 text-sm text-red-700">
                            <p>{getErrorMessage()}</p>
                            {getErrorSuggestion() && (
                                <p className="mt-1 text-sm text-red-600">
                                    {getErrorSuggestion()}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
                {onClose && (
                    <button
                        type="button"
                        className="ml-auto -mx-1.5 -my-1.5 bg-red-50 text-red-500 rounded-lg focus:ring-2 focus:ring-red-400 p-1.5 inline-flex items-center justify-center h-8 w-8"
                        onClick={onClose}
                        aria-label="Fechar"
                    >
                        <X className="h-4 w-4" />
                    </button>
                )}
            </div>
        </div>
    );
};

export default ApiErrorAlert;