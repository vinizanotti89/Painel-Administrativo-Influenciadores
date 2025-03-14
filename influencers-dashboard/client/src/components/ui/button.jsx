import React from "react";
import '@/styles/components/ui/Button.css';

/**
 * Componente de botão customizável com diversas variantes e tamanhos
 * 
 * @param {Object} props Propriedades do componente
 * @param {string} props.className Classes adicionais para o componente
 * @param {string} props.variant Variante do botão ("primary" | "secondary" | "danger")
 * @param {string} props.size Tamanho do botão ("small" | "medium" | "large")
 * @param {React.Ref} ref Referência para o elemento do botão
 */
const Button = React.forwardRef(({
  className = '',
  variant = "primary",
  size = "medium",
  ...props
}, ref) => {
  return (
    <button
      ref={ref}
      className={`button button-${variant} button-${size} ${className}`}
      {...props}
    />
  );
});

/**
 * Componente para agrupar botões com espaçamento consistente
 * 
 * @param {Object} props Propriedades do componente
 * @param {string} props.className Classes adicionais para o componente
 * @param {React.Ref} ref Referência para o elemento do grupo
 */
const ButtonGroup = React.forwardRef(({
  className = '',
  ...props
}, ref) => {
  return (
    <div
      className={`button-group ${className}`}
      ref={ref}
      {...props}
    />
  );
});

Button.displayName = "Button";
ButtonGroup.displayName = "ButtonGroup";

export { Button, ButtonGroup };