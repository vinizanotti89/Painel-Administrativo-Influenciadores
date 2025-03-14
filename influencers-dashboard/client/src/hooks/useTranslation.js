import { useLanguage } from '@/contexts/LanguageContext';
import translations from '@/lib/translations';

const useTranslation = () => {
    const { language } = useLanguage();

    const t = (path) => {
        // Divide o caminho por '.' para navegar no objeto de traduções
        const keys = path.split('.');
        let value = translations;

        // Percorre a estrutura do objeto
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];

            if (value[key] === undefined) {
                console.warn(`Translation key not found: ${path}`);
                return path;
            }

            value = value[key];
        }

        // Retorna a tradução para o idioma atual ou a chave se não encontrado
        if (value && value[language]) {
            return value[language];
        }

        console.warn(`No translation found for ${path} in language ${language}`);
        return path;
    };

    return { t, language };
};

export default useTranslation;