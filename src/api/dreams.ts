import { apiClient } from './client';
import type { DreamSymbol, BasicDreamSymbol, SymbolsListResponse, RandomSymbolsResponse, LetterCountsResponse } from './types';

export const dreamsApi = {
  /**
   * List and search dream symbols
   */
  listSymbols: async (params?: {
    search?: string;
    letter?: string;
    limit?: number;
    offset?: number;
  }): Promise<SymbolsListResponse> => {
    const { data, error } = await apiClient.GET('/symbols', {
      params: { query: params },
    });
    if (error) throw new Error('Failed to fetch symbols');
    return data;
  },

  /**
   * Get a specific dream symbol by ID
   */
  getSymbol: async (id: string): Promise<DreamSymbol> => {
    const { data, error } = await apiClient.GET('/symbols/{id}', {
      params: { path: { id } },
    });
    if (error) throw new Error('Symbol not found');
    return data;
  },

  /**
   * Get random dream symbol(s)
   */
  getRandomSymbols: async (count: number = 1): Promise<DreamSymbol[]> => {
    const { data, error } = await apiClient.GET('/symbols/random', {
      params: { query: { count } },
    });
    if (error) throw new Error('Failed to fetch random symbols');
    return data.symbols;
  },

  /**
   * Get symbol counts by letter
   */
  getLetterCounts: async (): Promise<LetterCountsResponse> => {
    const { data, error } = await apiClient.GET('/symbols/letters');
    if (error) throw new Error('Failed to fetch letter counts');
    return data;
  },
};
