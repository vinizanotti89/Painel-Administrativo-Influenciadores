import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import '@/styles/components/ui/Tabs.css';

/**
 * Componente raiz das abas.
 * Fornece contexto para o sistema de abas e gerencia o estado ativo.
 * 
 * @param {Object} props - Propriedades do componente
 * @param {string} [props.defaultValue] - Valor da aba ativa por padrão
 * @param {string} [props.value] - Valor da aba ativa (controlado)
 * @param {Function} [props.onValueChange] - Função chamada quando a aba ativa muda
 * @param {boolean} [props.orientation="horizontal"] - Orientação das abas ("horizontal" ou "vertical")
 * @param {React.ReactNode} props.children - Componentes filhos
 * @returns {JSX.Element} Componente raiz de abas
 */
const Tabs = React.forwardRef(({ className = '', ...props }, ref) => (
  <TabsPrimitive.Root
    ref={ref}
    className={`tabs-root ${className}`}
    {...props}
  />
));
Tabs.displayName = "Tabs";

/**
 * Contêiner para os gatilhos das abas.
 * 
 * @param {Object} props - Propriedades do componente
 * @param {string} [props.className] - Classes CSS adicionais
 * @param {"horizontal"|"vertical"} [props.orientation="horizontal"] - Orientação da lista de abas
 * @param {React.ReactNode} props.children - Componentes filhos
 * @returns {JSX.Element} Componente de lista de abas renderizado
 */
const TabsList = React.forwardRef(({ className = '', orientation = "horizontal", ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={`tabs-list ${orientation === "vertical" ? "tabs-list-vertical" : ""} ${className}`}
    {...props}
  />
));
TabsList.displayName = "TabsList";

/**
 * Gatilho que alterna para a aba correspondente quando clicado.
 * 
 * @param {Object} props - Propriedades do componente
 * @param {string} props.value - Valor único que identifica a aba
 * @param {string} [props.className] - Classes CSS adicionais
 * @param {boolean} [props.disabled] - Se o gatilho está desabilitado
 * @param {React.ReactNode} props.children - Conteúdo do gatilho
 * @returns {JSX.Element} Componente gatilho de aba renderizado
 */
const TabsTrigger = React.forwardRef(({ className = '', ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={`tabs-trigger ${className}`}
    {...props}
  />
));
TabsTrigger.displayName = "TabsTrigger";

/**
 * Conteúdo da aba que é exibido quando a aba correspondente está ativa.
 * 
 * @param {Object} props - Propriedades do componente
 * @param {string} props.value - Valor que corresponde ao gatilho da aba
 * @param {string} [props.className] - Classes CSS adicionais
 * @param {boolean} [props.forceMount] - Força a montagem do conteúdo mesmo quando inativo
 * @param {React.ReactNode} props.children - Conteúdo da aba
 * @returns {JSX.Element} Componente de conteúdo da aba renderizado
 */
const TabsContent = React.forwardRef(({ className = '', ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={`tabs-content ${className}`}
    {...props}
  />
));
TabsContent.displayName = "TabsContent";

export { Tabs, TabsList, TabsTrigger, TabsContent };