import React from 'react';
import { TrendingUp, TrendingDown, Users, Eye, Heart, MessageCircle, Share2, Award } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import '@/styles/components/dashboard/stats-card.css';

/**
 * StatsCard - Componente que exibe estatísticas com título, valor, ícone e tendência
 * 
 * @param {Object} props
 * @param {string} props.title - Título do card
 * @param {string} props.value - Valor principal a ser exibido
 * @param {React.ComponentType|string} props.icon - Componente de ícone do Lucide ou nome do ícone como string
 * @param {string} props.trend - Tendência (com prefixo + ou - para indicar positivo/negativo)
 * @param {string} props.description - Descrição adicional do valor
 * @param {string} props.className - Classes CSS adicionais
 * @param {string} props.variant - Variante do componente (default, instagram, youtube, linkedin)
 */
const StatsCard = React.forwardRef(({
  title,
  value,
  icon,
  trend,
  description,
  className = '',
  variant = 'default',
  ...props
}, ref) => {
  const { theme } = useTheme();

  const iconMap = {
    'TrendingUp': TrendingUp,
    'TrendingDown': TrendingDown,
    'Users': Users,
    'Eye': Eye,
    'Heart': Heart,
    'MessageCircle': MessageCircle,
    'Share2': Share2,
    'Award': Award,
  };

  // Detecta se o trend é positivo, negativo ou neutro
  const getTrendClass = () => {
    if (!trend) return '';
    if (trend.startsWith('+')) return 'stats-card-trend-positive';
    if (trend.startsWith('-')) return 'stats-card-trend-negative';
    return '';
  };

  // Determina qual ícone de tendência mostrar
  const getTrendIcon = () => {
    if (!trend) return null;
    return trend.startsWith('+') ?
      <TrendingUp className="stats-card-trend-icon" size={14} /> :
      <TrendingDown className="stats-card-trend-icon" size={14} />;
  };

  // Renderiza o ícone principal, manipulando tanto componente direto quanto string
  const renderIcon = () => {
    if (!icon) return null;

    // Se for um componente React (function/class)
    if (typeof icon === 'function') {
      const IconComponent = icon;
      return <IconComponent className="stats-card-icon" />;
    }

    // Se for uma string (nome do ícone)
    if (typeof icon === 'string') {
      const IconComponent = iconMap[icon];
      if (IconComponent) {
        return <IconComponent className="stats-card-icon" />;
      }
      console.error(`Ícone "${icon}" não encontrado`);
      return null;
    }

    return null;
  };

  return (
    <div
      className={`stats-card ${variant} ${theme ? `theme-${theme}` : ''} ${className}`}
      ref={ref}
      {...props}
    >
      <div className="stats-card-header">
        <h3 className="stats-card-title">{title}</h3>
        {renderIcon()}
      </div>
      <div className="stats-card-content">
        <div className="stats-card-main">
          <span className="stats-card-value">{value}</span>
          {trend && (
            <span className={`stats-card-trend ${getTrendClass()}`}>
              {getTrendIcon()}
              {trend}
            </span>
          )}
        </div>
        {description && (
          <p className="stats-card-description">{description}</p>
        )}
      </div>
    </div>
  );
});

// Definir displayName conforme solicitado no guia de padronização
StatsCard.displayName = 'StatsCard';

export { StatsCard };