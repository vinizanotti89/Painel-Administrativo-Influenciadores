import { useState, useCallback } from 'react';
import useAsyncState from './useAsyncState';
import { errorService } from '@/lib/errorMessages';
import useTranslation from '@/hooks/useTranslation';
import { toast } from '@/components/ui/toast'; // Ajuste o caminho conforme seu projeto

/**
 * Hook personalizado para chamadas de API com tratamento de erros e notificações
 * 
 * @param {Function|null} apiFunction - Função de API a ser executada
 * @param {Object} options - Opções configuráveis
 * @param {any} options.initialData - Dados iniciais
 * @param {boolean} options.immediate - Se deve executar a função imediatamente
 * @param {Function} options.onSuccess - Callback para sucesso
 * @param {Function} options.onError - Callback para erro
 * @param {string} options.platform - Plataforma relacionada (instagram, youtube, linkedin)
 * @param {boolean} options.showSuccessToast - Se deve mostrar toast de sucesso
 * @param {boolean} options.showErrorToast - Se deve mostrar toast de erro
 * @param {string} options.successMessage - Mensagem personalizada de sucesso
 * @param {string} options.errorMessage - Mensagem personalizada de erro
 * @returns {Object} Estado e funções para gerenciamento de chamadas de API
 */
const useApiCall = (apiFunction = null, options = {}) => {
    const {
        initialData = null,
        immediate = false,
        onSuccess,
        onError,
        platform,
        showSuccessToast = false,
        showErrorToast = true,
        successMessage,
        errorMessage,
        ...asyncOptions
    } = options;

    const { translate } = useTranslation();
    const [lastError, setLastError] = useState(null);

    // Callback para sucesso que inclui notificação toast
    const handleSuccess = useCallback((result) => {
        if (showSuccessToast) {
            const message = successMessage
                ? translate(successMessage)
                : translate('notifications.operationSuccess');

            toast({
                title: translate('notifications.success'),
                description: message,
                variant: 'success',
            });
        }

        if (onSuccess) {
            onSuccess(result);
        }
    }, [showSuccessToast, successMessage, onSuccess, translate]);

    // Callback para erro que inclui notificação toast
    const handleError = useCallback((error) => {
        setLastError(error);

        if (showErrorToast) {
            const normalizedError = errorService.normalizeError(error, platform);
            const message = errorMessage
                ? translate(errorMessage)
                : normalizedError.message;

            toast({
                title: translate('notifications.error'),
                description: message,
                variant: 'destructive',
                duration: 6000,
            });
        }

        if (onError) {
            onError(error);
        }
    }, [showErrorToast, errorMessage, onError, platform, translate]);

    // Utiliza o useAsyncState com os callbacks personalizados
    const asyncState = useAsyncState(apiFunction, {
        initialData,
        immediate,
        onSuccess: handleSuccess,
        onError: handleError,
        platform,
        ...asyncOptions
    });

    // Limpa o último erro armazenado
    const clearLastError = useCallback(() => {
        setLastError(null);
    }, []);

    return {
        ...asyncState,
        lastError,
        clearLastError
    };
};

export default useApiCall;