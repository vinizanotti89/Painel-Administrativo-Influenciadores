/**
 * Módulo com funções de formatação para uso em toda a aplicação
 * Centraliza funções reutilizáveis para formatar números, datas e textos
 */

/**
 * Formata números com sufixos K, M, B para melhor legibilidade
 * Compatível com a função formatNumber no componente InfluencerSearch
 * 
 * @param {number|string} number - Número a formatar
 * @param {boolean} keepDecimal - Mantém decimal mesmo quando for .0
 * @returns {string} Número formatado com sufixo
 */
export function formatNumberWithSuffix(number, keepDecimal = false) {
    if (!number && number !== 0) return '0';

    // Converte para número se for string
    const num = typeof number === 'string' ? parseFloat(number) : number;

    if (num >= 1000000000) {
        const formatted = (num / 1000000000).toFixed(1);
        return (keepDecimal ? formatted : formatted.replace(/\.0$/, '')) + 'B';
    } else if (num >= 1000000) {
        const formatted = (num / 1000000).toFixed(1);
        return (keepDecimal ? formatted : formatted.replace(/\.0$/, '')) + 'M';
    } else if (num >= 1000) {
        const formatted = (num / 1000).toFixed(1);
        return (keepDecimal ? formatted : formatted.replace(/\.0$/, '')) + 'K';
    }

    return num.toString();
}

/**
 * Formata uma porcentagem para exibição
 * Compatível com a formatação utilizada no InfluencerSearch para engagement
 * 
 * @param {number|string} value - Valor a ser formatado (0-100 ou 0-1)
 * @param {Object} options - Opções de formatação
 * @param {boolean} options.autoScale - Escala automaticamente valores entre 0-1 para 0-100
 * @param {number} options.decimals - Número de casas decimais (padrão: 2)
 * @param {boolean} options.includeSymbol - Inclui símbolo de % no resultado (padrão: true)
 * @param {boolean} options.keepTrailingZeros - Mantém zeros no final (padrão: false)
 * @returns {string} Valor formatado como porcentagem
 */
export function formatPercentage(value, options = {}) {
    if (value === undefined || value === null) return '0%';

    const {
        autoScale = true,
        decimals = 2,
        includeSymbol = true,
        keepTrailingZeros = false
    } = options;

    // Converte para número
    let num = typeof value === 'string' ? parseFloat(value) : value;

    // Escala automaticamente se for entre 0-1
    if (autoScale && num > 0 && num < 1) {
        num *= 100;
    }

    // Formata com casas decimais específicas
    const formatted = num.toFixed(decimals);
    const finalFormatted = keepTrailingZeros ? formatted : formatted.replace(/\.0+$/, '');

    // Adiciona símbolo de porcentagem se solicitado
    return includeSymbol ? `${finalFormatted}%` : finalFormatted;
}

/**
 * Formata uma data para exibição localizada
 * @param {string|Date} date - Data a ser formatada
 * @param {string} locale - Localidade (padrão: 'pt-BR')
 * @param {Object} options - Opções de formatação (mesmo que Intl.DateTimeFormat)
 * @returns {string} Data formatada
 */
export function formatDate(date, locale = 'pt-BR', options = {}) {
    if (!date) return '';

    const defaultOptions = {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    };

    try {
        const dateObj = typeof date === 'string' ? new Date(date) : date;
        return new Intl.DateTimeFormat(locale, { ...defaultOptions, ...options }).format(dateObj);
    } catch (error) {
        console.warn('Erro ao formatar data:', error);
        return '';
    }
}

/**
 * Formata nome de usuário com @ se necessário
 * @param {string} username - Nome de usuário para formatar
 * @param {boolean} forceAtSymbol - Força a inclusão do @ mesmo se já existir
 * @returns {string} Nome de usuário formatado
 */
export function formatUsername(username, forceAtSymbol = false) {
    if (!username) return '';

    if (forceAtSymbol) {
        return username.startsWith('@') ? username : `@${username}`;
    }

    return username;
}

/**
 * Trunca texto e adiciona elipse se exceder o comprimento máximo
 * @param {string} text - Texto a ser truncado
 * @param {number} maxLength - Comprimento máximo (padrão: 100)
 * @param {string} ellipsis - Caracteres a adicionar ao final (padrão: '...')
 * @returns {string} Texto truncado
 */
export function truncateText(text, maxLength = 100, ellipsis = '...') {
    if (!text) return '';

    if (text.length <= maxLength) {
        return text;
    }

    return text.substring(0, maxLength) + ellipsis;
}

/**
 * Formata um valor de engajamento com ícone
 * Compatível com o método de avaliação de Trust Score no InfluencerSearch
 * 
 * @param {number} value - Valor do engajamento (0-100)
 * @param {Object} options - Opções de formatação
 * @param {boolean} options.returnClassOnly - Retorna apenas a classe CSS
 * @returns {Object|string} Objeto com valor formatado, classe e descrição ou apenas a classe CSS
 */
export function formatEngagementValue(value, options = {}) {
    const { returnClassOnly = false } = options;

    if (value === undefined || value === null) {
        return returnClassOnly ? 'low' : { value: '0%', class: 'low', description: 'Não disponível' };
    }

    const numValue = typeof value === 'string' ? parseFloat(value) : value;

    // Determina categoria de engajamento
    let category = 'low';
    let description = 'Baixo';

    if (numValue >= 5) {
        category = 'exceptional';
        description = 'Excepcional';
    } else if (numValue >= 3.5) {
        category = 'high';
        description = 'Alto';
    } else if (numValue >= 2) {
        category = 'medium';
        description = 'Médio';
    }

    return returnClassOnly ? category : {
        value: formatPercentage(numValue),
        class: `engagement-${category}`,
        description
    };
}

/**
 * Formata um número para exibição com separador de milhares e casas decimais
 * @param {number|string} number - Número a ser formatado
 * @param {string} locale - Localidade (padrão: 'pt-BR')
 * @param {number} decimals - Número de casas decimais (padrão: 0)
 * @returns {string} Número formatado
 */
export function formatNumber(number, locale = 'pt-BR', decimals = 0) {
    if (number === undefined || number === null) return '0';

    const num = typeof number === 'string' ? parseFloat(number) : number;

    try {
        return new Intl.NumberFormat(locale, {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        }).format(num);
    } catch (error) {
        console.warn('Erro ao formatar número:', error);
        return num.toString();
    }
}

/**
 * Formata duração em segundos para formato legível
 * @param {number} seconds - Duração em segundos
 * @param {boolean} shortened - Se deve usar formato abreviado (padrão: false)
 * @returns {string} Duração formatada (ex: "5m 30s" ou "5 minutos e 30 segundos")
 */
export function formatDuration(seconds, shortened = false) {
    if (!seconds && seconds !== 0) return shortened ? '0s' : '0 segundos';

    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (shortened) {
        return [
            hrs > 0 ? `${hrs}h` : '',
            mins > 0 ? `${mins}m` : '',
            (secs > 0 || (hrs === 0 && mins === 0)) ? `${secs}s` : ''
        ].filter(Boolean).join(' ');
    } else {
        return [
            hrs > 0 ? `${hrs} ${hrs === 1 ? 'hora' : 'horas'}` : '',
            mins > 0 ? `${mins} ${mins === 1 ? 'minuto' : 'minutos'}` : '',
            (secs > 0 || (hrs === 0 && mins === 0)) ? `${secs} ${secs === 1 ? 'segundo' : 'segundos'}` : ''
        ].filter(Boolean).join(' e ');
    }
}

/**
 * Calcula pontuação de confiança (Trust Score) para um influenciador
 * Implementação compatível com o método calculateTrustScore do InfluencerSearch
 * 
 * @param {Object} influencer - Dados do influenciador
 * @param {Object} options - Opções de cálculo
 * @param {number} options.engagementWeight - Peso do engajamento no cálculo (padrão: 0.6)
 * @param {number} options.followersWeight - Peso dos seguidores no cálculo (padrão: 0.4)
 * @param {number} options.engagementMax - Valor de engajamento considerado máximo (padrão: 5%)
 * @param {number} options.followersMax - Valor de seguidores considerado máximo (padrão: 100k)
 * @returns {number} Pontuação de confiança (0-100)
 */
export function calculateTrustScore(influencer, options = {}) {
    if (!influencer) return 0;

    // Se já temos um trustScore calculado, usamos ele
    if (influencer.trustScore !== undefined) return influencer.trustScore;

    const {
        engagementWeight = 0.6,
        followersWeight = 0.4,
        engagementMax = 5,
        followersMax = 100000
    } = options;

    const engagement = parseFloat(influencer.metrics?.engagement) || 0;
    const followers = parseInt(influencer.followers) || 0;

    // Normalização dos valores (0-100)
    const followerScore = Math.min(followers / followersMax * 100, 100);
    const engagementScore = Math.min(engagement / engagementMax * 100, 100);

    // Cálculo ponderado
    const trustScore = Math.round(
        (engagementScore * engagementWeight) + (followerScore * followersWeight)
    );

    return Math.min(trustScore, 100);
}

/**
 * Determina a classe CSS para exibição do Trust Score
 * Compatível com o método getTrustScoreClass do InfluencerSearch
 * 
 * @param {number} score - Pontuação de confiança (0-100)
 * @returns {string} Classe CSS (high, medium, low)
 */
export function getTrustScoreClass(score) {
    if (score >= 80) return 'high';
    if (score >= 60) return 'medium';
    return 'low';
}

export default {
    formatNumberWithSuffix,
    formatPercentage,
    formatDate,
    formatUsername,
    truncateText,
    formatEngagementValue,
    formatNumber,
    formatDuration,
    calculateTrustScore,
    getTrustScoreClass
};