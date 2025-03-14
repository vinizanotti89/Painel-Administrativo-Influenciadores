import React from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

// Use caminhos relativos para evitar problemas de alias
const LanguageToggle = React.forwardRef(({ className = '', ...props }, ref) => {
    const { language, toggleLanguage } = useLanguage();
    const isEnglish = language === 'en';

    return (
        <Button
            variant="ghost"
            size="sm"
            onClick={toggleLanguage}
            className={`language-toggle-button ${className}`}
            ref={ref}
            {...props}
        >
            <div className="language-toggle-content">
                {isEnglish ? (
                    <>
                        <span className="flag-icon brazil-flag" aria-hidden="true"></span>
                        <span className="language-text">
                            Selecione o Idioma
                            <span className="language-code">PT-BR</span>
                        </span>
                    </>
                ) : (
                    <>
                        <span className="flag-icon usa-flag" aria-hidden="true"></span>
                        <span className="language-text">
                            Choose Language
                            <span className="language-code">US-EN</span>
                        </span>
                    </>
                )}
            </div>
        </Button>
    );
});

LanguageToggle.displayName = 'LanguageToggle';

export { LanguageToggle };