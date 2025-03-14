import axios from 'axios';
import { formatNumberToK, handleApiError } from '@/lib/apiHelpers';
import { adaptPlatformData } from './adapters';
import { apiConfig } from '@/config/env';


/**
 * Cliente Axios configurado para a API do Instagram
 */
const instagramApi = axios.create({
  baseURL: 'https://graph.instagram.com',
  timeout: 10000, // 10 segundos de timeout
  headers: {
    'Content-Type': 'application/json'
  }
});

/**
 * Configura o token de autorização para o cliente da API
 * @param {string} token - Token de acesso OAuth
 */
const setAuthToken = (token) => {
  if (token) {
    instagramApi.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete instagramApi.defaults.headers.common['Authorization'];
  }
};

// Inicializa com o token armazenado (se existir)
const storedToken = localStorage.getItem('instagram_token');
if (storedToken) {
  setAuthToken(storedToken);
}

/**
 * Serviço para interação com a API do Instagram
 * Separa a lógica de negócio do componente de apresentação
 */
class InstagramService {
  /**
   * Calcula a taxa de engajamento
   * @param {number} engagementCount - Número total de engajamentos
   * @param {number} followersCount - Número de seguidores
   * @returns {string} Taxa de engajamento formatada como porcentagem
   */
  calculateEngagementRate(engagementCount, followersCount) {
    if (!followersCount || followersCount <= 0) return '0.00';

    const rate = (engagementCount / followersCount) * 100;
    return rate.toFixed(2);
  }

  /**
   * Autentica com a API do Instagram usando OAuth
   * @param {string} code - Código de autorização recebido do redirecionamento OAuth
   * @returns {Promise<Object>} Resultado da autenticação com tokens
   */
  async authenticate(code) {
    try {
      // Verificar se as configurações da API estão disponíveis
      if (!apiConfig.instagram.clientId || !apiConfig.instagram.clientSecret) {
        throw new Error('Configurações de API do Instagram não encontradas');
      }

      // Enviar requisição para o back-end para trocar o código por tokens
      const response = await axios.post('/api/auth/instagram', { code });

      // Armazenar token de acesso
      if (response.data.accessToken) {
        localStorage.setItem('instagram_token', response.data.accessToken);
        localStorage.setItem('instagram_user_id', response.data.userId);

        // Configura o cliente da API para usar o novo token
        setAuthToken(response.data.accessToken);
      }

      return {
        access_token: response.data.accessToken,
        user_id: response.data.userId,
        expires_in: response.data.expiresIn || (60 * 60 * 24 * 60) // 60 dias em segundos (padrão)
      };
    } catch (error) {
      console.error('Erro ao autenticar com Instagram:', error);
      throw handleApiError(error, 'instagram');
    }
  }

  /**
   * Testa a conexão com a API do Instagram
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
      throw handleApiError(error, 'instagram');
    }
  }

  /**
   * Recupera dados básicos do perfil do usuário autenticado
   * @returns {Promise<Object>} Dados do perfil do usuário
   */
  async getProfile() {
    try {
      const { data } = await axios.get('/api/social/instagram/profile', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return data;
    } catch (error) {
      console.error('Error fetching Instagram profile:', error);
      throw handleApiError(error, 'instagram');
    }
  }

  /**
   * Recupera as permissões atuais da aplicação
   * @returns {Promise<Array<string>>} Lista de permissões ativas
   */
  async getPermissions() {
    try {
      const response = await instagramApi.get('/me/permissions');
      return response.data.data.map(perm => perm.permission);
    } catch (error) {
      console.error('Error fetching Instagram permissions:', error);
      throw handleApiError(error, 'instagram');
    }
  }

  /**
   * Recupera as mídias do usuário autenticado
   * @param {number} limit - Número máximo de mídias para recuperar
   * @returns {Promise<Array>} Lista de mídias do usuário
   */
  async getUserMedia(limit = 25) {
    try {
      const { data } = await instagramApi.get('/me/media', {
        params: {
          fields: 'id,caption,media_type,media_url,permalink,thumbnail_url,timestamp,like_count,comments_count',
          limit
        }
      });
      return data.data;
    } catch (error) {
      console.error('Error fetching user media:', error);
      throw handleApiError(error, 'instagram');
    }
  }

  /**
   * Recupera dados de um perfil de Instagram por nome de usuário
   * @param {string} username - Nome de usuário do Instagram
   * @returns {Promise<Object>} Dados do perfil
   */
  async getProfileByUsername(username) {
    try {
      if (!username) {
        throw new Error('Nome de usuário é obrigatório');
      }

      const { data } = await instagramApi.get(`/users/search`, {
        params: {
          q: username,
          fields: 'id,username,full_name,media_count,profile_picture_url'
        }
      });

      if (!data || !data.data || data.data.length === 0) {
        throw new Error('Usuário não encontrado');
      }

      const userProfile = data.data[0];
      const followersCount = userProfile.media_count || 0;

      return {
        id: userProfile.id,
        username: userProfile.username,
        fullName: userProfile.full_name,
        followersCount: followersCount,
        followersFormatted: formatNumberToK(followersCount),
        postsCount: userProfile.media_count || 0,
        profilePictureUrl: userProfile.profile_picture_url
      };
    } catch (error) {
      console.error(`Error fetching Instagram profile for ${username}:`, error);
      throw handleApiError(error, 'instagram');
    }
  }

  /**
   * Obtém mídia recente de um usuário
   * @param {string} userId - ID do usuário do Instagram
   * @returns {Promise<Array>} Lista de posts com métricas
   */
  async getRecentMedia(userId) {
    try {
      const { data } = await instagramApi.get(`/${userId}/media`, {
        params: {
          fields: 'id,caption,media_type,media_url,permalink,thumbnail_url,timestamp,like_count,comments_count,engagement',
          limit: 25
        }
      });
      return data.data;
    } catch (error) {
      console.error(`Error fetching media for user ${userId}:`, error);
      throw handleApiError(error, 'instagram');
    }
  }

  /**
   * Calcula a taxa de engajamento com base nas mídias recentes
   * @param {string} userId - ID do usuário do Instagram
   * @param {Array} media - Lista de mídias do usuário
   * @returns {Promise<string>} Taxa de engajamento formatada
   */
  async calculateEngagement(userId, media) {
    try {
      if (!media || media.length === 0) {
        return "0.00";
      }

      const totalEngagement = media.reduce((sum, post) => {
        return sum + (post.like_count || 0) + (post.comments_count || 0);
      }, 0);

      const avgEngagement = totalEngagement / media.length;
      const followersCount = await this.getFollowersCount(userId);

      if (!followersCount) return "0.00";

      return this.calculateEngagementRate(avgEngagement, followersCount);
    } catch (error) {
      console.error('Error calculating engagement:', error);
      throw handleApiError(error, 'instagram');
    }
  }

  /**
   * Obtém insights de audiência para um perfil
   * @param {string} userId - ID do usuário do Instagram
   * @returns {Promise<Object>} Dados de audiência
   */
  async getAudienceInsights(userId) {
    try {
      const { data } = await instagramApi.get(`/${userId}/insights`, {
        params: {
          metric: 'audience_demographics',
          period: 'lifetime'
        }
      });
      return data;
    } catch (error) {
      console.error(`Error fetching audience insights for user ${userId}:`, error);
      throw handleApiError(error, 'instagram');
    }
  }

  /**
   * Obtém pontuação de confiabilidade da conta
   * @param {string} userId - ID do usuário do Instagram
   * @returns {Promise<Object>} Dados de confiabilidade
   */
  async getAccountTrustScore(userId) {
    try {
      const { data } = await instagramApi.get(`/${userId}/trust_metrics`);
      return data;
    } catch (error) {
      console.error(`Error fetching trust score for user ${userId}:`, error);
      throw handleApiError(error, 'instagram');
    }
  }
  async getFollowersCount(userId) {
    try {
      const { data } = await instagramApi.get(`/${userId}`, {
        params: {
          fields: 'followed_by_count'
        }
      });

      return data.followed_by_count || 0;
    } catch (error) {
      console.error('Error getting followers count:', error);
      throw handleApiError(error, 'instagram');
    }
  }

  /**
   * Analisa um perfil de influenciador
   * @param {string} username - Nome de usuário do Instagram
   * @returns {Promise<Object>} Análise completa do perfil
   */
  async analyzeInfluencer(username) {
    try {
      const { data } = await axios.get(`/api/social/instagram/analyze/${username}`);
      return data;
    } catch (error) {
      console.error(`Error analyzing Instagram influencer ${username}:`, error);
      throw handleApiError(error, 'instagram');
    }
  }

  /**
   * Desconecta-se da API (remove tokens)
   */
  logout() {
    localStorage.removeItem('instagram_token');
    localStorage.removeItem('instagram_user_id');
    setAuthToken(null);
  }

  /**
   * Gera um URL para autenticação OAuth
   * @returns {string} URL de autenticação
   */
  generateAuthUrl() {
    const BASE_URL = 'https://api.instagram.com/oauth/authorize';
    const params = new URLSearchParams({
      client_id: import.meta.env.VITE_INSTAGRAM_CLIENT_ID,
      redirect_uri: import.meta.env.VITE_INSTAGRAM_REDIRECT_URI,
      scope: 'user_profile,user_media',
      response_type: 'code'
    });

    return `${BASE_URL}?${params.toString()}`;
  }
}

// Exporta uma única instância do serviço para uso em toda a aplicação
export const instagramService = new InstagramService();

export default instagramService;