import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState(() => {
        // Verificar se há um idioma salvo no localStorage
        const savedLanguage = localStorage.getItem('app-language');
        return savedLanguage || 'en'; // Padrão é inglês
    });

    useEffect(() => {
        // Salvar idioma no localStorage quando ele mudar
        localStorage.setItem('app-language', language);
        // Adicionar atributo data-language ao elemento html
        document.documentElement.setAttribute('data-language', language);
    }, [language]);

    const toggleLanguage = () => {
        setLanguage(prevLanguage => prevLanguage === 'pt' ? 'en' : 'pt');
    };

    return (
        <LanguageContext.Provider value={{ language, toggleLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => useContext(LanguageContext);