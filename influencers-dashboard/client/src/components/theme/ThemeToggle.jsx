import React from 'react';
import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import useTranslation from "@/hooks/useTranslation";
import '@/styles/components/theme/themeToggle.css';

/**
 * Componente para alternar entre temas claro e escuro
 * 
 * @param {Object} props - Propriedades do componente
 * @param {string} props.className - Classes CSS adicionais
 */
const ThemeToggle = React.forwardRef(({ className = '', ...props }, ref) => {
  const { theme, toggleTheme } = useTheme();
  const { t } = useTranslation();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      className={`theme-toggle-button ${className}`}
      ref={ref}
      {...props}
    >
      {theme === 'light' ? (
        <>
          <Moon className="theme-toggle-icon" />
          <span className="theme-toggle-text">{t('theme.dark')}</span>
        </>
      ) : (
        <>
          <Sun className="theme-toggle-icon" />
          <span className="theme-toggle-text">{t('theme.light')}</span>
        </>
      )}
    </Button>
  );
});

ThemeToggle.displayName = 'ThemeToggle';

export { ThemeToggle };