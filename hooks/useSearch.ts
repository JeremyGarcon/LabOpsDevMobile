// hooks/useSearch.ts
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { searchProducts } from '../services/api';
import { cacheProducts, getCachedProducts } from '../services/storage';
import { SearchResult } from '../types/searchresult.type';

export function useSearch(query: string) {
    const [cachedData, setCachedData] = useState<SearchResult | undefined>(undefined);

    useEffect(() => {
        if (!query) {
            setCachedData(undefined);
            return;
        }
        let cancelled = false;
        getCachedProducts(query).then((cached) => {
            if (!cancelled) {
                setCachedData(cached ?? undefined);
            }
        });
        return () => {
            cancelled = true;
        };
    }, [query]);

    return useQuery({
        queryKey: ['products', query],
        queryFn: async () => {
            try {
                const fresh = await searchProducts(query);
                await cacheProducts(query, fresh);
                return fresh;
            } catch (error) {
                const cached = await getCachedProducts(query);
                if (cached) return cached;
                throw error;
            }
        },
        initialData: undefined,
        placeholderData: (previousData) => previousData ?? cachedData,
        enabled: query.length > 0,
    });
}
// Utilisation dans l'écran :
// const { data, isLoading, isPlaceholderData, isError, error, refetch } = useSearch('nutella');
// const products = data?.products ?? [];
