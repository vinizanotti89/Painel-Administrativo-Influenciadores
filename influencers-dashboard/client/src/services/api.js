import axios from 'axios';
import { errorService } from '@/lib/errorMessages';

/**
 * URL base da API - obtida das variáveis de ambiente ou usa localhost como fallback
 */
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3003/api';

/**
 * Instância do axios configurada para comunicação com a API
 */
const api = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
});

/**
 * Interceptor para adicionar token de autenticação em todas as requisições
 */
api.interceptors.request.use(
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
 * Interceptor para tratar erros e renovar token automaticamente quando expirado
 */
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Se for erro 401 (não autorizado) e não for uma tentativa de refresh
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Tentar obter novo token com refresh token
                const refreshToken = localStorage.getItem('refresh_token');
                if (!refreshToken) {
                    // Se não houver refresh token, redirecionar para login
                    window.location.href = '/login';
                    return Promise.reject(error);
                }

                // Fazendo a requisição para obter novo token
                const response = await axios.post(`${BASE_URL}/auth/refresh`, {
                    refresh_token: refreshToken
                });

                // Armazenar novos tokens
                const { token, refresh_token } = response.data;
                localStorage.setItem('auth_token', token);
                localStorage.setItem('refresh_token', refresh_token);

                // Atualizar cabeçalho e reenviar a requisição original
                originalRequest.headers.Authorization = `Bearer ${token}`;
                return axios(originalRequest);
            } catch (refreshError) {
                // Se falhar o refresh, limpar tokens e redirecionar para login
                localStorage.removeItem('auth_token');
                localStorage.removeItem('refresh_token');

                // Reportar erro ao serviço centralizado
                errorService.reportError('auth_refresh_failed', refreshError, {
                    component: 'API',
                    originalUrl: originalRequest.url
                });

                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        // Para outros erros, retornar a rejeição normal
        return Promise.reject(error);
    }
);

/**
 * Serviço para gerenciamento de dados de influenciadores
 */
export const influencersApi = {
    /**
     * Recupera a lista de influenciadores com opções de filtragem
     * @param {Object} params - Parâmetros para filtragem, paginação e ordenação
     * @returns {Promise<Object>} Dados dos influenciadores e metadados de paginação
     */
    getAll: async (params = {}) => {
        try {
            const response = await api.get('/influencers', { params });
            return response.data;
        } catch (error) {
            errorService.reportError('influencers_get_all_failed', error, { params });
            throw handleApiError(error);
        }
    },

    /**
     * Recupera dados de um influenciador específico por ID
     * @param {string} id - ID do influenciador
     * @returns {Promise<Object>} Dados detalhados do influenciador
     */
    getById: async (id) => {
        try {
            const response = await api.get(`/influencers/${id}`);
            return response.data;
        } catch (error) {
            errorService.reportError('influencer_get_by_id_failed', error, { id });
            throw handleApiError(error);
        }
    },

    /**
     * Cria um novo registro de influenciador
     * @param {Object} data - Dados do influenciador a ser criado
     * @returns {Promise<Object>} Dados do influenciador criado
     */
    create: async (data) => {
        try {
            const response = await api.post('/influencers', data);
            return response.data;
        } catch (error) {
            errorService.reportError('influencer_create_failed', error);
            throw handleApiError(error);
        }
    },

    /**
     * Atualiza dados de um influenciador existente
     * @param {string} id - ID do influenciador
     * @param {Object} data - Novos dados para atualização
     * @returns {Promise<Object>} Dados atualizados do influenciador
     */
    update: async (id, data) => {
        try {
            const response = await api.put(`/influencers/${id}`, data);
            return response.data;
        } catch (error) {
            errorService.reportError('influencer_update_failed', error, { id });
            throw handleApiError(error);
        }
    },

    /**
     * Remove um influenciador do sistema
     * @param {string} id - ID do influenciador a ser removido
     * @returns {Promise<Object>} Resposta da operação
     */
    delete: async (id) => {
        try {
            const response = await api.delete(`/influencers/${id}`);
            return response.data;
        } catch (error) {
            errorService.reportError('influencer_delete_failed', error, { id });
            throw handleApiError(error);
        }
    },

    /**
     * Busca um influenciador por nome de usuário e plataforma
     * @param {string} username - Nome de usuário
     * @param {string} platform - Plataforma (instagram, youtube, linkedin)
     * @returns {Promise<Object>} Dados do influenciador
     */
    findByUsername: async (username, platform) => {
        try {
            const response = await api.get('/influencers/search', {
                params: { username, platform }
            });
            return response.data;
        } catch (error) {
            errorService.reportError('influencer_search_failed', error, { username, platform });
            throw handleApiError(error);
        }
    }
};

/**
 * Serviço para gerenciamento de relatórios
 */
export const reportsApi = {
    /**
     * Recupera a lista de relatórios
     * @param {Object} params - Parâmetros para filtragem
     * @returns {Promise<Array>} Lista de relatórios
     */
    getAll: async (params = {}) => {
        try {
            const response = await api.get('/reports', { params });
            return response.data;
        } catch (error) {
            errorService.reportError('reports_get_all_failed', error, { params });
            throw handleApiError(error);
        }
    },

    /**
     * Recupera um relatório específico por ID
     * @param {string} id - ID do relatório
     * @returns {Promise<Object>} Dados do relatório
     */
    getById: async (id) => {
        try {
            const response = await api.get(`/reports/${id}`);
            return response.data;
        } catch (error) {
            errorService.reportError('report_get_by_id_failed', error, { id });
            throw handleApiError(error);
        }
    },

    /**
     * Cria um novo relatório
     * @param {Object} data - Dados do relatório
     * @returns {Promise<Object>} Relatório criado
     */
    create: async (data) => {
        try {
            const response = await api.post('/reports', data);
            return response.data;
        } catch (error) {
            errorService.reportError('report_create_failed', error);
            throw handleApiError(error);
        }
    }
};

/**
 * Função auxiliar para tratamento padronizado de erros da API
 * @param {Error} error - Objeto de erro do Axios
 * @returns {Error} Erro normalizado com mensagem amigável
 */
function handleApiError(error) {
    // Usa o serviço centralizado para normalizar o erro
    const normalizedError = errorService.normalizeError(error, 'api');

    console.error('API Error Context:', {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        timestamp: new Date().toISOString()
    });

    if (error.response) {
        // Erro com resposta do servidor
        const { status, data } = error.response;
        const message = data.message || `Erro ${status}: ${data.error || 'Erro desconhecido'}`;
        return new Error(message);
    } else if (error.request) {
        // Erro sem resposta (problemas de conexão)
        return new Error('Não foi possível conectar ao servidor. Verifique sua conexão com a internet.');
    } else {
        // Outros erros
        return new Error(normalizedError.message || 'Ocorreu um erro ao processar sua solicitação.');
    }
}

export default api;