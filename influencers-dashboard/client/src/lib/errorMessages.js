import { useLanguage } from '@/contexts/LanguageContext';


// Definindo as constantes diretamente no arquivo
const ERROR_CATEGORIES = {
    GENERAL: 'general',
    VALIDATION: 'validation',
    API: 'api',
    AUTH: 'auth',
    NETWORK: 'network'
};

const DEFAULT_MESSAGES = {
    [ERROR_CATEGORIES.GENERAL]: 'Ocorreu um erro inesperado',
    [ERROR_CATEGORIES.VALIDATION]: 'Há campos com informações inválidas',
    [ERROR_CATEGORIES.API]: 'Erro ao comunicar com o servidor',
    [ERROR_CATEGORIES.AUTH]: 'Erro de autenticação',
    [ERROR_CATEGORIES.NETWORK]: 'Erro de conexão com a internet'
};

const FIELD_VALIDATION = {
    REQUIRED: 'required',
    EMAIL: 'email',
    MIN_LENGTH: 'minLength',
    MAX_LENGTH: 'maxLength',
    PATTERN: 'pattern',
    USERNAME: 'username'
};

const SOCIAL_MEDIA = {
    INSTAGRAM: 'instagram',
    YOUTUBE: 'youtube',
    LINKEDIN: 'linkedin'
};

const ASYNC_OPERATIONS = {
    FETCH: 'fetch',
    SAVE: 'save',
    DELETE: 'delete',
    UPDATE: 'update',
    SEARCH: 'search'
};

const API_ERROR_CODES = {
    NOT_FOUND: 'not_found',
    RATE_LIMIT: 'rate_limit',
    INVALID_TOKEN: 'invalid_token',
    PERMISSION_DENIED: 'permission_denied',
    INVALID_REQUEST: 'invalid_request',
    SERVER_ERROR: 'server_error'
};

/**
 * Retorna a mensagem de erro traduzida com base no código ou objeto de erro
 * @param {Error|string} error - Erro ou código de erro
 * @param {string} category - Categoria de erro (opcional)
 * @param {Object} params - Parâmetros adicionais para personalização da mensagem
 * @returns {string} Mensagem de erro traduzida
 */
function getErrorMessage(error, category, params) {
    // Implementação da função original
    // Você deve incluir aqui a implementação original desta função

    // Exemplo de implementação simples (você deve substituir pela original)
    if (!error) {
        return DEFAULT_MESSAGES[category || ERROR_CATEGORIES.GENERAL];
    }

    if (typeof error === 'string') {
        // Lógica para converter códigos de erro em mensagens
        return error; // Substitua pela lógica original
    }

    return error.message || DEFAULT_MESSAGES[category || ERROR_CATEGORIES.GENERAL];
}

/**
 * Valida campos de entrada para redes sociais
 * @param {string} platform - Nome da plataforma (instagram, youtube, linkedin)
 * @param {string} value - Valor a ser validado
 * @returns {string|null} Mensagem de erro ou null se válido
 */
function validateSocialMedia(platform, value) {
    // Implementação da função original
    // Você deve incluir aqui a implementação original desta função

    // Exemplo de implementação simples (você deve substituir pela original)
    if (!value) return 'Campo obrigatório';
    return null;
}

/**
 * Normaliza erros de API para um formato padronizado
 * @param {Error} error - Erro original
 * @returns {string} Mensagem de erro normalizada
 */
function normalizeApiError(error) {
    // Implementação da função original
    // Você deve incluir aqui a implementação original desta função

    // Exemplo de implementação simples (você deve substituir pela original)
    return error?.message || 'Erro desconhecido';
}

/**
 * Mapeia erros de API específicos de plataforma para um formato padronizado
 * @param {Error} error - Objeto de erro
 * @param {string} platform - Plataforma (instagram, youtube, linkedin)
 * @returns {Object} Erro mapeado com código e mensagem padronizados
 */
function mapApiError(error, platform) {
    // Implementação da função original
    // Você deve incluir aqui a implementação original desta função

    // Exemplo de implementação simples (você deve substituir pela original)
    return {
        code: error?.code || 'UNKNOWN',
        message: error?.message || `Erro na plataforma ${platform}`
    };
}

/**
 * Serviço centralizado para gerenciamento de erros
 * Integra o sistema de mensagens existente com funções de processamento e relato
 */
class ErrorService {
    constructor() {
        this.ERROR_CATEGORIES = ERROR_CATEGORIES;
        this.DEFAULT_MESSAGES = DEFAULT_MESSAGES;
        this.FIELD_VALIDATION = FIELD_VALIDATION;
        this.SOCIAL_MEDIA = SOCIAL_MEDIA;
        this.ASYNC_OPERATIONS = ASYNC_OPERATIONS;
        this.API_ERROR_CODES = API_ERROR_CODES;
    }

    /**
     * Retorna a mensagem de erro traduzida com base no código ou objeto de erro
     * @param {Error|string} error - Erro ou código de erro
     * @param {string} category - Categoria de erro (opcional)
     * @param {Object} params - Parâmetros adicionais para personalização da mensagem
     * @returns {string} Mensagem de erro traduzida
     */
    getErrorMessage(error, category, params) {
        const { language } = useLanguage?.() || { language: 'pt' };

        // Nenhum erro fornecido, retorna a mensagem padrão
        if (!error) {
            return this.DEFAULT_MESSAGES[category || this.ERROR_CATEGORIES.GENERAL];
        }

        // Se for código/string específico, usa a função existente
        if (typeof error === 'string') {
            return getErrorMessage(error, category, params);
        }

        // Se for objeto de erro com código conhecido, mapeia para mensagem
        if (error.code && params?.platform) {
            const mappedError = mapApiError(error, params.platform);
            return mappedError.message;
        }

        // Retorna a mensagem do erro ou a mensagem padrão
        return error.message || this.DEFAULT_MESSAGES[category || this.ERROR_CATEGORIES.GENERAL];
    }

    /**
     * Registra e reporta erros para um sistema de monitoramento
     * @param {string} errorCode - Código do erro
     * @param {Error} error - Objeto de erro
     * @param {Object} metadata - Metadados adicionais para logging
     */
    reportError(errorCode, error, metadata = {}) {
        console.error(`[${errorCode}]`, error, metadata);

        // Aqui seria feita a integração com um serviço de monitoramento como Sentry, 
        // LogRocket, etc.

        // Exemplo: sentryService.captureException(error, { tags: { code: errorCode, ...metadata } });
    }

    /**
     * Normaliza erros de API para formato padronizado 
     * @param {Error} error - Erro original
     * @param {string} platform - Plataforma (instagram, youtube, linkedin)
     * @returns {Object} Erro normalizado
     */
    normalizeError(error, platform) {
        if (platform) {
            return mapApiError(error, platform);
        }
        return {
            code: error?.code || 'UNKNOWN',
            message: normalizeApiError(error)
        };
    }

    /**
     * Valida campos de entrada para redes sociais
     * @param {string} platform - Nome da plataforma (instagram, youtube, linkedin)
     * @param {string} value - Valor a ser validado
     * @returns {string|null} Mensagem de erro ou null se válido
     */
    validateSocialInput(platform, value) {
        return validateSocialMedia(platform, value);
    }

    /**
     * Verifica se um erro é devido a problemas de rede
     * @param {Error} error - Objeto de erro
     * @returns {boolean} Verdadeiro se for um erro de rede
     */
    isNetworkError(error) {
        if (!error) return false;

        return (
            error.message?.includes('network') ||
            error.message?.includes('internet') ||
            error.message?.includes('offline') ||
            error.message?.includes('connection') ||
            error.code === 'NETWORK_ERROR' ||
            error.code === 'ECONNABORTED'
        );
    }

    /**
     * Verifica se um erro é devido a problemas de autenticação
     * @param {Error} error - Objeto de erro
     * @returns {boolean} Verdadeiro se for um erro de autenticação
     */
    isAuthError(error) {
        if (!error) return false;

        return (
            error.message?.includes('auth') ||
            error.message?.includes('token') ||
            error.message?.includes('expired') ||
            error.message?.includes('unauthorized') ||
            error.code === 'UNAUTHORIZED' ||
            error.status === 401
        );
    }
}

// Criando uma instância do serviço
export const errorService = new ErrorService();

// Exportando as constantes e funções utilizadas
export {
    ERROR_CATEGORIES,
    DEFAULT_MESSAGES,
    FIELD_VALIDATION,
    SOCIAL_MEDIA,
    ASYNC_OPERATIONS,
    API_ERROR_CODES,
    getErrorMessage,
    validateSocialMedia,
    normalizeApiError,
    mapApiError
};