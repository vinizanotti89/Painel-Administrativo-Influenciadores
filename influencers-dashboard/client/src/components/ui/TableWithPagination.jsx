import React, { useState, useEffect } from "react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "./table";
import TablePagination from "./TablePagination";
import { errorService } from "@/lib/errorMessages";
import useAsyncState from '@/hooks/useAsyncState';
import useTranslation from '@/hooks/useTranslation';
import '@/styles/components/ui/TablePagination.scss';

/**
 * Componente de tabela com paginação que integra o gerenciamento de
 * estados assíncronos e tratamento padronizado de erros
 * 
 * @param {Object} props - Propriedades do componente
 * @param {Array} props.data - Dados iniciais para a tabela
 * @param {Array} props.columns - Definição das colunas da tabela
 * @param {Function} props.fetchData - Função para buscar dados do servidor
 * @param {number} props.itemsPerPage - Itens por página
 * @param {number} props.initialPage - Página inicial
 * @param {number} props.totalItems - Total de itens (para paginação do lado do servidor)
 * @param {boolean} props.loading - Estado de carregamento controlado externamente
 * @param {Object} props.error - Estado de erro controlado externamente
 * @param {string} props.className - Classes CSS adicionais
 * @param {string} props.emptyMessage - Mensagem para exibir quando não há dados
 * @param {Function} props.onRowClick - Função chamada ao clicar em uma linha
 * @param {boolean} props.sortable - Se a tabela suporta ordenação
 * @param {string} props.defaultSortColumn - Coluna padrão para ordenação
 * @param {string} props.defaultSortDirection - Direção padrão para ordenação
 */
const TableWithPagination = ({
    data = [],
    columns = [],
    fetchData = null,
    itemsPerPage = 10,
    initialPage = 1,
    totalItems = null,
    loading: externalLoading = false,
    error: externalError = null,
    className = '',
    emptyMessage,
    onRowClick = null,
    sortable = false,
    defaultSortColumn = null,
    defaultSortDirection = 'asc',
}) => {
    const { translate } = useTranslation();

    // Estado de paginação e ordenação
    const [currentPage, setCurrentPage] = useState(initialPage);
    const [sortColumn, setSortColumn] = useState(defaultSortColumn);
    const [sortDirection, setSortDirection] = useState(defaultSortDirection);

    // Usando o hook useAsyncState para gerenciar estados da tabela
    const {
        data: tableData,
        loading: asyncLoading,
        error: asyncError,
        execute,
        clearError,
        setData: setTableData
    } = useAsyncState(fetchData, { initialData: data });

    // Combina loading e error externos com os estados assíncronos internos
    const isLoading = externalLoading || asyncLoading;
    const error = externalError || asyncError;

    // Mensagem quando não há dados
    const defaultEmptyMessage = translate('table.noData') || 'Nenhum dado encontrado';
    const emptyMessageText = emptyMessage || defaultEmptyMessage;

    // Calcula o número total de itens e páginas
    const effectiveTotalItems = totalItems !== null ? totalItems : (tableData?.length || 0);
    const totalPages = Math.max(1, Math.ceil(effectiveTotalItems / itemsPerPage));

    // Calcula os itens a serem exibidos na página atual
    const displayItems = () => {
        // Se não há dados, retorna array vazio
        if (!tableData || tableData.length === 0) {
            return [];
        }

        // Se temos fetchData, assumimos que a paginação é controlada externamente
        if (fetchData) {
            return tableData;
        }

        // Caso contrário, fazemos a paginação no cliente
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = Math.min(startIndex + itemsPerPage, tableData.length);
        return tableData.slice(startIndex, endIndex);
    };

    // Função para lidar com a mudança de página
    const handlePageChange = async (page) => {
        if (page === currentPage) return;

        setCurrentPage(page);

        // Se temos uma função fetchData, executamos para obter dados da nova página
        if (fetchData) {
            try {
                await execute(() =>
                    fetchData({ page, itemsPerPage, sortColumn, sortDirection })
                );
            } catch (err) {
                // O erro já é tratado pelo hook useAsyncState
                console.error("Erro ao buscar dados para a página", page, err);
            }
        }
    };

    // Função para lidar com a ordenação de colunas
    const handleSort = async (column) => {
        if (!sortable) return;

        // Determina a nova direção de ordenação
        const newDirection =
            column === sortColumn
                ? sortDirection === 'asc' ? 'desc' : 'asc'
                : 'asc';

        setSortColumn(column);
        setSortDirection(newDirection);

        // Se temos fetchData, buscamos dados com a nova ordenação
        if (fetchData) {
            try {
                await execute(() =>
                    fetchData({
                        page: currentPage,
                        itemsPerPage,
                        sortColumn: column,
                        sortDirection: newDirection
                    })
                );
            } catch (err) {
                console.error("Erro ao ordenar dados", err);
            }
        } else if (tableData && tableData.length > 0) {
            // Ordenação local se não temos fetchData
            const sortedData = [...tableData].sort((a, b) => {
                const valueA = a[column];
                const valueB = b[column];

                // Tratamento para valores nulos ou indefinidos
                if (valueA === null || valueA === undefined) return newDirection === 'asc' ? -1 : 1;
                if (valueB === null || valueB === undefined) return newDirection === 'asc' ? 1 : -1;

                // Comparação baseada no tipo dos valores
                if (typeof valueA === 'string' && typeof valueB === 'string') {
                    return newDirection === 'asc'
                        ? valueA.localeCompare(valueB)
                        : valueB.localeCompare(valueA);
                }

                if (valueA < valueB) return newDirection === 'asc' ? -1 : 1;
                if (valueA > valueB) return newDirection === 'asc' ? 1 : -1;
                return 0;
            });

            // Atualiza os dados da tabela com os dados ordenados
            setTableData(sortedData);
        }
    };

    // Efeito para buscar dados quando componente monta ou parâmetros mudam
    useEffect(() => {
        if (fetchData) {
            execute(() =>
                fetchData({
                    page: currentPage,
                    itemsPerPage,
                    sortColumn,
                    sortDirection
                })
            );
        }
    }, [currentPage, itemsPerPage, sortColumn, sortDirection, fetchData, execute]);

    // Tentativa de nova requisição em caso de erro
    const handleRetry = () => {
        clearError();
        if (fetchData) {
            execute(() =>
                fetchData({
                    page: currentPage,
                    itemsPerPage,
                    sortColumn,
                    sortDirection
                })
            );
        }
    };

    // Renderização dos itens atuais
    const currentItems = displayItems();

    // Processamento do erro para exibição
    const processedError = error ? errorService.normalizeError(error) : null;
    const errorMessage = processedError?.message || (typeof processedError === 'string' ? processedError : null);

    return (
        <div className={`table-with-pagination ${className}`}>
            <Table
                isLoading={isLoading}
                error={errorMessage}
                onRetry={handleRetry}
            >
                <TableHeader>
                    <TableRow>
                        {columns.map((column) => (
                            <TableHead
                                key={column.key}
                                className={`${sortable && column.sortable ? 'sortable-column' : ''} ${sortColumn === column.key ? `sorted-${sortDirection}` : ''
                                    }`}
                                onClick={sortable && column.sortable ? () => handleSort(column.key) : undefined}
                            >
                                <div className="column-header">
                                    {column.header}
                                    {sortable && column.sortable && (
                                        <span className="sort-indicator">
                                            {sortColumn === column.key ? (
                                                sortDirection === 'asc' ? ' ▲' : ' ▼'
                                            ) : ' ⇅'}
                                        </span>
                                    )}
                                </div>
                            </TableHead>
                        ))}
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {currentItems.length > 0 ? (
                        currentItems.map((item, index) => (
                            <TableRow
                                key={item.id || `row-${index}`}
                                className={onRowClick ? 'clickable-row' : ''}
                                onClick={onRowClick ? () => onRowClick(item) : undefined}
                            >
                                {columns.map((column) => (
                                    <TableCell key={`${index}-${column.key}`}>
                                        {column.render ? column.render(item) : item[column.key]}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : !isLoading && !error ? (
                        <TableRow>
                            <TableCell colSpan={columns.length} className="empty-table-message">
                                {emptyMessageText}
                            </TableCell>
                        </TableRow>
                    ) : null}
                </TableBody>
            </Table>

            {!isLoading && !error && totalPages > 1 && (
                <TablePagination
                    currentPage={currentPage}
                    totalItems={effectiveTotalItems}
                    itemsPerPage={itemsPerPage}
                    onPageChange={handlePageChange}
                    disabled={isLoading}
                />
            )}
        </div>
    );
};

export default TableWithPagination;