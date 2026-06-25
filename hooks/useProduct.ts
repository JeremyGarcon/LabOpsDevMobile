import { useQuery } from '@tanstack/react-query';
import { fetchProduct } from '../services/api';

export function useProduct() {
 return useQuery({
 queryKey: ['product'],
 queryFn: fetchProduct,
 });
}