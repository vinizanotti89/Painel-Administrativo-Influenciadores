import { useState, useCallback, useEffect } from 'react';
import { errorService } from '@/lib/errorMessages';

/**
 * Hook para gerenciar estados assíncronos de forma padronizada em toda a aplicação.
 * Gerencia estados de carregamento, erro e dados de forma consistente.
 * 
 * @param {Function|null} asyncFunction - Função assíncrona opcional a ser executada no início
 * @param {Object} options - Opções de configuração
 * @param {any} options.initialData - Dados iniciais
 * @param {boolean} options.immediate - Se deve executar imediatamente
 * @param {Function} options.onSuccess - Callback para sucesso
 * @param {Function} options.onError - Callback para erro
 * @param {string} options.errorCategory - Categoria de erro
 * @param {string} options.platform - Plataforma para erros específicos
 * @returns {Object} Estado e funções para gerenciamento de operações assíncronas
 */
const useAsyncState = (asyncFunction = null, options = {}) => {
    const {
        initialData = null,
        immediate = false,
        onSuccess,
        onError,
        errorCategory,
        platform
    } = options;

    const [state, setState] = useState({
        data: initialData,
        loading: false,
        error: null,
        status: 'idle' // idle, pending, fulfilled, rejected
    });

    /**
     * Executa uma função assíncrona atualizando os estados apropriadamente
     * 
     * @param {Function|Array} asyncFnOrParams - Função assíncrona ou parâmetros para função definida na inicialização
     * @param {Object} execOptions - Opções adicionais para esta execução
     * @returns {Promise} Promise com o resultado da operação
     */
    const execute = useCallback(async (asyncFnOrParams, execOptions = {}) => {
        const {
            onSuccess: execSuccess,
            onError: execError,
            resetData = false,
            errorPrefix,
            errorCode
        } = execOptions;

        // Determina a função a ser executada
        let fnToExecute;
        let params = [];

        if (typeof asyncFnOrParams === 'function') {
            fnToExecute = asyncFnOrParams;
        } else if (asyncFunction) {
            fnToExecute = asyncFunction;
            params = Array.isArray(asyncFnOrParams) ? asyncFnOrParams : [asyncFnOrParams];
        } else {
            throw new Error('Nenhuma função assíncrona fornecida para execute()');
        }

        try {
            // Inicia o carregamento
            setState(prev => ({
                ...prev,
                loading: true,
                status: 'pending',
                error: null,
                ...(resetData ? { data: initialData } : {})
            }));

            // Executa a função assíncrona
            const result = await fnToExecute(...params);

            // Atualiza o estado com os dados
            setState({
                data: result,
                loading: false,
                error: null,
                status: 'fulfilled'
            });

            // Executa callbacks de sucesso
            if (execSuccess) {
                execSuccess(result);
            } else if (onSuccess) {
                onSuccess(result);
            }

            return result;
        } catch (error) {
            // Normaliza o erro
            const normalizedError = platform
                ? errorService.normalizeError(error, platform)
                : { message: error?.message || 'Ocorreu um erro ao processar a requisição.' };

            // Após capturar um erro:
            setState({
                ...state,
                data: resetData ? initialData : state.data,
                loading: false,
                error: normalizedError,
                status: 'rejected',
                // Adicione detalhes sobre a origem do erro:
                errorContext: {
                    platform,
                    operation: errorCategory || 'api_call',
                    timestamp: new Date().toISOString()
                }
            });

            // Atualiza o estado com o erro
            setState({
                ...state,
                data: resetData ? initialData : state.data,
                loading: false,
                error: normalizedError,
                status: 'rejected'
            });

            // Reporta o erro
            if (errorCode) {
                errorService.reportError(errorCode, error, { platform });
            }

            // Executa callbacks de erro
            if (execError) {
                execError(error);
            } else if (onError) {
                onError(error);
            }

            // Propaga o erro para tratamento adicional se necessário
            throw error;
        }
    }, [asyncFunction, initialData, onSuccess, onError, platform, state]);

    /**
     * Limpa o estado de erros
     */
    const clearError = useCallback(() => {
        setState(prev => ({
            ...prev,
            error: null,
            status: prev.status === 'rejected' ? 'idle' : prev.status
        }));
    }, []);

    /**
     * Reseta o estado para o valor inicial
     */
    const reset = useCallback(() => {
        setState({
            data: initialData,
            loading: false,
            error: null,
            status: 'idle'
        });
    }, [initialData]);

    /**
     * Realiza um reset parcial do estado
     * @param {Object} stateToReset - Objeto com as propriedades a serem resetadas
     */
    const partialReset = useCallback((stateToReset = {}) => {
        setState(prev => ({
            ...prev,
            ...Object.keys(stateToReset).reduce((acc, key) => {
                if (key === 'data') acc.data = initialData;
                if (key === 'error') {
                    acc.error = null;
                    acc.status = 'idle';
                }
                if (key === 'loading') {
                    acc.loading = false;
                    if (prev.status === 'pending') acc.status = 'idle';
                }
                return acc;
            }, {})
        }));
    }, [initialData]);

    // Executa a função assíncrona imediatamente se solicitado
    useEffect(() => {
        if (immediate && asyncFunction) {
            execute(asyncFunction).catch(() => {
                // Erro já tratado no execute
            });
        }
    }, [execute, asyncFunction, immediate]);

    return {
        ...state,
        execute,
        clearError,
        reset,
        partialReset,
        setData: (data) => setState(prev => ({ ...prev, data })),
        // Helpers adicionais para verificar o estado
        isIdle: state.status === 'idle',
        isPending: state.status === 'pending' || state.loading,
        isSuccess: state.status === 'fulfilled',
        isError: state.status === 'rejected'
    };
};

export default useAsyncState;