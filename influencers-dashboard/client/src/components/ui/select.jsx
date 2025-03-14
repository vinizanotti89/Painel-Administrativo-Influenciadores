import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown } from "lucide-react";
import '@/styles/components/ui/Select.css';

/**
 * Componente raiz do Select
 * Gerencia o estado e contexto de seleção
 */
const Select = SelectPrimitive.Root;

/**
 * Agrupa itens relacionados no Select
 */
const SelectGroup = SelectPrimitive.Group;

/**
 * Exibe o valor selecionado
 */
const SelectValue = SelectPrimitive.Value;

/**
 * Botão de acionamento do Select
 * 
 * @param {Object} props Propriedades do componente
 * @param {string} props.className Classes adicionais para o componente
 * @param {React.ReactNode} props.children Conteúdo do trigger
 * @param {React.Ref} ref Referência para o elemento do trigger
 */
const SelectTrigger = React.forwardRef(({
  className = '',
  children,
  ...props
}, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={`select-trigger ${className}`}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="select-icon" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
));

/**
 * Container de conteúdo do Select
 * 
 * @param {Object} props Propriedades do componente
 * @param {string} props.className Classes adicionais para o componente
 * @param {React.ReactNode} props.children Conteúdo do select
 * @param {string} props.position Posição do popover ("popper" | "item-aligned")
 * @param {React.Ref} ref Referência para o elemento do conteúdo
 */
const SelectContent = React.forwardRef(({
  className = '',
  children,
  position = "popper",
  ...props
}, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={`select-content ${position === "popper" ? 'select-content-popper' : ''} ${className}`}
      position={position}
      {...props}
    >
      <SelectPrimitive.Viewport className="select-viewport">
        {children}
      </SelectPrimitive.Viewport>
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
));

/**
 * Rótulo para grupos de itens no Select
 * 
 * @param {Object} props Propriedades do componente
 * @param {string} props.className Classes adicionais para o componente
 * @param {React.Ref} ref Referência para o elemento do label
 */
const SelectLabel = React.forwardRef(({
  className = '',
  ...props
}, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={`select-label ${className}`}
    {...props}
  />
));

/**
 * Item selecionável no dropdown
 * 
 * @param {Object} props Propriedades do componente
 * @param {string} props.className Classes adicionais para o componente
 * @param {React.ReactNode} props.children Texto do item
 * @param {React.Ref} ref Referência para o elemento do item
 */
const SelectItem = React.forwardRef(({
  className = '',
  children,
  ...props
}, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={`select-item ${className}`}
    {...props}
  >
    <span className="select-item-indicator">
      <SelectPrimitive.ItemIndicator>
        <Check className="select-item-check" />
      </SelectPrimitive.ItemIndicator>
    </span>
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
));

/**
 * Separador visual entre itens ou grupos
 * 
 * @param {Object} props Propriedades do componente
 * @param {string} props.className Classes adicionais para o componente
 * @param {React.Ref} ref Referência para o elemento do separador
 */
const SelectSeparator = React.forwardRef(({
  className = '',
  ...props
}, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={`select-separator ${className}`}
    {...props}
  />
));

// Configurar displayName para cada componente
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;
SelectContent.displayName = SelectPrimitive.Content.displayName;
SelectLabel.displayName = SelectPrimitive.Label.displayName;
SelectItem.displayName = SelectPrimitive.Item.displayName;
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;

// Exportar componentes individuais e um objeto com todos os componentes para facilitar importação
const SelectComponents = {
  Root: Select,
  Group: SelectGroup,
  Value: SelectValue,
  Trigger: SelectTrigger,
  Content: SelectContent,
  Label: SelectLabel,
  Item: SelectItem,
  Separator: SelectSeparator
};

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectComponents
};