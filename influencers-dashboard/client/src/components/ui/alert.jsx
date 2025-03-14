import * as React from "react";
import '@/styles/components/ui/Alert.css';

/**
 * Componente de alerta para exibir mensagens importantes ao usuário
 * 
 * @param {Object} props Propriedades do componente
 * @param {string} props.className Classes adicionais para o componente
 * @param {string} props.variant Variante do alerta ('default', 'destructive', 'success', 'warning')
 * @returns {JSX.Element} Componente Alert
 */
const Alert = React.forwardRef(({ className = '', variant = 'default', ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={`alert alert-${variant} ${className}`}
    {...props}
  />
));

/**
 * Componente para exibir o título do alerta
 * 
 * @param {Object} props Propriedades do componente
 * @param {string} props.className Classes adicionais para o componente
 * @returns {JSX.Element} Componente AlertTitle
 */
const AlertTitle = React.forwardRef(({ className = '', ...props }, ref) => (
  <h5
    ref={ref}
    className={`alert-title ${className}`}
    {...props}
  />
));

/**
 * Componente para exibir a descrição do alerta
 * 
 * @param {Object} props Propriedades do componente
 * @param {string} props.className Classes adicionais para o componente
 * @returns {JSX.Element} Componente AlertDescription
 */
const AlertDescription = React.forwardRef(({ className = '', ...props }, ref) => (
  <div
    ref={ref}
    className={`alert-description ${className}`}
    {...props}
  />
));

Alert.displayName = "Alert";
AlertTitle.displayName = "AlertTitle";
AlertDescription.displayName = "AlertDescription";

// Aplicar memo para otimização de performance
const MemoizedAlert = React.memo(Alert);
const MemoizedAlertTitle = React.memo(AlertTitle);
const MemoizedAlertDescription = React.memo(AlertDescription);

export {
  MemoizedAlert as Alert,
  MemoizedAlertTitle as AlertTitle,
  MemoizedAlertDescription as AlertDescription
};