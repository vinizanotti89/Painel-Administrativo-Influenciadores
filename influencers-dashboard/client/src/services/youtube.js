import axios from 'axios';
import { formatNumberToK, handleApiError } from '@/lib/apiHelpers';
import { adaptPlatformData } from './adapters';
import { apiConfig } from '@/config/env';


/**
 * Cliente Axios configurado para a API do YouTube
 */
const youtubeApi = axios.create({
  baseURL: 'https://www.googleapis.com/youtube/v3',
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
    youtubeApi.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete youtubeApi.defaults.headers.common['Authorization'];
  }
};

// Inicializa com o token armazenado (se existir)
const storedToken = localStorage.getItem('youtube_token');
if (storedToken) {
  setAuthToken(storedToken);
}

/**
 * Serviço para interação com a API do YouTube
 * Separa a lógica de negócio do componente de apresentação
 */
class YouTubeService {
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
   * Autentica com a API do YouTube usando OAuth
   * @param {string} code - Código de autorização recebido do redirecionamento OAuth
   * @returns {Promise<Object>} Resultado da autenticação com tokens
   */
  async authenticate(code) {
    try {
      // Verificar se as configurações da API estão disponíveis
      if (!apiConfig.youtube.clientId || !apiConfig.youtube.clientSecret) {
        throw new Error('Configurações de API do YouTube não encontradas');
      }

      // Enviar requisição para o back-end para trocar o código por tokens
      const response = await axios.post('/api/auth/youtube', { code });

      // Armazenar tokens
      if (response.data.accessToken) {
        localStorage.setItem('youtube_token', response.data.accessToken);
        if (response.data.refreshToken) {
          localStorage.setItem('youtube_refresh_token', response.data.refreshToken);
        }

        // Configura o cliente da API para usar o novo token
        setAuthToken(response.data.accessToken);
      }

      try {
        // Obtém os dados do canal se o token estiver disponível
        const channelData = await this.getChannel();

        return {
          access_token: response.data.accessToken,
          expires_in: response.data.expiresIn,
          refresh_token: response.data.refreshToken,
          channel_id: channelData.id,
          channel_title: channelData.snippet?.title
        };
      } catch (channelError) {
        // Retorna apenas os dados de autenticação se não conseguir obter o canal
        return {
          access_token: response.data.accessToken,
          expires_in: response.data.expiresIn,
          refresh_token: response.data.refreshToken
        };
      }
    } catch (error) {
      console.error('Erro ao autenticar com YouTube:', error);
      throw handleApiError(error, 'youtube');
    }
  }

  /**
   * Refresca o token de acesso usando o refresh token
   * @returns {Promise<Object>} Novo token de acesso
   */
  async refreshToken() {
    try {
      const refreshToken = localStorage.getItem('youtube_refresh_token');

      if (!refreshToken) {
        throw new Error('Refresh token not available');
      }

      const response = await axios.post('https://oauth2.googleapis.com/token', {
        client_id: import.meta.env.VITE_YOUTUBE_CLIENT_ID,
        client_secret: import.meta.env.VITE_YOUTUBE_CLIENT_SECRET,
        refresh_token: refreshToken,
        grant_type: 'refresh_token'
      });

      const { access_token, expires_in } = response.data;

      // Atualiza o token no localStorage
      localStorage.setItem('youtube_token', access_token);

      // Configura o cliente da API para usar o novo token
      setAuthToken(access_token);

      return {
        access_token,
        expires_in
      };
    } catch (error) {
      console.error('Token refresh error:', error);

      // Se o refresh falhar, limpa os tokens
      localStorage.removeItem('youtube_token');
      localStorage.removeItem('youtube_refresh_token');

      throw handleApiError(error, 'youtube');
    }
  }

  /**
   * Testa a conexão com a API do YouTube
   * @returns {Promise<Object>} Dados do canal e permissões
   * @throws {Error} Erro de conexão ou autenticação
   */
  async testConnection() {
    try {
      const channel = await this.getChannel();

      return {
        channel,
        status: 'connected'
      };
    } catch (error) {
      // Se for erro de autenticação, tenta refresh
      if (error.response && error.response.status === 401) {
        try {
          await this.refreshToken();
          const channel = await this.getChannel();

          return {
            channel,
            status: 'refreshed'
          };
        } catch (refreshError) {
          console.error('Connection test error after refresh:', refreshError);
          throw handleApiError(refreshError, 'youtube');
        }
      }

      console.error('Connection test error:', error);
      throw handleApiError(error, 'youtube');
    }
  }

  /**
   * Recupera dados do canal do usuário autenticado
   * @returns {Promise<Object>} Dados do canal
   */

  async getProfile() {
    try {
      const { data } = await linkedinApi.get('/me', {
        params: {
          fields: 'id,localizedFirstName,localizedLastName,profilePicture(displayImage~:playableStreams)'
        }
      });
      return data;
    } catch (error) {
      console.error('Error fetching Youtube profile:', error);
      throw handleApiError(error, 'youtube');
    }
  }

  /**
   * Recupera as permissões atuais da aplicação
   * @returns {Promise<Array<string>>} Lista de permissões ativas
   */

  async getChannel() {
    try {
      const { data } = await axios.get('/api/social/youtube/channel', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!data.items || data.items.length === 0) {
        throw new Error('No channel found for the authenticated user');
      }

      return data.items[0];
    } catch (error) {
      console.error('Error fetching channel:', error);
      throw handleApiError(error, 'youtube');
    }
  }

  /**
   * Recupera vídeos recentes do canal do usuário autenticado
   * @param {number} limit - Número máximo de vídeos para retornar
   * @returns {Promise<Array>} Lista de vídeos
   */
  async getRecentVideos(limit = 10) {
    try {
      // Primeiro, obtém o ID da playlist de uploads do canal
      const channel = await this.getChannel();
      const uploadsPlaylistId = channel.contentDetails.relatedPlaylists.uploads;

      // Agora, obtém os vídeos dessa playlist
      const { data } = await youtubeApi.get('/playlistItems', {
        params: {
          part: 'snippet,contentDetails',
          playlistId: uploadsPlaylistId,
          maxResults: limit,
          key: import.meta.env.VITE_YOUTUBE_API_KEY
        }
      });

      if (!data.items || data.items.length === 0) {
        return [];
      }

      // Extrai os IDs dos vídeos
      const videoIds = data.items.map(item => item.contentDetails.videoId);

      // Obtém estatísticas para cada vídeo
      const videoStats = await this.getVideosStats(videoIds);

      // Combina os dados
      return data.items.map(item => {
        const videoId = item.contentDetails.videoId;
        const stats = videoStats.find(stat => stat.id === videoId) || {};

        return {
          id: videoId,
          title: item.snippet.title,
          description: item.snippet.description,
          publishedAt: item.snippet.publishedAt,
          thumbnails: item.snippet.thumbnails,
          statistics: stats.statistics || {}
        };
      });
    } catch (error) {
      console.error('Error fetching recent videos:', error);
      throw handleApiError(error, 'youtube');
    }
  }

  /**
   * Obtém estatísticas para um conjunto de vídeos
   * @param {Array<string>} videoIds - IDs dos vídeos
   * @returns {Promise<Array>} Estatísticas dos vídeos
   */
  async getVideosStats(videoIds) {
    try {
      if (!videoIds || videoIds.length === 0) {
        return [];
      }

      const { data } = await youtubeApi.get('/videos', {
        params: {
          part: 'statistics',
          id: videoIds.join(','),
          key: import.meta.env.VITE_YOUTUBE_API_KEY
        }
      });

      return data.items || [];
    } catch (error) {
      console.error('Error fetching video statistics:', error);
      throw handleApiError(error, 'youtube');
    }
  }

  /**
   * Recupera dados de um canal por nome de usuário ou ID
   * @param {string} channelIdentifier - Nome de usuário ou ID do canal
   * @returns {Promise<Object>} Dados do canal
   */
  async getChannelByIdentifier(channelIdentifier) {
    try {
      if (!channelIdentifier) {
        throw new Error('Channel identifier is required');
      }

      // Determina se o identificador é um ID ou um nome de usuário
      let params = {};

      if (channelIdentifier.startsWith('UC')) {
        // Parece ser um ID de canal
        params = {
          part: 'snippet,statistics,contentDetails,brandingSettings',
          id: channelIdentifier,
          key: import.meta.env.VITE_YOUTUBE_API_KEY
        };
      } else {
        // Assume que é um nome de usuário
        params = {
          part: 'snippet,statistics,contentDetails,brandingSettings',
          forUsername: channelIdentifier,
          key: import.meta.env.VITE_YOUTUBE_API_KEY
        };
      }

      const { data } = await youtubeApi.get('/channels', { params });

      if (!data.items || data.items.length === 0) {
        // Se não encontrou pelo nome de usuário, tenta buscar pelo termo
        if (!channelIdentifier.startsWith('UC')) {
          return await this.searchForChannel(channelIdentifier);
        }

        throw new Error('Channel not found');
      }

      return data.items[0];
    } catch (error) {
      console.error(`Error fetching channel for ${channelIdentifier}:`, error);
      throw handleApiError(error, 'youtube');
    }
  }

  /**
   * Busca um canal pelo nome
   * @param {string} channelName - Nome do canal para buscar
   * @returns {Promise<Object>} Dados do canal
   */
  async searchForChannel(channelName) {
    try {
      // Busca canais que correspondam ao termo
      const { data } = await youtubeApi.get('/search', {
        params: {
          part: 'snippet',
          q: channelName,
          type: 'channel',
          maxResults: 1,
          key: import.meta.env.VITE_YOUTUBE_API_KEY
        }
      });

      if (!data.items || data.items.length === 0) {
        throw new Error('Channel not found');
      }

      // Obtém o ID do canal e busca dados completos
      const channelId = data.items[0].id.channelId;
      return await this.getChannelByIdentifier(channelId);
    } catch (error) {
      console.error(`Error searching for channel ${channelName}:`, error);
      throw handleApiError(error, 'youtube');
    }
  }

  /**
   * Analisa um canal de influenciador
   * @param {string} channelIdentifier - Nome de usuário ou ID do canal
   * @returns {Promise<Object>} Análise básica do canal
   */
  async analyzeInfluencer(channelIdentifier) {
    try {
      const { data } = await axios.get(`/api/social/youtube/analyze/${encodeURIComponent(channelIdentifier)}`);
      return adaptPlatformData(data, 'youtube');
    } catch (error) {
      console.error(`Error analyzing YouTube channel ${channelIdentifier}:`, error);
      throw handleApiError(error, 'youtube');
    }
  }
  /**
   * Obtém vídeos recentes de um canal específico
   * @param {string} channelId - ID do canal
   * @param {number} limit - Limite de vídeos a retornar
   * @returns {Promise<Array>} Lista de vídeos com estatísticas
   */
  async getRecentVideosForChannel(channelId, limit = 10) {
    try {
      // Obter playlists de uploads do canal
      const { data } = await youtubeApi.get('/channels', {
        params: {
          part: 'contentDetails',
          id: channelId,
          key: import.meta.env.VITE_YOUTUBE_API_KEY
        }
      });

      const uploadsPlaylistId = data.items[0].contentDetails.relatedPlaylists.uploads;

      // Obter vídeos da playlist
      const playlistResponse = await youtubeApi.get('/playlistItems', {
        params: {
          part: 'snippet,contentDetails',
          playlistId: uploadsPlaylistId,
          maxResults: limit,
          key: import.meta.env.VITE_YOUTUBE_API_KEY
        }
      });

      const videoIds = playlistResponse.data.items.map(item => item.contentDetails.videoId);

      // Obter estatísticas dos vídeos
      const videosStats = await this.getVideosStats(videoIds);

      return videosStats;
    } catch (error) {
      console.error(`Error fetching recent videos for channel ${channelId}:`, error);
      throw handleApiError(error, 'youtube');
    }
  }

  /**
   * Calcula a taxa de engajamento real para um canal com base nos vídeos
   * @param {Array} videos - Lista de vídeos com estatísticas
   * @param {Object} channelStats - Estatísticas do canal
   * @returns {string} Taxa de engajamento formatada
   */
  calculateChannelEngagement(videos, channelStats) {
    if (!videos || videos.length === 0) return "0.00";

    const subscriberCount = parseInt(channelStats.subscriberCount) || 1;
    let totalEngagement = 0;

    videos.forEach(video => {
      if (video.statistics) {
        const likes = parseInt(video.statistics.likeCount) || 0;
        const comments = parseInt(video.statistics.commentCount) || 0;
        totalEngagement += likes + comments;
      }
    });

    const avgEngagement = totalEngagement / videos.length;
    const engagementRate = (avgEngagement / subscriberCount) * 100;

    return engagementRate.toFixed(2);
  }

  /**
   * Obtém métricas avançadas para um canal
   * @param {string} channelId - ID do canal
   * @returns {Promise<Object>} Métricas avançadas
   */
  async getChannelAdvancedMetrics(channelId) {
    try {
      const { data } = await youtubeApi.get(`/channels/${channelId}/analytics`, {
        params: {
          part: 'demographics,ageGroups,countries',
          key: import.meta.env.VITE_YOUTUBE_API_KEY
        }
      });
      return data;
    } catch (error) {
      console.error(`Error fetching advanced metrics for channel ${channelId}:`, error);
      throw handleApiError(error, 'youtube');
    }
  }

  /**
   * Obtém métricas de confiabilidade para um canal
   * @param {string} channelId - ID do canal
   * @returns {Promise<Object>} Métricas de confiabilidade
   */
  async getChannelTrustMetrics(channelId) {
    try {
      const { data } = await youtubeApi.get(`/channels/${channelId}/trust`, {
        params: {
          key: import.meta.env.VITE_YOUTUBE_API_KEY
        }
      });
      return data;
    } catch (error) {
      console.error(`Error fetching trust metrics for channel ${channelId}:`, error);
      throw handleApiError(error, 'youtube');
    }
  }
  /**
   * Gera um URL para autenticação OAuth
   * @returns {string} URL de autenticação
   */
  generateAuthUrl() {
    const BASE_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
    const params = new URLSearchParams({
      client_id: import.meta.env.VITE_YOUTUBE_CLIENT_ID,
      redirect_uri: import.meta.env.VITE_YOUTUBE_REDIRECT_URI,
      response_type: 'code',
      scope: 'https://www.googleapis.com/auth/youtube.readonly',
      access_type: 'offline',
      prompt: 'consent'
    });

    return `${BASE_URL}?${params.toString()}`;
  }

  /**
   * Desconecta-se da API (remove tokens)
   */
  logout() {
    localStorage.removeItem('youtube_token');
    localStorage.removeItem('youtube_refresh_token');
    setAuthToken(null);
  }
}

// Exporta uma única instância do serviço para uso em toda a aplicação
export const youtubeService = new YouTubeService();

export default youtubeService;