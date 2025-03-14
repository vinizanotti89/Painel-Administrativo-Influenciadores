import axios from 'axios';

// Definição direta da URL base da API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Instância Axios configurada para a API de influenciadores
const influencerApiClient = axios.create({
    baseURL: `${API_BASE_URL}/influencers`,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Adiciona um interceptor para tratar erros de rede
influencerApiClient.interceptors.response.use(
    response => response,
    error => {
        // Personaliza o objeto de erro com informações adicionais
        if (!error.response) {
            // Erro de rede - sem resposta
            error.isNetworkError = true;
            error.isApiError = true;
            error.statusCode = 'NETWORK_ERROR';
        } else {
            // Erro com resposta do servidor
            error.isApiError = true;
            error.statusCode = error.response.status;
            error.apiMessage = error.response.data?.message;
        }
        return Promise.reject(error);
    }
);

// Interceptor para adicionar token de autenticação
influencerApiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('auth_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

/**
 * Busca dados de influenciadores com base nos parâmetros fornecidos
 * 
 * @param {Object} params - Parâmetros da busca
 * @param {string} params.query - Termo de busca
 * @param {string} params.category - Categoria para filtrar
 * @param {string} params.platform - Plataforma para filtrar (instagram, youtube, linkedin)
 * @param {number} params.limit - Número máximo de resultados
 * @param {number} params.page - Página de resultados
 * @returns {Promise<Object>} Dados dos influenciadores e metadados da paginação
 */
export const fetchInfluencersData = async (params = {}) => {
    try {
        const response = await influencerApiClient.get('/', { params });
        return response.data;
    } catch (error) {
        // Formata o erro para um formato padrão antes de propagar
        throw formatApiError(error);
    }
};

/**
 * Busca detalhes de um influenciador específico por ID
 * 
 * @param {string|number} id - ID do influenciador
 * @returns {Promise<Object>} Dados detalhados do influenciador
 */
export const fetchInfluencerById = async (id) => {
    try {
        const response = await influencerApiClient.get(`/${id}`);
        return response.data;
    } catch (error) {
        throw formatApiError(error);
    }
};

/**
 * Busca métricas de desempenho de um influenciador
 * 
 * @param {string|number} id - ID do influenciador
 * @param {Object} params - Parâmetros adicionais (período, plataforma, etc)
 * @returns {Promise<Object>} Métricas de desempenho
 */
export const fetchInfluencerMetrics = async (id, params = {}) => {
    try {
        const response = await influencerApiClient.get(`/${id}/metrics`, { params });
        return response.data;
    } catch (error) {
        throw formatApiError(error);
    }
};

/**
 * Busca posts recentes de um influenciador
 * 
 * @param {string|number} id - ID do influenciador
 * @param {Object} params - Parâmetros adicionais (limite, plataforma, etc)
 * @returns {Promise<Array>} Lista de posts recentes
 */
export const fetchInfluencerPosts = async (id, params = {}) => {
    try {
        const response = await influencerApiClient.get(`/${id}/posts`, { params });
        return response.data;
    } catch (error) {
        throw formatApiError(error);
    }
};

/**
 * Formata erros de API para um formato padrão
 * 
 * @param {Error} error - Erro original
 * @returns {Object} Erro formatado
 */
const formatApiError = (error) => {
    if (error.response) {
        // Resposta do servidor com código de erro
        return {
            code: error.response.status,
            message: error.response.data.message || 'Erro na resposta do servidor',
            data: error.response.data,
            isNetworkError: false
        };
    } else if (error.request) {
        // Nenhuma resposta recebida
        return {
            code: 'NETWORK_ERROR',
            message: 'Não foi possível conectar ao servidor',
            isNetworkError: true
        };
    } else {
        // Erro na configuração da requisição
        return {
            code: 'REQUEST_ERROR',
            message: error.message || 'Erro ao fazer requisição',
            isNetworkError: false
        };
    }
};

export default {
    fetchInfluencersData,
    fetchInfluencerById,
    fetchInfluencerMetrics,
    fetchInfluencerPosts
};