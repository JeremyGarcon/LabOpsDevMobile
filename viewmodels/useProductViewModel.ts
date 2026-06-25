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
