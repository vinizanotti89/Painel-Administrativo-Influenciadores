import * as React from "react"
import '@/styles/components/ui/Card.css';

/**
 * Componente Card principal que serve como container para conteúdo em formato de cartão
 * 
 * @param {Object} props Propriedades do componente
 * @param {string} props.className Classes adicionais para o componente
 * @param {React.Ref} ref Referência para o elemento do cartão
 */
const Card = React.forwardRef(({ className = '', ...props }, ref) => (
  <div
    ref={ref}
    className={`card ${className}`}
    {...props}
  />
))

/**
 * Componente de cabeçalho do Card para título e informações principais
 * 
 * @param {Object} props Propriedades do componente
 * @param {string} props.className Classes adicionais para o componente
 * @param {React.Ref} ref Referência para o elemento do cabeçalho
 */
const CardHeader = React.forwardRef(({ className = '', ...props }, ref) => (
  <div
    ref={ref}
    className={`card-header ${className}`}
    {...props}
  />
))

/**
 * Componente de conteúdo do Card para o corpo principal
 * 
 * @param {Object} props Propriedades do componente
 * @param {string} props.className Classes adicionais para o componente
 * @param {React.Ref} ref Referência para o elemento de conteúdo
 */
const CardContent = React.forwardRef(({ className = '', ...props }, ref) => (
  <div
    ref={ref}
    className={`card-content ${className}`}
    {...props}
  />
))

/**
 * Componente de título do Card com estilo pré-definido
 * 
 * @param {Object} props Propriedades do componente
 * @param {string} props.className Classes adicionais para o componente
 * @param {React.Ref} ref Referência para o elemento de título
 */
const CardTitle = React.forwardRef(({ className = '', ...props }, ref) => (
  <h3
    ref={ref}
    className={`card-title ${className}`}
    {...props}
  />
))

Card.displayName = "Card"
CardHeader.displayName = "CardHeader"
CardContent.displayName = "CardContent"
CardTitle.displayName = "CardTitle"

export { Card, CardHeader, CardContent, CardTitle }