import axios from 'axios';
import { formatNumberToK, handleApiError } from '@/lib/apiHelpers';
import { adaptPlatformData } from './adapters';
import { apiConfig } from '@/config/env';


/**
 * Cliente Axios configurado para a API do LinkedIn
 */
const linkedinApi = axios.create({
    baseURL: 'https://api.linkedin.com/v2',
    timeout: 10000, // 10 segundos de timeout
    headers: {
        'X-Li-Format': 'json',
        'Content-Type': 'application/json'
    }
});

/**
 * Configura o token de autorização para o cliente da API
 * @param {string} token - Token de acesso OAuth
 */
const setAuthToken = (token) => {
    if (token) {
        linkedinApi.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete linkedinApi.defaults.headers.common['Authorization'];
    }
};

// Inicializa com o token armazenado (se existir)
const storedToken = localStorage.getItem('linkedin_token');
if (storedToken) {
    setAuthToken(storedToken);
}

/**
 * Serviço para interação com a API do LinkedIn
 * Separa a lógica de negócio do componente de apresentação
 */
class LinkedinService {
    /**
     * Autentica com a API do LinkedIn usando OAuth
     * @param {string} code - Código de autorização recebido do redirecionamento OAuth
     * @returns {Promise<Object>} Resultado da autenticação com tokens
     */
    async authenticate(code) {
        try {
            // Verificar se as configurações da API estão disponíveis
            if (!apiConfig.linkedin.clientId || !apiConfig.linkedin.clientSecret) {
                throw new Error('Configurações de API do LinkedIn não encontradas');
            }

            // Enviar requisição para o back-end para trocar o código por tokens
            const response = await axios.post('/api/auth/linkedin', { code });

            // Armazenar token de acesso
            if (response.data.accessToken) {
                localStorage.setItem('linkedin_token', response.data.accessToken);

                // Configura o cliente da API para usar o novo token
                setAuthToken(response.data.accessToken);

                try {
                    // Obter dados do usuário para retornar o ID se disponível
                    const profileData = await this.getProfile();
                    localStorage.setItem('linkedin_user_id', profileData.id);

                    return {
                        access_token: response.data.accessToken,
                        user_id: profileData.id,
                        expires_in: response.data.expiresIn
                    };
                } catch (profileError) {
                    // Retorna dados básicos se não conseguir obter o perfil
                    return {
                        access_token: response.data.accessToken,
                        user_id: response.data.userId || null,
                        expires_in: response.data.expiresIn
                    };
                }
            }

            return {
                access_token: response.data.accessToken,
                user_id: response.data.userId,
                expires_in: response.data.expiresIn
            };
        } catch (error) {
            console.error('Erro ao autenticar com LinkedIn:', error);
            throw handleApiError(error, 'linkedin');
        }
    }

    /**
     * Testa a conexão com a API do LinkedIn
     * @returns {Promise<Object>} Dados do perfil do usuário e permissões
     * @throws {Error} Erro de conexão ou autenticação
     */
    async testConnection() {
        try {
            const profile = await this.getProfile();
            const permissions = await this.getPermissions();

            return {
                ...profile,
                permissions
            };
        } catch (error) {
            console.error('Connection test error:', error);
            throw handleApiError(error, 'linkedin');
        }
    }

    /**
     * Recupera dados básicos do perfil do usuário autenticado
     * @returns {Promise<Object>} Dados do perfil do usuário
     */
    async getProfile() {
        try {
            const token = localStorage.getItem('linkedin_token');
            if (!token) {
                throw new Error('Token não disponível');
            }

            const { data } = await axios.get('/api/social/linkedin/profile', {
                headers: {
                    token
                }
            });
            return data;
        } catch (error) {
            console.error('Error fetching LinkedIn profile:', error);
            throw handleApiError(error, 'linkedin');
        }
    }

    /**
     * Recupera as permissões atuais da aplicação
     * @returns {Promise<Array<string>>} Lista de permissões ativas
     */
    async getPermissions() {
        try {
            // LinkedIn não possui endpoint específico para permissões
            // Simplificado para retornar permissões básicas
            const permissions = ['r_liteprofile', 'r_emailaddress'];

            return permissions;
        } catch (error) {
            console.error('Error fetching LinkedIn permissions:', error);
            throw handleApiError(error, 'linkedin');
        }
    }

    /**
     * Recupera posts recentes de um usuário
     * @param {number} limit - Número máximo de posts para recuperar
     * @returns {Promise<Array>} Lista de posts do usuário
     */
    async getUserPosts(limit = 10) {
        try {
            const userId = localStorage.getItem('linkedin_user_id');
            if (!userId) {
                throw new Error('ID do usuário não encontrado. É necessário estar autenticado.');
            }

            const { data } = await linkedinApi.get('/ugcPosts', {
                params: {
                    q: 'authors',
                    authors: `urn:li:person:${userId}`,
                    count: limit
                }
            });
            return data.elements || [];
        } catch (error) {
            console.error('Error fetching user posts:', error);
            throw handleApiError(error, 'linkedin');
        }
    }

    /**
     * Recupera dados de um perfil de LinkedIn por nome de usuário
     * @param {string} username - Nome de usuário do LinkedIn
     * @returns {Promise<Object>} Dados do perfil
     */
    async getProfileByUsername(username) {
        try {
            if (!username) {
                throw new Error('Nome de usuário é obrigatório');
            }

            // Chamada à API simplificada para recuperar perfil público
            const { data } = await linkedinApi.get('/people', {
                params: {
                    q: 'vanityName',
                    vanityName: username
                }
            });

            if (!data || !data.elements || data.elements.length === 0) {
                throw new Error('Usuário não encontrado');
            }

            const userProfile = data.elements[0];
            const followersCount = userProfile.numConnections || 0;

            return {
                id: userProfile.id,
                username: userProfile.vanityName || username,
                fullName: `${userProfile.localizedFirstName} ${userProfile.localizedLastName}`,
                followersCount: followersCount,
                followersFormatted: formatNumberToK(followersCount),
                postsCount: userProfile.numPosts || 0,
                profilePictureUrl: userProfile.profilePicture?.displayImage?.elements?.[0]?.identifiers?.[0]?.identifier || null
            };
        } catch (error) {
            console.error(`Error fetching LinkedIn profile for ${username}:`, error);
            throw handleApiError(error, 'linkedin');
        }
    }

    /**
     * Calcula a taxa de engajamento com base nas métricas
     * @param {number} engagementCount - Número total de engajamentos
     * @param {number} followersCount - Número de seguidores
     * @returns {string} Taxa de engajamento formatada como porcentagem
     */
    calculateEngagementRate(engagementCount, followersCount) {
        if (!followersCount || followersCount <= 0) return '0.00';

        const rate = (engagementCount / followersCount) * 100;
        return rate.toFixed(2);
    }

    async analyzeInfluencer(username) {
        try {
            const { data } = await axios.get(`/api/social/linkedin/analyze/${encodeURIComponent(username)}`);
            return adaptPlatformData(data, 'linkedin');
        } catch (error) {
            console.error(`Error analyzing LinkedIn influencer ${username}:`, error);
            throw handleApiError(error, 'linkedin');
        }
    }

    async getProfileMetrics(profileId) {
        try {
            const { data } = await linkedinApi.get(`/profiles/${profileId}/metrics`);
            return data;
        } catch (error) {
            console.error(`Error fetching profile metrics for ${profileId}:`, error);
            throw handleApiError(error, 'linkedin');
        }
    }

    /**
     * Obtém dados de audiência do perfil
     * @param {string} profileId - ID do perfil do LinkedIn
     * @returns {Promise<Object>} Dados de audiência
     */
    async getAudienceData(profileId) {
        try {
            const { data } = await linkedinApi.get(`/profiles/${profileId}/audience`);
            return data;
        } catch (error) {
            console.error(`Error fetching audience data for ${profileId}:`, error);
            throw handleApiError(error, 'linkedin');
        }
    }

    /**
     * Obtém métricas de confiabilidade do perfil
     * @param {string} profileId - ID do perfil do LinkedIn
     * @returns {Promise<Object>} Métricas de confiabilidade
     */
    async getProfileTrustMetrics(profileId) {
        try {
            const { data } = await linkedinApi.get(`/profiles/${profileId}/trust`);
            return data;
        } catch (error) {
            console.error(`Error fetching trust metrics for ${profileId}:`, error);
            throw handleApiError(error, 'linkedin');
        }
    }
    /**
     * Desconecta-se da API (remove tokens)
     */
    logout() {
        localStorage.removeItem('linkedin_token');
        localStorage.removeItem('linkedin_user_id');
        setAuthToken(null);
    }

    /**
     * Gera um URL para autenticação OAuth
     * @returns {string} URL de autenticação
     */
    generateAuthUrl() {
        const BASE_URL = 'https://www.linkedin.com/oauth/v2/authorization';
        const params = new URLSearchParams({
            response_type: 'code',
            client_id: import.meta.env.VITE_LINKEDIN_CLIENT_ID,
            redirect_uri: import.meta.env.VITE_LINKEDIN_REDIRECT_URI,
            scope: 'r_liteprofile r_emailaddress w_member_social',
            state: Math.random().toString(36).substring(2)
        });

        return `${BASE_URL}?${params.toString()}`;
    }
}

// Exporta uma única instância do serviço para uso em toda a aplicação
export const linkedinService = new LinkedinService();

export default linkedinService;