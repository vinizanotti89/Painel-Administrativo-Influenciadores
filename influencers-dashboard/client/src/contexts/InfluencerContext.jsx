import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { fetchInfluencersData } from '@/hooks/influencerApi';
import useApiCall from '@/hooks/useApiCall';
import useInfluencerSearch from '@/hooks/useInfluencerSearch';
import useTranslation from '@/hooks/useTranslation';

const InfluencerContext = createContext();

export function InfluencerProvider({ children }) {
  const [influencers, setInfluencers] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    platform: '',
    page: 1,
    limit: 20
  });
  const { translate } = useTranslation();

  // Usando o hook useInfluencerSearch para gerenciar a busca com paginação
  const {
    results,
    loading: searchLoading,
    error: searchError,
    totalResults,
    hasMore,
    loadMoreResults,
    updateFilters: updateSearchFilters,
    resetFilters
  } = useInfluencerSearch({
    fetchFunction: fetchInfluencersData,
    initialFilters: filters,
    defaultLimit: 20
  });

  // Usando o hook useApiCall para operações específicas que não são de busca
  const {
    loading: apiLoading,
    error: apiError,
    execute: executeApiCall,
    lastError,
    clearLastError
  } = useApiCall(null, {
    showErrorToast: true,
    errorMessage: 'errors.failedToLoadInfluencers',
    platform: filters.platform || 'default'
  });

  // Sincroniza os resultados da busca com o estado local
  useEffect(() => {
    if (results && results.length > 0) {
      // Se estamos na primeira página, substituímos os resultados
      if (filters.page === 1) {
        setInfluencers(results);
      } else {
        // Caso contrário, adicionamos à lista existente
        setInfluencers(prev => {
          // Evita duplicatas ao concatenar resultados
          const existingIds = new Set(prev.map(inf => inf.id));
          const newItems = results.filter(inf => !existingIds.has(inf.id));
          return [...prev, ...newItems];
        });
      }
    }
  }, [results, filters.page]);

  // Atualiza os filtros e opcionalmente busca dados
  const updateFilters = useCallback((newFilters, fetchImmediately = true) => {
    // Define novos filtros
    const updatedFilters = { ...filters, ...newFilters };

    // Atualiza o estado local
    setFilters(updatedFilters);

    // Se o termo de busca, categoria ou plataforma mudaram, volta para a página 1
    if (
      (newFilters.search !== undefined && newFilters.search !== filters.search) ||
      (newFilters.category !== undefined && newFilters.category !== filters.category) ||
      (newFilters.platform !== undefined && newFilters.platform !== filters.platform)
    ) {
      updatedFilters.page = 1;
    }

    // Passa os filtros atualizados para o hook de busca
    if (fetchImmediately) {
      updateSearchFilters(updatedFilters);
    }
  }, [filters, updateSearchFilters]);

  // Limpa todos os filtros e recarrega os dados
  const clearFilters = useCallback(() => {
    resetFilters();
    setFilters({
      search: '',
      category: '',
      platform: '',
      page: 1,
      limit: 20
    });
  }, [resetFilters]);

  // Função para buscar um influenciador específico por ID
  const fetchInfluencerById = useCallback(async (id) => {
    return await executeApiCall(async () => {
      const response = await fetch(`/api/influencers/${id}`);

      if (!response.ok) {
        throw new Error(`Falha ao buscar influenciador com ID ${id}`);
      }

      return await response.json();
    });
  }, [executeApiCall]);

  // Obtém um influenciador do cache local por ID
  const getInfluencerById = useCallback((id) => {
    return influencers.find(inf => inf.id === id) || null;
  }, [influencers]);

  // Estado de carregamento combinado
  const loading = searchLoading || apiLoading;

  // Estado de erro combinado
  const error = searchError || apiError || lastError;

  // Função para limpar todos os erros
  const clearError = useCallback(() => {
    clearLastError();
  }, [clearLastError]);

  // Função para forçar uma atualização dos dados
  const refreshData = useCallback(() => {
    updateFilters(filters, true);
  }, [filters, updateFilters]);

  return (
    <InfluencerContext.Provider value={{
      influencers,
      loading,
      error,
      filters,
      totalResults,
      hasMore,
      updateFilters,
      clearFilters,
      loadMoreResults,
      getInfluencerById,
      fetchInfluencerById,
      refreshData,
      clearError
    }}>
      {children}
    </InfluencerContext.Provider>
  );
}

export const useInfluencer = () => {
  const context = useContext(InfluencerContext);
  if (!context) {
    throw new Error('useInfluencer must be used within an InfluencerProvider');
  }
  return context;
};