/**
 * Funções utilitárias para manipulação de dados e tratamento de erros de APIs
 */
import { errorService } from '@/lib/errorMessages';

/**
 * Formata números para exibição em K (mil) ou M (milhão)
 * @param {number} number - Número a ser formatado
 * @returns {string} Número formatado com K ou M quando apropriado
 */
export const formatNumberToK = (number) => {
    if (!number && number !== 0) return '0';

    if (number >= 1000000) {
        return `${(number / 1000000).toFixed(1)}M`;
    }

    if (number >= 1000) {
        return `${(number / 1000).toFixed(1)}K`;
    }

    return number.toString();
};

/**
 * Calcula a taxa de engajamento
 * @param {number} engagementCount - Número total de engajamentos
 * @param {number} followersCount - Número de seguidores
 * @returns {string} Taxa de engajamento formatada como porcentagem
 */
export const calculateEngagementRate = (engagementCount, followersCount) => {
    if (!followersCount || followersCount <= 0) return '0.00';

    const rate = (engagementCount / followersCount) * 100;
    return rate.toFixed(2);
};

/**
 * Trata erros de API de forma padronizada
 * @param {Error} error - Objeto de erro original
 * @param {string} platform - Plataforma relacionada ao erro (youtube, instagram, linkedin)
 * @returns {Error} Erro normalizado com mensagem amigável
 */
export const handleApiError = (error, platform = 'generic') => {
    // Usa o serviço centralizado para normalizar o erro
    const normalizedError = errorService.normalizeError(error, platform);

    console.error(`API Error (${platform}):`, {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        message: error.message,
        timestamp: new Date().toISOString()
    });

    // Reportar o erro para o serviço centralizado
    errorService.reportError(`${platform}_api_error`, error, {
        platform,
        operation: 'api_call'
    });

    if (error.response) {
        // Erro com resposta do servidor
        const { status, data } = error.response;
        const message = data?.message || `Erro ${status}: ${data?.error || 'Erro desconhecido'}`;
        return new Error(message);
    } else if (error.request) {
        // Erro sem resposta (problemas de conexão)
        return new Error('Não foi possível conectar ao servidor. Verifique sua conexão com a internet.');
    } else {
        // Outros erros
        return new Error(normalizedError.message || 'Ocorreu um erro ao processar sua solicitação.');
    }
};

/**
 * Remove dados sensíveis (tokens, credenciais) para logging seguro
 * @param {Object} data - Dados originais
 * @returns {Object} Dados seguros para log
 */
export const sanitizeDataForLogging = (data) => {
    if (!data) return null;

    const sensitiveFields = ['token', 'access_token', 'refresh_token', 'api_key', 'password', 'secret'];
    const safeData = { ...data };

    // Percorre os campos e mascara dados sensíveis
    Object.keys(safeData).forEach(key => {
        if (sensitiveFields.some(field => key.toLowerCase().includes(field))) {
            safeData[key] = '***REDACTED***';
        } else if (typeof safeData[key] === 'object' && safeData[key] !== null) {
            safeData[key] = sanitizeDataForLogging(safeData[key]);
        }
    });

    return safeData;
};