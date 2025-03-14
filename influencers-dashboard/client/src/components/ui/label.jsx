import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import '@/styles/components/ui/Label.css';

/**
 * Componente Label baseado no Radix UI para campos de formulário
 * com suporte para estados de obrigatório e desabilitado
 * 
 * @param {Object} props Propriedades do componente
 * @param {string} props.className Classes adicionais para o componente
 * @param {boolean} props.required Indica se o campo associado é obrigatório
 * @param {boolean} props.disabled Indica se o campo associado está desabilitado
 * @param {React.Ref} ref Referência para o elemento do label
 */
const Label = React.forwardRef(({
  className = '',
  required = false,
  disabled = false,
  ...props
}, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={`label ${required ? 'required' : ''} ${disabled ? 'disabled' : ''} ${className}`}
    {...props}
  />
));

Label.displayName = LabelPrimitive.Root.displayName;

export { Label };