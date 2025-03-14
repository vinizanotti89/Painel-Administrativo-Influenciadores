import React from "react";
import '@/styles/components/ui/Badge.css';

/**
 * Componente Badge para exibir etiquetas ou status em toda a aplicação
 * 
 * @param {Object} props Propriedades do componente
 * @param {string} props.className Classes adicionais para o componente
 * @param {string} props.variant Variante visual do badge ('default', 'secondary', 'destructive', 'outline')
 */
const Badge = React.forwardRef(({
  className = '',
  variant = 'default',
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      className={`badge badge-${variant} ${className}`}
      {...props}
    />
  );
});

// Definir displayName conforme os padrões do projeto
Badge.displayName = 'Badge';

export { Badge };