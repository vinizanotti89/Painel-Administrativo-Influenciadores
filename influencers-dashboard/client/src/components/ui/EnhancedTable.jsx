import React, { useState, useEffect } from "react";
import useAsyncState from '@/hooks/useAsyncState';
import { errorService } from '@/lib/errorMessages';
import '@/styles/components/ui/EnhancedTable.css';

/**
 * Componente de tabela aprimorado com suporte para estados de carregamento,
 * paginação, ordenação e exibição de mensagens de erro.
 */
const EnhancedTable = React.forwardRef(({
    className = '',
    fetchData = null, // Nova prop para função de busca de dados
    initialData = [],
    columns = [],
    emptyMessage = 'Nenhum dado encontrado',
    loadingMessage = 'Carregando dados...',
    sortable = false,
    sortColumn = null,
    sortDirection = 'asc',
    onSort = null,
    ...props
}, ref) => {
    const { data, loading, error, execute } = useAsyncState(initialData);

    // Efeito para carregar dados quando o componente for montado se fetchData for fornecido
    useEffect(() => {
        if (fetchData) {
            execute(fetchData);
        }
    }, [fetchData, execute]);

    return (
        <div className="table-container">
            <table
                ref={ref}
                className={`table ${className || ''}`}
                {...props}
            />
        </div>
    );
});

const TableHeader = React.forwardRef(({ className = '', ...props }, ref) => (
    <thead ref={ref} className={`table-header ${className || ''}`} {...props} />
));

const TableBody = React.forwardRef(({
    className = '',
    loading = false,
    error = null,
    emptyMessage = 'Nenhum dado encontrado',
    loadingMessage = 'Carregando dados...',
    colSpan = 1,
    children,
    onRetry = null,
    ...props
}, ref) => (
    <tbody ref={ref} className={`table-body ${className || ''}`} {...props}>
        {loading ? (
            <tr className="table-loading-row">
                <td colSpan={colSpan} className="table-loading-cell">
                    <div className="table-loading-indicator">
                        <div className="table-loading-spinner"></div>
                        <p className="table-loading-text">{loadingMessage}</p>
                    </div>
                </td>
            </tr>
        ) : error ? (
            <tr className="table-error-row">
                <td colSpan={colSpan} className="table-error-cell">
                    <div className="table-error-message">
                        <svg className="table-error-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" y1="8" x2="12" y2="12" />
                            <line x1="12" y1="16" x2="12.01" y2="16" />
                        </svg>
                        <p>{errorService.normalizeError(error).message}</p>
                        {onRetry && (
                            <button
                                onClick={onRetry}
                                className="table-error-retry-button"
                            >
                                Tentar novamente
                            </button>
                        )}
                    </div>
                </td>
            </tr>
        ) : children.length === 0 ? (
            <tr className="table-empty-row">
                <td colSpan={colSpan} className="table-empty-cell">
                    <p className="table-empty-message">{emptyMessage}</p>
                </td>
            </tr>
        ) : (
            children
        )}
    </tbody>
));

const TableFooter = React.forwardRef(({ className = '', ...props }, ref) => (
    <tfoot ref={ref} className={`table-footer ${className || ''}`} {...props} />
));

const TableRow = React.forwardRef(({
    className = '',
    clickable = false,
    onClick = null,
    ...props
}, ref) => (
    <tr
        ref={ref}
        className={`table-row ${clickable ? 'table-row-clickable' : ''} ${className || ''}`}
        onClick={clickable && onClick ? onClick : undefined}
        {...props}
    />
));

const TableHead = React.forwardRef(({
    className = '',
    sortable = false,
    sorted = false,
    sortDirection = null,
    onSort = null,
    ...props
}, ref) => (
    <th
        ref={ref}
        className={`table-head ${sortable ? 'table-head-sortable' : ''} ${sorted ? `table-head-sorted table-head-sorted-${sortDirection}` : ''} ${className || ''}`}
        onClick={sortable && onSort ? onSort : undefined}
        {...props}
    >
        <div className="table-head-content">
            {props.children}
            {sortable && (
                <span className="table-sort-icon">
                    {sorted && sortDirection === 'asc' ? '↑' : (sorted && sortDirection === 'desc' ? '↓' : '↕')}
                </span>
            )}
        </div>
    </th>
));

const TableCell = React.forwardRef(({ className = '', ...props }, ref) => (
    <td ref={ref} className={`table-cell ${className || ''}`} {...props} />
));

const TableCaption = React.forwardRef(({ className = '', ...props }, ref) => (
    <caption ref={ref} className={`table-caption ${className || ''}`} {...props} />
));

// Componente de paginação para a tabela com integração ao estado assíncrono
const TablePagination = React.forwardRef(({
    className = '',
    currentPage = 1,
    totalPages = 1,
    onPageChange = () => { },
    loading = false,
    ...props
}, ref) => (
    <div ref={ref} className={`table-pagination ${className || ''}`} {...props}>
        <button
            className="table-pagination-button"
            onClick={() => onPageChange(1)}
            disabled={loading || currentPage === 1}
        >
            {"<<"}
        </button>
        <button
            className="table-pagination-button"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={loading || currentPage === 1}
        >
            {"<"}
        </button>

        <span className="table-pagination-info">
            Página {currentPage} de {totalPages}
        </span>

        <button
            className="table-pagination-button"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={loading || currentPage === totalPages}
        >
            {">"}
        </button>
        <button
            className="table-pagination-button"
            onClick={() => onPageChange(totalPages)}
            disabled={loading || currentPage === totalPages}
        >
            {">>"}
        </button>
    </div>
));

// Componente de tabela com suporte ao estado assíncrono
const AsyncTable = ({
    fetchData,
    initialData = [],
    columns = [],
    renderRow,
    onRowClick = null,
    emptyMessage = 'Nenhum dado encontrado',
    className = '',
    ...props
}) => {
    const { data, loading, error, execute } = useAsyncState(initialData);

    // Carrega os dados iniciais ao montar o componente
    useEffect(() => {
        if (fetchData) {
            execute(fetchData);
        }
    }, [fetchData, execute]);

    // Função para tentar novamente em caso de erro
    const handleRetry = () => {
        if (fetchData) {
            execute(fetchData);
        }
    };

    return (
        <EnhancedTable className={className} {...props}>
            <TableHeader>
                <tr>
                    {columns.map((column, index) => (
                        <TableHead key={index} {...column.headerProps}>
                            {column.header}
                        </TableHead>
                    ))}
                </tr>
            </TableHeader>
            <TableBody
                loading={loading}
                error={error}
                emptyMessage={emptyMessage}
                onRetry={handleRetry}
                colSpan={columns.length}
            >
                {data && data.map((item, index) => (
                    <TableRow
                        key={index}
                        clickable={Boolean(onRowClick)}
                        onClick={onRowClick ? () => onRowClick(item) : undefined}
                    >
                        {renderRow(item)}
                    </TableRow>
                ))}
            </TableBody>
        </EnhancedTable>
    );
};

EnhancedTable.displayName = "EnhancedTable";
TableHeader.displayName = "TableHeader";
TableBody.displayName = "TableBody";
TableFooter.displayName = "TableFooter";
TableHead.displayName = "TableHead";
TableRow.displayName = "TableRow";
TableCell.displayName = "TableCell";
TableCaption.displayName = "TableCaption";
TablePagination.displayName = "TablePagination";
AsyncTable.displayName = "AsyncTable";

export {
    EnhancedTable as Table,
    TableHeader,
    TableBody,
    TableFooter,
    TableHead,
    TableRow,
    TableCell,
    TableCaption,
    TablePagination,
    AsyncTable,
};