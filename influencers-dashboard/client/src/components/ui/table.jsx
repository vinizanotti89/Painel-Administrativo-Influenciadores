import React, { useState, useEffect } from "react";
import '@/styles/components/ui/Table.css';

/**
 * Componente Spinner para indicar carregamento
 * @param {string} className - Classes CSS adicionais
 */
const Spinner = ({ className = "" }) => (
  <div className={`spinner ${className}`}>
    <div className="spinner-icon"></div>
  </div>
);

/**
 * Componente de tabela com suporte a estados de carregamento e erro
 */
const Table = React.forwardRef(({
  className = "",
  data,
  fetchData,
  isLoading,
  error,
  onRetry,
  loadingComponent,
  errorComponent,
  ...props
}, ref) => {
  // Estado interno se não for controlado externamente
  const [internalLoading, setInternalLoading] = useState(false);
  const [internalData, setInternalData] = useState([]);
  const [internalError, setInternalError] = useState(null);

  // Determine se usamos estado controlado ou interno
  const loading = isLoading !== undefined ? isLoading : internalLoading;
  const tableError = error !== undefined ? error : internalError;

  useEffect(() => {
    // Se fetchData for fornecido e não estamos usando loading controlado externamente
    if (fetchData && isLoading === undefined) {
      const loadData = async () => {
        setInternalLoading(true);
        setInternalError(null);
        try {
          const result = await fetchData();
          setInternalData(result);
        } catch (err) {
          setInternalError(err.message || 'Erro ao carregar dados');
        } finally {
          setInternalLoading(false);
        }
      };

      loadData();
    }
  }, [fetchData, isLoading]);

  // Renderização de loading
  if (loading) {
    return loadingComponent || (
      <div className="table-loading-container">
        <Spinner />
        <p className="table-loading-text">Carregando dados...</p>
      </div>
    );
  }

  // Renderização de erro
  if (tableError) {
    const handleRetry = () => {
      if (onRetry) {
        onRetry();
      } else if (fetchData && isLoading === undefined) {
        // Tenta novamente se estamos gerenciando internamente
        const loadData = async () => {
          setInternalLoading(true);
          setInternalError(null);
          try {
            const result = await fetchData();
            setInternalData(result);
          } catch (err) {
            setInternalError(err.message || 'Erro ao carregar dados');
          } finally {
            setInternalLoading(false);
          }
        };

        loadData();
      }
    };

    return errorComponent || (
      <div className="table-error-container">
        <p className="table-error-message">Erro ao carregar os dados: {tableError}</p>
        <button
          onClick={handleRetry}
          className="table-retry-button"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  // Renderização normal da tabela
  return (
    <div className="table-container">
      <table
        ref={ref}
        className={`table ${className}`}
        {...props}
      />
    </div>
  );
});

const TableHeader = React.forwardRef(({ className = "", ...props }, ref) => (
  <thead ref={ref} className={`table-header ${className}`} {...props} />
));

const TableBody = React.forwardRef(({ className = "", ...props }, ref) => (
  <tbody ref={ref} className={`table-body ${className}`} {...props} />
));

const TableFooter = React.forwardRef(({ className = "", ...props }, ref) => (
  <tfoot ref={ref} className={`table-footer ${className}`} {...props} />
));

const TableRow = React.forwardRef(({ className = "", ...props }, ref) => (
  <tr ref={ref} className={`table-row ${className}`} {...props} />
));

const TableHead = React.forwardRef(({ className = "", ...props }, ref) => (
  <th ref={ref} className={`table-head ${className}`} {...props} />
));

const TableCell = React.forwardRef(({ className = "", ...props }, ref) => (
  <td ref={ref} className={`table-cell ${className}`} {...props} />
));

const TableCaption = React.forwardRef(({ className = "", ...props }, ref) => (
  <caption ref={ref} className={`table-caption ${className}`} {...props} />
));

// Adiciona nomes de exibição para melhorar depuração
Table.displayName = "Table";
TableHeader.displayName = "TableHeader";
TableBody.displayName = "TableBody";
TableFooter.displayName = "TableFooter";
TableHead.displayName = "TableHead";
TableRow.displayName = "TableRow";
TableCell.displayName = "TableCell";
TableCaption.displayName = "TableCaption";

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
  Spinner
};