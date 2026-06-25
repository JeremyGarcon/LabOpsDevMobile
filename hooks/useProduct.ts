import { useQuery } from '@tanstack/react-query';
import { fetchProduct } from '../services/api';
import { cacheProducts, getCachedProducts } from '../services/storage';

export function useProduct(code: string) {
    return useQuery({
        queryKey: ['product', code],
        queryFn: async () => {
            const fresh = await fetchProduct(code);
            await cacheProducts(fresh);
            return fresh;
        },
        initialData: undefined,
        placeholderData: () => getCachedProducts(),
    });
}