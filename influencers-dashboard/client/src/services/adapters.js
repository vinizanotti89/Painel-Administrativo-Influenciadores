/**
 * Módulo de adaptadores para padronizar os dados de diferentes plataformas
 * Converte as respostas específicas de cada API em um formato unificado
 * para uso consistente em toda a aplicação
 */

import { formatNumberWithSuffix } from '@/lib/formatters'; // Extraindo para um módulo separado

/**
 * Adapta dados de diferentes plataformas para um formato padronizado
 * 
 * @param {Object} data Dados originais da API
 * @param {string} platform Nome da plataforma ('instagram', 'youtube', 'linkedin')
 * @returns {Object} Dados adaptados para formato padronizado
 */
export const adaptPlatformData = (data, platform) => {
  if (!data) return null;

  // Objeto base para todas as plataformas
  const baseObject = {
    id: '',
    username: '',
    displayName: '',
    thumbnailUrl: '',
    followers: 0,
    followersFormatted: '0',
    platform: platform.charAt(0).toUpperCase() + platform.slice(1), // Primeira letra maiúscula
    metrics: {
      engagement: 0,
      posts: 0,
      views: 0,
      videos: 0
    },
    categories: [],
    analysisDate: new Date().toISOString(),
    trustScore: null
  };

  try {
    const platformLower = platform.toLowerCase();

    switch (platformLower) {
      case 'instagram':
        return adaptInstagramData(data, baseObject);
      case 'youtube':
        return adaptYouTubeData(data, baseObject);
      case 'linkedin':
        return adaptLinkedInData(data, baseObject);
      default:
        console.warn(`Adaptador não encontrado para a plataforma: ${platform}`);
        return baseObject;
    }
  } catch (error) {
    console.error(`Erro ao adaptar dados da plataforma ${platform}:`, error);
    // Registrar erro detalhado para debug
    console.error('Dados recebidos:', JSON.stringify(data, null, 2).substring(0, 500) + '...');
    return baseObject;
  }
};

/**
 * Adapta dados do Instagram para o formato padronizado
 * @param {Object} data - Dados brutos retornados pela API do Instagram
 * @param {Object} baseObject - Objeto base com estrutura padrão
 * @returns {Object} Dados formatados no padrão do dashboard
 */
function adaptInstagramData(data, baseObject) {
  if (!data) return baseObject;

  // Acessar dados usando getNestedValue para evitar erros com campos inexistentes
  const username = getNestedValue(data, ['username', 'user_username']) || '';
  const followersCount = getNestedValue(data, [
    'followers_count',
    'followers',
    'media_count',
    'user_data.followers_count'
  ]) || 0;

  // Calcular taxa de engajamento com melhor tratamento de erro
  let engagement = 0;
  try {
    if (data.engagement_rate) {
      engagement = parseFloat(data.engagement_rate);
    } else if (data.engagement) {
      engagement = parseFloat(data.engagement);
    } else if (data.media && Array.isArray(data.media) && data.media.length > 0) {
      // Cálculo baseado na média de curtidas/comentários das últimas postagens
      const totalEngagement = data.media.reduce((sum, post) => {
        const likes = post.like_count || post.likes || 0;
        const comments = post.comments_count || post.comments || 0;
        return sum + likes + comments;
      }, 0);

      if (followersCount > 0 && data.media.length > 0) {
        engagement = (totalEngagement / data.media.length / followersCount) * 100;
      }
    }
  } catch (err) {
    console.warn('Erro ao calcular engagement do Instagram:', err.message);
  }

  // Dados formatados
  const followersFormatted = formatNumberWithSuffix(followersCount);

  // Métricas específicas do Instagram
  const instagramSpecificMetrics = {
    reels: getNestedValue(data, ['reels_count', 'videos_count']) || 0,
    avgLikes: calculateAverageMetric(data.media, 'like_count', 'likes'),
    avgComments: calculateAverageMetric(data.media, 'comments_count', 'comments'),
    isBusiness: getNestedValue(data, ['is_business_account', 'is_business']) || false
  };

  return {
    ...baseObject,
    id: getNestedValue(data, ['id', 'user_id', 'pk']) || generateTempId('ig'),
    username,
    displayName: getNestedValue(data, ['full_name', 'user_full_name']) || username,
    thumbnailUrl: getNestedValue(data, ['profile_pic_url', 'user_profile_pic_url', 'profile_picture']) || '',
    followers: followersCount,
    followersFormatted,
    metrics: {
      ...baseObject.metrics,
      engagement: parseFloat(engagement.toFixed(2)),
      posts: getNestedValue(data, ['media_count', 'posts_count', 'user_data.media_count']) || 0,
      ...instagramSpecificMetrics
    },
    categories: extractCategories(data, 'instagram'),
    biography: getNestedValue(data, ['biography', 'user_biography', 'bio']) || '',
    isVerified: data.is_verified || false,
    trustScore: calculateTrustScore(data, 'instagram'),
    analysisDate: data.analysisDate || baseObject.analysisDate,
    audience: data.audience || null,
    // Campos adicionais específicos para Instagram
    recentPosts: formatRecentPosts(data.media)
  };
}

/**
 * Adapta dados do YouTube para o formato padronizado
 * @param {Object} data - Dados brutos retornados pela API do YouTube
 * @param {Object} baseObject - Objeto base com estrutura padrão
 * @returns {Object} Dados formatados no padrão do dashboard
 */
function adaptYouTubeData(data, baseObject) {
  if (!data) return baseObject;

  // Extrai dados das estruturas do YouTube de forma segura
  const channelData = data.items && data.items[0] ? data.items[0] : data;
  const snippet = channelData.snippet || {};
  const statistics = channelData.statistics || {};

  // Extrai contagem de seguidores (inscritos)
  const subscriberCount = parseInt(statistics.subscriberCount || 0);

  // Calcula engajamento (simplificado para YouTube)
  let engagement = 0;
  try {
    if (statistics.viewCount && statistics.videoCount && statistics.subscriberCount) {
      // Cálculo simplificado: (views/video)/subscribers
      const viewsPerVideo = parseInt(statistics.viewCount) / Math.max(parseInt(statistics.videoCount), 1);
      engagement = (viewsPerVideo / parseInt(statistics.subscriberCount)) * 100;
    } else if (data.statistics && data.statistics.engagement) {
      engagement = data.statistics.engagement;
    }
  } catch (err) {
    console.warn('Erro ao calcular engagement do YouTube:', err.message);
  }

  // Formatar contagem de inscritos
  const followersFormatted = formatNumberWithSuffix(subscriberCount);

  // Métricas específicas do YouTube
  const youtubeSpecificMetrics = {
    totalViews: parseInt(statistics.viewCount || 0),
    avgViewsPerVideo: calculateAvgViewsPerVideo(statistics),
    commentsCount: parseInt(statistics.commentCount || 0),
    likesCount: parseInt(statistics.likeCount || 0)
  };

  return {
    ...baseObject,
    id: channelData.id || data.channelId || generateTempId('yt'),
    username: snippet.title || data.channelName || '',
    displayName: snippet.title || data.channelName || '',
    thumbnailUrl: getNestedValue(snippet, ['thumbnails.high.url', 'thumbnails.default.url']) || data.thumbnailUrl || '',
    followers: subscriberCount || (data.statistics && data.statistics.followers) || 0,
    followersFormatted,
    metrics: {
      ...baseObject.metrics,
      engagement: parseFloat(engagement.toFixed(2)),
      views: parseInt(statistics.viewCount || (data.statistics && data.statistics.views) || 0),
      videos: parseInt(statistics.videoCount || (data.statistics && data.statistics.videos) || 0),
      ...youtubeSpecificMetrics
    },
    categories: extractCategories(data, 'youtube'),
    description: snippet.description || '',
    country: snippet.country || '',
    trustScore: calculateTrustScore(data, 'youtube'),
    analysisDate: data.analysisDate || baseObject.analysisDate,
    audience: data.audience || null,
    // Campos adicionais específicos para YouTube
    recentVideos: formatRecentVideos(data.videos)
  };
}

/**
 * Adapta dados do LinkedIn para o formato padronizado
 * @param {Object} data - Dados brutos retornados pela API do LinkedIn
 * @param {Object} baseObject - Objeto base com estrutura padrão
 * @returns {Object} Dados formatados no padrão do dashboard
 */
function adaptLinkedInData(data, baseObject) {
  if (!data) return baseObject;

  // Extrai dados básicos do LinkedIn de forma segura
  const fullName = getNestedValue(data, [
    'fullName',
    'localizedFirstName,localizedLastName',
    'firstName,lastName'
  ], value => {
    if (Array.isArray(value)) {
      return value.join(' ');
    }
    return value;
  }) || '';

  const connectionsCount = getNestedValue(data, [
    'numConnections',
    'connections',
    'followersCount'
  ]) || 0;

  // Calcula engajamento padrão para LinkedIn (usando uma média típica)
  const engagementRate = data.engagementRate || data.engagement || 2.0; // 2% é uma taxa típica no LinkedIn

  // Formatar contagem de conexões
  const followersFormatted = formatNumberWithSuffix(connectionsCount);

  // Métricas específicas do LinkedIn
  const linkedinSpecificMetrics = {
    connections: getNestedValue(data, ['connections', 'numConnections']) || 0,
    endorsements: getNestedValue(data, ['numEndorsements', 'endorsementsCount']) || 0,
    articles: getNestedValue(data, ['numArticles', 'articlesCount']) || 0
  };

  return {
    ...baseObject,
    id: data.id || data.publicIdentifier || generateTempId('li'),
    username: data.username || data.publicIdentifier || data.vanityName || '',
    displayName: fullName,
    thumbnailUrl: data.profilePicture || data.pictureUrl || '',
    followers: connectionsCount,
    followersFormatted,
    metrics: {
      ...baseObject.metrics,
      engagement: parseFloat(engagementRate.toFixed(2)),
      posts: data.numPosts || data.postsCount || 0,
      ...linkedinSpecificMetrics
    },
    categories: extractCategories(data, 'linkedin'),
    headline: data.headline || '',
    industry: data.industry || '',
    location: data.location || data.locationName || '',
    trustScore: calculateTrustScore(data, 'linkedin'),
    analysisDate: data.analysisDate || baseObject.analysisDate,
    audience: data.audience || null,
    // Campos adicionais específicos para LinkedIn
    skills: Array.isArray(data.skills) ? data.skills.slice(0, 10) : [],
    experience: formatExperience(data.experience)
  };
}

/**
 * Extrai categorias dos dados com base na plataforma
 * @param {Object} data - Dados originais
 * @param {string} platform - Nome da plataforma
 * @returns {Array} Lista de categorias
 */
function extractCategories(data, platform) {
  const categories = [];

  try {
    switch (platform) {
      case 'instagram':
        // Tenta extrair categorias de diferentes locais nos dados
        if (data.category) {
          categories.push(cleanCategory(data.category));
        }

        if (data.business_category_name) {
          categories.push(cleanCategory(data.business_category_name));
        }

        // Tenta extrair de hashtags frequentes
        if (data.media && Array.isArray(data.media)) {
          const hashtagsCount = {};

          data.media.forEach(post => {
            const caption = post.caption || '';
            const hashtags = caption.match(/#[a-zA-Z0-9]+/g) || [];

            hashtags.forEach(tag => {
              hashtagsCount[tag] = (hashtagsCount[tag] || 0) + 1;
            });
          });

          // Pega as 3 hashtags mais usadas
          const topHashtags = Object.entries(hashtagsCount)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(entry => cleanCategory(entry[0].substring(1))); // Remove o # do início

          categories.push(...topHashtags);
        }
        break;

      case 'youtube':
        // Extrai categoria do YouTube
        if (data.items && data.items[0] && data.items[0].snippet) {
          const categoryId = data.items[0].snippet.categoryId;
          if (categoryId) {
            const category = mapYouTubeCategory(categoryId);
            if (category) categories.push(cleanCategory(category));
          }
        } else if (data.snippet && data.snippet.categoryId) {
          const category = mapYouTubeCategory(data.snippet.categoryId);
          if (category) categories.push(cleanCategory(category));
        }

        // Extrai de tags
        const tags = (data.snippet && data.snippet.tags) || [];
        if (tags.length > 0) {
          // Filtra tags relevantes que podem indicar categorias
          const relevantTags = tags.filter(tag => {
            return !tag.startsWith('#') && tag.length > 3;
          }).slice(0, 2).map(cleanCategory);

          categories.push(...relevantTags);
        }
        break;

      case 'linkedin':
        // Extrai da indústria e especialidades
        if (data.industry) {
          categories.push(cleanCategory(data.industry));
        }

        if (data.specialties && Array.isArray(data.specialties)) {
          categories.push(...data.specialties.slice(0, 2).map(cleanCategory));
        }

        // Adiciona categorias baseadas em palavras-chave do título/headline
        if (data.headline) {
          const headline = data.headline.toLowerCase();
          const keywordMap = {
            'marketing': 'Marketing',
            'tech': 'Technology',
            'developer': 'Software Development',
            'sales': 'Sales',
            'healthcare': 'Healthcare',
            'finance': 'Finance',
            'education': 'Education',
            'consulting': 'Consulting'
          };

          Object.entries(keywordMap).forEach(([keyword, category]) => {
            if (headline.includes(keyword) && !categories.includes(category)) {
              categories.push(cleanCategory(category));
            }
          });
        }
        break;

      default:
        break;
    }
  } catch (err) {
    console.warn(`Erro ao extrair categorias para ${platform}:`, err.message);
  }

  // Remove duplicatas e limita a 5 categorias
  return [...new Set(categories)].slice(0, 5);
}

/**
 * Limpa e formata uma string de categoria
 * @param {string} category - Categoria a ser limpa
 * @returns {string} Categoria formatada
 */
function cleanCategory(category) {
  if (!category) return '';

  // Remove caracteres especiais e formata corretamente
  return category
    .trim()
    .replace(/[^\w\s]/gi, '')
    .replace(/\s+/g, ' ')
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Mapeia IDs de categoria do YouTube para nomes de categoria
 * @param {string} categoryId - ID da categoria do YouTube
 * @returns {string|null} Nome da categoria ou null se não encontrada
 */
function mapYouTubeCategory(categoryId) {
  const categoryMap = {
    '1': 'Film & Animation',
    '2': 'Autos & Vehicles',
    '10': 'Music',
    '15': 'Pets & Animals',
    '17': 'Sports',
    '18': 'Short Movies',
    '19': 'Travel & Events',
    '20': 'Gaming',
    '21': 'Videoblogging',
    '22': 'People & Blogs',
    '23': 'Comedy',
    '24': 'Entertainment',
    '25': 'News & Politics',
    '26': 'Howto & Style',
    '27': 'Education',
    '28': 'Science & Technology',
    '29': 'Nonprofits & Activism',
    '30': 'Movies',
    '31': 'Anime/Animation',
    '32': 'Action/Adventure',
    '33': 'Classics',
    '34': 'Comedy',
    '35': 'Documentary',
    '36': 'Drama',
    '37': 'Family',
    '38': 'Foreign',
    '39': 'Horror',
    '40': 'Sci-Fi/Fantasy',
    '41': 'Thriller',
    '42': 'Shorts',
    '43': 'Shows',
    '44': 'Trailers'
  };

  return categoryMap[categoryId] || null;
}

/**
 * Função utilitária para obter um valor aninhado em um objeto com vários caminhos possíveis
 * @param {Object} obj - Objeto a ser navegado
 * @param {Array<string|Array<string>>} paths - Caminhos possíveis para o valor
 * @param {Function} transform - Função opcional para transformar o valor encontrado
 * @returns {any} Valor encontrado ou undefined
 */
function getNestedValue(obj, paths, transform = null) {
  if (!obj) return undefined;

  for (const path of paths) {
    if (typeof path === 'string' && path.includes('.')) {
      // Caminho aninhado com pontos (a.b.c)
      const segments = path.split('.');
      let current = obj;
      let found = true;

      for (const segment of segments) {
        if (current === undefined || current === null) {
          found = false;
          break;
        }
        current = current[segment];
      }

      if (found && current !== undefined) {
        return transform ? transform(current) : current;
      }
    } else if (typeof path === 'string' && path.includes(',')) {
      // Múltiplos campos a serem combinados (firstName,lastName)
      const segments = path.split(',');
      const values = segments.map(segment => obj[segment.trim()]).filter(Boolean);

      if (values.length > 0) {
        return transform ? transform(values) : values.join(' ');
      }
    } else if (obj[path] !== undefined) {
      // Propriedade direta
      return transform ? transform(obj[path]) : obj[path];
    }
  }

  return undefined;
}

/**
 * Calcula uma pontuação de confiabilidade com base nos dados disponíveis
 * @param {Object} data - Dados do perfil
 * @param {string} platform - Nome da plataforma
 * @returns {number} Pontuação de confiabilidade (0-100)
 */
function calculateTrustScore(data, platform) {
  if (!data) return null;

  try {
    // Se já existe uma pontuação calculada, usa ela
    if (data.trustScore !== undefined) return data.trustScore;

    let score = 50; // Pontuação base

    // Fatores comuns a todas as plataformas
    if (data.is_verified || data.verified) score += 15;

    // Fatores específicos de cada plataforma
    switch (platform) {
      case 'instagram':
        // Perfil com biografia completa
        if (data.biography && data.biography.length > 10) score += 5;
        // Link externo adicionado
        if (data.external_url) score += 5;
        // Mídia disponível
        if (data.media && data.media.length > 5) score += 10;
        // Conta de negócios
        if (data.is_business_account) score += 5;
        break;

      case 'youtube':
        // Canal com descrição detalhada
        if (data.snippet && data.snippet.description && data.snippet.description.length > 20) score += 10;
        // Canal com muitos vídeos
        if (data.statistics && data.statistics.videoCount > 10) score += 5;
        // Canal mais antigo (com data de publicação)
        if (data.snippet && data.snippet.publishedAt) {
          const channelAge = new Date() - new Date(data.snippet.publishedAt);
          const ageInYears = channelAge / (1000 * 60 * 60 * 24 * 365);
          if (ageInYears > 2) score += 10;
        }
        break;

      case 'linkedin':
        // Perfil com título/headline
        if (data.headline && data.headline.length > 10) score += 5;
        // Perfil com experiência
        if (data.experience && data.experience.length > 0) score += 10;
        // Perfil com educação
        if (data.education && data.education.length > 0) score += 5;
        // Perfil com habilidades
        if (data.skills && data.skills.length > 5) score += 5;
        break;
    }

    // Garante que a pontuação esteja no intervalo 0-100
    return Math.min(Math.max(score, 0), 100);
  } catch (err) {
    console.warn(`Erro ao calcular pontuação de confiabilidade para ${platform}:`, err.message);
    return 50; // Valor padrão em caso de erro
  }
}

/**
 * Calcula média de uma métrica específica em uma lista de itens
 * @param {Array} items - Lista de itens (posts, vídeos, etc)
 * @param {string} primaryKey - Nome da propriedade primária
 * @param {string} fallbackKey - Nome da propriedade alternativa
 * @returns {number} Média calculada ou 0
 */
function calculateAverageMetric(items, primaryKey, fallbackKey) {
  if (!items || !Array.isArray(items) || items.length === 0) return 0;

  try {
    const total = items.reduce((sum, item) => {
      const value = item[primaryKey] !== undefined ? item[primaryKey] : item[fallbackKey];
      return sum + (Number(value) || 0);
    }, 0);

    return Math.round(total / items.length);
  } catch (err) {
    console.warn(`Erro ao calcular média de ${primaryKey}/${fallbackKey}:`, err.message);
    return 0;
  }
}

/**
 * Calcula a média de visualizações por vídeo
 * @param {Object} statistics - Estatísticas do canal
 * @returns {number} Média de visualizações por vídeo
 */
function calculateAvgViewsPerVideo(statistics) {
  if (!statistics) return 0;

  const views = parseInt(statistics.viewCount || 0);
  const videos = parseInt(statistics.videoCount || 1); // Evita divisão por zero

  return Math.round(views / videos);
}

/**
 * Formata lista de postagens recentes para exibição
 * @param {Array} media - Lista de postagens
 * @returns {Array} Lista formatada de postagens
 */
function formatRecentPosts(media) {
  if (!media || !Array.isArray(media)) return [];

  try {
    return media.slice(0, 5).map(post => ({
      id: post.id || post.pk || '',
      type: post.media_type || post.type || 'image',
      url: post.permalink || post.link || '',
      thumbnailUrl: getNestedValue(post, ['thumbnail_url', 'thumbnail_src', 'image_url']) || '',
      caption: (post.caption || '').substring(0, 100) + (post.caption && post.caption.length > 100 ? '...' : ''),
      likes: post.like_count || post.likes || 0,
      comments: post.comments_count || post.comments || 0,
      date: post.timestamp || post.created_time || ''
    }));
  } catch (err) {
    console.warn('Erro ao formatar postagens recentes:', err.message);
    return [];
  }
}

/**
 * Formata lista de vídeos recentes para exibição
 * @param {Array} videos - Lista de vídeos
 * @returns {Array} Lista formatada de vídeos
 */
function formatRecentVideos(videos) {
  if (!videos || !Array.isArray(videos)) return [];

  try {
    return videos.slice(0, 5).map(video => ({
      id: video.id || '',
      title: (video.snippet && video.snippet.title) || video.title || '',
      description: ((video.snippet && video.snippet.description) || video.description || '').substring(0, 100) +
        ((video.snippet && video.snippet.description && video.snippet.description.length > 100) ? '...' : ''),
      thumbnailUrl: getNestedValue(video, ['snippet.thumbnails.high.url', 'snippet.thumbnails.default.url', 'thumbnail']) || '',
      viewCount: (video.statistics && video.statistics.viewCount) || video.views || 0,
      likeCount: (video.statistics && video.statistics.likeCount) || video.likes || 0,
      date: (video.snippet && video.snippet.publishedAt) || video.publishedAt || ''
    }));
  } catch (err) {
    console.warn('Erro ao formatar vídeos recentes:', err.message);
    return [];
  }
}

/**
 * Formata experiência profissional do LinkedIn
 * @param {Array} experience - Lista de experiências
 * @returns {Array} Lista formatada de experiências
 */
function formatExperience(experience) {
  if (!experience || !Array.isArray(experience)) return [];

  try {
    return experience.slice(0, 3).map(exp => ({
      title: exp.title || '',
      company: exp.companyName || exp.company || '',
      dateRange: `${exp.startDate || 'Present'} - ${exp.endDate || 'Present'}`,
      description: exp.description ? exp.description.substring(0, 100) + (exp.description.length > 100 ? '...' : '') : ''
    }));
  } catch (err) {
    console.warn('Erro ao formatar experiência profissional:', err.message);
    return [];
  }
}

/**
 * Gera um ID temporário para registros sem ID
 * @param {string} prefix - Prefixo da plataforma
 * @returns {string} ID temporário
 */
function generateTempId(prefix) {
  return `${prefix}_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
}

// Exporta adaptadores específicos para testes unitários e uso em outros módulos
export {
  adaptInstagramData,
  adaptYouTubeData,
  adaptLinkedInData,
  extractCategories,
  calculateTrustScore,
  getNestedValue,
  formatRecentPosts,
  formatRecentVideos
};