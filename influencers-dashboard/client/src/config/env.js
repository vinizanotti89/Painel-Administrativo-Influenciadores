/**
 * Valida se todas as variáveis de ambiente necessárias estão definidas
 * @returns {boolean} True se todas as variáveis estão definidas, False caso contrário
 */
export const validateEnvironment = () => {
    const missingVars = requiredEnvVars.filter(varName => {
        // Acesso correto às variáveis de ambiente do Vite
        return typeof import.meta.env[varName] === 'undefined';
    });

    if (missingVars.length > 0) {
        console.error(
            'Aplicação iniciada com variáveis de ambiente faltando:',
            missingVars.join(', ')
        );
        return false;
    }

    return true;
};

/**
 * Obtém uma variável de ambiente com valor padrão como fallback
 * @param {string} key - Nome da variável de ambiente
 * @param {string} defaultValue - Valor padrão caso a variável não esteja definida
 * @returns {string} Valor da variável de ambiente ou o valor padrão
 */
export const getEnv = (key, defaultValue = '') => {
    // Acesso direto às variáveis de ambiente do Vite
    return import.meta.env[key] || defaultValue;
};

/**
 * Configurações centralizadas para as APIs de redes sociais
 */
export const apiConfig = {
    instagram: {
        accessToken: import.meta.env.VITE_INSTAGRAM_ACCESS_TOKEN,
        clientId: import.meta.env.VITE_INSTAGRAM_CLIENT_ID,
        clientSecret: import.meta.env.VITE_INSTAGRAM_CLIENT_SECRET,
        redirectUri: import.meta.env.VITE_INSTAGRAM_REDIRECT_URI
    },
    youtube: {
        apiKey: import.meta.env.VITE_YOUTUBE_API_KEY,
        clientId: import.meta.env.VITE_YOUTUBE_CLIENT_ID,
        clientSecret: import.meta.env.VITE_YOUTUBE_CLIENT_SECRET,
        redirectUri: import.meta.env.VITE_YOUTUBE_REDIRECT_URI
    },
    linkedin: {
        clientId: import.meta.env.VITE_LINKEDIN_CLIENT_ID,
        clientSecret: import.meta.env.VITE_LINKEDIN_CLIENT_SECRET,
        redirectUri: import.meta.env.VITE_LINKEDIN_REDIRECT_URI
    }
};