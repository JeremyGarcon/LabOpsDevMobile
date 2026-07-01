import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useDebounce } from '../hooks/useDebounce';
import { productRepository } from '../repositories/productrepository';
import { getCachedProduct, getCachedProducts } from '../services/storage';
import { Product, SearchResult } from '../types/searchresult.type';

export function useProductsViewModel() {
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search.trim(), 400);
    const [cachedData, setCachedData] = useState<SearchResult | undefined>();

    useEffect(() => {
        let cancelled = false;

        const loadCachedData = async () => {
            const cached = await getCachedProducts(debouncedSearch);

            if (!cancelled) {
                setCachedData(cached ?? undefined);
            }
        };

        loadCachedData();

        return () => {
            cancelled = true;
        };
    }, [debouncedSearch]);

    const { data, isLoading, isFetching, isError, error, refetch } = useQuery({
        queryKey: ['products', debouncedSearch],
        queryFn: async () => {
            const [cached, apiData] = await Promise.all([
                getCachedProducts(debouncedSearch),
                productRepository.search(debouncedSearch),
            ]);

            return apiData ?? cached;
        },
        placeholderData: (previousData) => previousData ?? cachedData,
    });

    const products: Product[] = data?.products ?? [];

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

        const loadCachedData = async () => {
            const cached = await getCachedProduct(normalizedCode);

            if (!cancelled) {
                setCachedData(cached ?? undefined);
            }
        };

        loadCachedData();

        return () => {
            cancelled = true;
        };
    }, [normalizedCode]);

    const { data, isLoading, isFetching, isError, error, refetch } = useQuery({
        queryKey: ['product', normalizedCode],
        enabled: !!normalizedCode,
        queryFn: async () => {
            const [cached, product] = await Promise.all([
                getCachedProduct(normalizedCode),
                productRepository.getByCode(normalizedCode),
            ]);

            return product ?? cached;
        },
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