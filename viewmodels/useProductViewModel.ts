import { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useDebounce } from '../hooks/useDebounce';
import { productRepository } from '../repositories/productrepository';
import { getCachedProduct, getCachedProducts } from '../services/storage';
import { NutriscoreGrade, Product, SearchResult } from '../types/searchresult.type';
import { usePreferencesStore } from '../stores/usePreferencesStore';

// Ordre Nutri-Score (a = meilleur). Les grades absents passent en fin de liste.
const NUTRISCORE_RANK: Record<string, number> = { a: 0, b: 1, c: 2, d: 3, e: 4 };
function nutriscoreRank(grade?: NutriscoreGrade): number {
    return grade && grade in NUTRISCORE_RANK ? NUTRISCORE_RANK[grade] : 99;
}

export function useProductsViewModel() {
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search.trim(), 400);
    const [cachedData, setCachedData] = useState<SearchResult | undefined>();

    useEffect(() => {
        let cancelled = false;
        getCachedProducts(debouncedSearch).then((cached) => {
            if (!cancelled) {
                setCachedData(cached ?? undefined);
            }
        });
        return () => {
            cancelled = true;
        };
    }, [debouncedSearch]);

    const { data, isLoading, isFetching, isError, error, refetch } = useQuery({
        queryKey: ['products', debouncedSearch],
        queryFn: () => productRepository.search(debouncedSearch),
        placeholderData: (previousData) => previousData ?? cachedData,
    });

    // Filtres globaux issus du store Zustand (partagés entre écrans).
    const nutriscoreFilter = usePreferencesStore((s) => s.nutriscoreFilter);
    const sortBy = usePreferencesStore((s) => s.sortBy);

    const products: Product[] = useMemo(() => {
        let result = data?.products ?? [];
        if (nutriscoreFilter) {
            result = result.filter((p) => p.nutriscore_grade === nutriscoreFilter);
        }
        if (sortBy === 'name') {
            result = [...result].sort((a, b) =>
                (a.product_name || '').localeCompare(b.product_name || '')
            );
        } else if (sortBy === 'nutriscore') {
            result = [...result].sort(
                (a, b) => nutriscoreRank(a.nutriscore_grade) - nutriscoreRank(b.nutriscore_grade)
            );
        }
        return result;
    }, [data, nutriscoreFilter, sortBy]);

    return {
        products,
        search,
        setSearch,
        debouncedSearch,
        isLoading,
        isFetching,
        isError,
        error,
        refetch,
        showListLoader: isLoading && products.length === 0,
    };
}

export function useProductDetailViewModel(code: string | string[] | undefined) {
    const normalizedCode = Array.isArray(code) ? code[0] : (code ?? '');
    const [cachedData, setCachedData] = useState<Product | undefined>();

    useEffect(() => {
        if (!normalizedCode) {
            setCachedData(undefined);
            return;
        }
        let cancelled = false;
        getCachedProduct(normalizedCode).then((cached) => {
            if (!cancelled) {
                setCachedData(cached ?? undefined);
            }
        });
        return () => {
            cancelled = true;
        };
    }, [normalizedCode]);

    const { data, isLoading, isFetching, isError, error, refetch } = useQuery({
        queryKey: ['product', normalizedCode],
        queryFn: () => productRepository.getByCode(normalizedCode),
        enabled: !!normalizedCode,
        placeholderData: (previousData) => previousData ?? cachedData,
    });

    return {
        product: data,
        code: normalizedCode,
        isLoading,
        isFetching,
        isError,
        error,
        refetch,
        showLoader: isLoading && !data,
    };
}
