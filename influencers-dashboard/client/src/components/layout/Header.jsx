import React from 'react';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { LanguageToggle } from '@/components/theme/LanguageToggle';
import useTranslation from '@/hooks/useTranslation';
import '@/styles/components/layout/Header.css';

const Header = React.forwardRef(({ className = '', ...props }, ref) => {
  const { t } = useTranslation();

  return (
    <header className={`header ${className}`} ref={ref} {...props}>
      <div className="header-container">
        <div className="header-content">
          <div className="header-title">
            <h1>{t('header.title')}</h1>
          </div>
          <div className="header-actions">
            <LanguageToggle className="mr-3" />
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
});

Header.displayName = 'Header';

export { Header };
