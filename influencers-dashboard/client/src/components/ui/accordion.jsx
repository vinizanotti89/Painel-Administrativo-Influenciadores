import * as React from "react"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import '@/styles/components/ui/Accordion.css';

/**
 * Componente Accordion do Radix UI
 * Fornece um componente de acordeão acessível para exibir conteúdo em seções expansíveis
 * 
 * @component
 * @param {Object} props - Propriedades do componente
 * @param {React.ReactNode} props.children - Conteúdo do acordeão
 * @param {string} [props.className=''] - Classes adicionais para estilização
 * @param {string} [props.type='single'] - Tipo de acordeão ('single' ou 'multiple')
 * @param {string} [props.defaultValue] - Valor padrão para o item aberto
 * @param {boolean} [props.collapsible=true] - Se o acordeão pode ser totalmente recolhido
 */
const Accordion = React.forwardRef(({
  className = '',
  type = 'single',
  collapsible = true,
  ...props
}, ref) => (
  <AccordionPrimitive.Root
    ref={ref}
    type={type}
    collapsible={collapsible}
    className={`accordion ${className}`}
    {...props}
  />
))

/**
 * Item individual do Accordion
 * 
 * @component
 * @param {Object} props - Propriedades do componente
 * @param {React.ReactNode} props.children - Conteúdo do item
 * @param {string} [props.className=''] - Classes adicionais para estilização
 * @param {string} [props.value] - Valor único para identificar o item
 */
const AccordionItem = React.forwardRef(({
  className = '',
  ...props
}, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={`accordion-item ${className}`}
    {...props}
  />
))

/**
 * Botão de acionamento que controla um item de acordeão
 * 
 * @component
 * @param {Object} props - Propriedades do componente
 * @param {React.ReactNode} props.children - Conteúdo do gatilho
 * @param {string} [props.className=''] - Classes adicionais para estilização
 * @param {string} [props.variant='default'] - Variante visual do botão ('default', 'minimal')
 */
const AccordionTrigger = React.forwardRef(({
  className = '',
  variant = 'default',
  children,
  ...props
}, ref) => (
  <AccordionPrimitive.Trigger
    ref={ref}
    className={`accordion-trigger accordion-trigger-${variant} ${className}`}
    {...props}
  >
    {children}
    <svg
      className="accordion-icon"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  </AccordionPrimitive.Trigger>
))

/**
 * Conteúdo expansível do item do acordeão
 * 
 * @component
 * @param {Object} props - Propriedades do componente
 * @param {React.ReactNode} props.children - Conteúdo a ser exibido
 * @param {string} [props.className=''] - Classes adicionais para estilização
 * @param {string} [props.forceMount] - Se o conteúdo deve ser sempre montado
 */
const AccordionContent = React.forwardRef(({
  className = '',
  children,
  ...props
}, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className={`accordion-content ${className}`}
    {...props}
  >
    <div className="accordion-content-inner">
      {children}
    </div>
  </AccordionPrimitive.Content>
))

// Definir displayName para cada componente
Accordion.displayName = "Accordion"
AccordionItem.displayName = "AccordionItem"
AccordionTrigger.displayName = "AccordionTrigger"
AccordionContent.displayName = "AccordionContent"

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }