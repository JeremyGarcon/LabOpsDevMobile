// hooks/useRestaurants.ts
import { useQuery } from '@tanstack/react-query';
import { searchProducts } from '../services/api';
export function useSearch(query: string) {
    return useQuery({
        queryKey: ['products', query],
        queryFn: () => searchProducts(query),
    });
}
// Utilisation dans l'écran :
// const { data: products, isLoading, isError, error, refetch } = useSearch();