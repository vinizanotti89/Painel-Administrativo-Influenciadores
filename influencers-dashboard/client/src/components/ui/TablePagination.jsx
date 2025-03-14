import React from "react";
import useTranslation from '@/hooks/useTranslation';
import '@/styles/components/ui/TablePagination.css';

/**
 * Componente de paginação para tabelas
 * 
 * @param {Object} props - Propriedades do componente
 * @param {number} props.totalItems - Total de itens a serem paginados
 * @param {number} props.itemsPerPage - Número de itens por página
 * @param {number} props.currentPage - Página atual
 * @param {Function} props.onPageChange - Função chamada quando a página é alterada
 * @param {string} props.className - Classes adicionais
 */
const TablePagination = React.forwardRef(({
    totalItems = 0,
    itemsPerPage = 10,
    currentPage = 1,
    onPageChange,
    className = '',
    ...props
}, ref) => {
    const { translate } = useTranslation();
    const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

    // Garantir que a página atual esteja dentro dos limites
    const validCurrentPage = Math.min(Math.max(1, currentPage), totalPages);

    // Gerar array de páginas a serem exibidas
    const getPageNumbers = () => {
        const pages = [];
        const maxPagesToShow = 5;

        if (totalPages <= maxPagesToShow) {
            // Mostrar todas as páginas se forem poucas
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Lógica para mostrar páginas específicas
            let startPage = Math.max(1, validCurrentPage - 2);
            let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

            // Ajustar se estiver no final
            if (endPage === totalPages) {
                startPage = Math.max(1, endPage - maxPagesToShow + 1);
            }

            // Adicionar primeira página
            if (startPage > 1) {
                pages.push(1);
                if (startPage > 2) pages.push('...');
            }

            // Adicionar páginas intermediárias
            for (let i = startPage; i <= endPage; i++) {
                pages.push(i);
            }

            // Adicionar última página
            if (endPage < totalPages) {
                if (endPage < totalPages - 1) pages.push('...');
                pages.push(totalPages);
            }
        }

        return pages;
    };

    // Computar informações sobre os itens exibidos
    const firstItemIndex = Math.min((validCurrentPage - 1) * itemsPerPage + 1, totalItems);
    const lastItemIndex = Math.min(validCurrentPage * itemsPerPage, totalItems);

    // Manipuladores de eventos
    const handlePageChange = (page) => {
        if (typeof onPageChange === 'function' && page !== validCurrentPage) {
            onPageChange(page);
        }
    };

    const handlePrevious = () => {
        handlePageChange(Math.max(1, validCurrentPage - 1));
    };

    const handleNext = () => {
        handlePageChange(Math.min(totalPages, validCurrentPage + 1));
    };

    return (
        <div ref={ref} className={`table-pagination ${className}`} {...props}>
            <div className="table-pagination-info">
                {translate('table.pagination.showing', {
                    first: firstItemIndex,
                    last: lastItemIndex,
                    total: totalItems
                }) || `Mostrando ${firstItemIndex} a ${lastItemIndex} de ${totalItems} resultados`}
            </div>

            <div className="table-pagination-controls">
                <button
                    onClick={handlePrevious}
                    disabled={validCurrentPage === 1}
                    className="table-pagination-button"
                    aria-label={translate('table.pagination.previous') || "Página anterior"}
                >
                    {translate('table.pagination.previous') || "Anterior"}
                </button>

                {getPageNumbers().map((page, index) => (
                    <button
                        key={index}
                        onClick={() => typeof page === 'number' ? handlePageChange(page) : null}
                        className={`table-pagination-button ${page === validCurrentPage
                            ? 'table-pagination-button-active'
                            : typeof page === 'number'
                                ? ''
                                : 'table-pagination-button-disabled'
                            }`}
                        disabled={typeof page !== 'number'}
                        aria-current={page === validCurrentPage ? 'page' : undefined}
                        aria-label={typeof page === 'number'
                            ? `${translate('table.pagination.page') || 'Página'} ${page}`
                            : undefined}
                    >
                        {page}
                    </button>
                ))}

                <button
                    onClick={handleNext}
                    disabled={validCurrentPage === totalPages}
                    className="table-pagination-button"
                    aria-label={translate('table.pagination.next') || "Próxima página"}
                >
                    {translate('table.pagination.next') || "Próxima"}
                </button>
            </div>
        </div>
    );
});

TablePagination.displayName = "TablePagination";

export default TablePagination;