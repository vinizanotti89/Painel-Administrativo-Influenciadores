import React, { useState, useCallback } from 'react';
import { debounce } from 'lodash';
import useAsyncState from '@/hooks/useAsyncState';
import '@/styles/components/ui/SearchBar.css';

/**
 * Componente de barra de pesquisa com suporte para busca em tempo real
 * com controle de debounce ou busca sob demanda
 * 
 * @param {Object} props Propriedades do componente
 * @param {string} props.placeholder Texto de placeholder para o input
 * @param {string} props.className Classes adicionais para o componente
 * @param {Function} props.onSearch Função chamada quando a busca é realizada
 * @param {boolean} props.realtime Se verdadeiro, busca em tempo real com debounce
 * @param {number} props.debounceTime Tempo de debounce em ms para busca em tempo real
 * @param {boolean} props.compact Se verdadeiro, usa o layout compacto sem botão visível
 * @param {number} props.maxWidth Largura máxima do campo de busca (opcional)
 */
const SearchBar = ({
  placeholder = 'Buscar influenciadores...',
  className = '',
  onSearch,
  realtime = false,
  debounceTime = 500,
  compact = false,
  maxWidth = '300px'
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { loading: isSearching, execute } = useAsyncState();

  // Função de busca com debounce para evitar excesso de requisições
  const debouncedSearch = useCallback(
    debounce((value) => {
      if (onSearch) {
        execute(() => onSearch(value));
      }
    }, debounceTime),
    [onSearch, debounceTime, execute]
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch && !realtime) {
      execute(() => onSearch(searchTerm));
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    // Se estiver no modo de busca em tempo real, aciona o debounce
    if (realtime && onSearch) {
      debouncedSearch(value);
    }
  };

  const handleKeyDown = (e) => {
    // Aciona a busca ao pressionar Enter
    if (e.key === 'Enter' && onSearch && !realtime) {
      e.preventDefault();
      execute(() => onSearch(searchTerm));
    }
  };

  const containerStyle = maxWidth ? { maxWidth } : {};

  return (
    <form
      onSubmit={handleSubmit}
      className={`search-form ${className}`}
      style={containerStyle}
    >
      <div className={`search-container ${compact ? 'search-container-compact' : ''}`}>
        <input
          type="text"
          value={searchTerm}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          className="search-input"
          placeholder={placeholder}
          disabled={isSearching}
        />
        {!compact && (
          <button
            type="submit"
            className={`search-button ${isSearching ? 'search-button-loading' : ''}`}
            disabled={isSearching || !searchTerm.trim()}
          >
            {isSearching ? (
              <span className="search-button-loading-indicator" />
            ) : (
              <svg
                className="search-icon"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            )}
            <span className="search-button-text">Buscar</span>
          </button>
        )}
        {compact && (
          <span className="search-icon-compact">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </span>
        )}
      </div>
    </form>
  );
};

export { SearchBar };