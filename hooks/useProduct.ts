import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchProduct } from '../services/api';
import { cacheProduct, getCachedProduct } from '../services/storage';
import { Product } from '../types/searchresult.type';

export function useProduct(code: string) {
    const [cachedData, setCachedData] = useState<Product | undefined>();

    useEffect(() => {
        if (!code) {
            setCachedData(undefined);
            return;
        }
        let cancelled = false;
        getCachedProduct(code).then((cached) => {
            if (!cancelled) {
                setCachedData(cached ?? undefined);
            }
        });
        return () => {
            cancelled = true;
        };
    }, [code]);

    return useQuery({
        queryKey: ['product', code],
        queryFn: async () => {
            try {
                const fresh = await fetchProduct(code);
                await cacheProduct(code, fresh);
                return fresh;
            } catch (error) {
                const cached = await getCachedProduct(code);
                if (cached) return cached;
                throw error;
            }
        },
        enabled: !!code,
        placeholderData: (previous) => previous ?? cachedData,
    });
}
