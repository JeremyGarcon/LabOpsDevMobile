import { useQuery } from '@tanstack/react-query';
import { fetchProduct } from '../services/api';
import { cacheProducts, getCachedProducts } from '../services/storage';

export function useProduct() {
    return useQuery({
        queryKey: ['product'],
        queryFn: async () => {
            const fresh = await fetchProduct();
            await cacheProducts(fresh);
            return fresh;
        },
        initialData: undefined,
        placeholderData: () => getCachedProducts(),
    });
}