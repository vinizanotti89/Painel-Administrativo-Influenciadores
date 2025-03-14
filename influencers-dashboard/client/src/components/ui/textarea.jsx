import * as React from "react";
import '@/styles/components/ui/Textarea.css';

/**
 * Componente de área de texto multilinhas.
 * Permite entrada de texto mais extensa e formatada em múltiplas linhas.
 * 
 * @param {Object} props - Propriedades do componente
 * @param {string} [props.className] - Classes CSS adicionais
 * @param {string} [props.placeholder] - Texto de placeholder
 * @param {boolean} [props.disabled] - Se o componente está desabilitado
 * @param {boolean} [props.readOnly] - Se o componente é apenas para leitura
 * @param {Function} [props.onChange] - Função chamada quando o valor muda
 * @param {Function} [props.onFocus] - Função chamada quando o elemento recebe foco
 * @param {Function} [props.onBlur] - Função chamada quando o elemento perde foco
 * @param {string} [props.value] - Valor atual do textarea (controlado)
 * @param {string} [props.defaultValue] - Valor inicial (não controlado)
 * @param {string} [props.name] - Nome do campo para formulários
 * @param {number} [props.rows] - Número de linhas visíveis
 * @param {number} [props.maxLength] - Número máximo de caracteres permitidos
 * @param {string} [props.id] - ID do elemento
 * @param {boolean} [props.autoFocus] - Se o componente deve receber foco automaticamente
 * @param {string} [props.ariaLabel] - Rótulo acessível para leitores de tela
 * @param {boolean} [props.error] - Indica estado de erro para estilização
 * @returns {JSX.Element} Componente de área de texto renderizado
 */
const Textarea = React.forwardRef(({
  className = '',
  error = false,
  ariaLabel,
  ...props
}, ref) => {
  // Processamento de props para acessibilidade
  const ariaProps = {};
  if (ariaLabel) {
    ariaProps['aria-label'] = ariaLabel;
  }

  if (error) {
    ariaProps['aria-invalid'] = true;
  }

  return (
    <textarea
      ref={ref}
      className={`textarea ${error ? 'textarea-error' : ''} ${className}`}
      {...ariaProps}
      {...props}
    />
  );
});

Textarea.displayName = "Textarea";

export { Textarea };