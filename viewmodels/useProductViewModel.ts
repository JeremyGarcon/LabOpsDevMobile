import { useQuery } from '@tanstack/react-query';
import { useState, useMemo } from 'react';
import { restaurantRepository } from '../repositories/productrepository';
import { useDebounce } from '../hooks/useDebounce';
import { useFavorites } from '../hooks/useFavorites';

export function useProductsViewModel() {
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search);
    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ['products'],
        queryFn: () => ProductRepository.getAll(),
    });
    const { favorites, toggleFavorite, isFavorite } = useFavorites();
    const filtered = useMemo(
        () => (data ?? []).filter(r =>
            r.name.toLowerCase().includes(debouncedSearch.toLowerCase())),

        [data, debouncedSearch]
 );
 return { products: filtered, isLoading, isError, search, setSearch, refetch,
toggleFavorite, isFavorite };
 }
