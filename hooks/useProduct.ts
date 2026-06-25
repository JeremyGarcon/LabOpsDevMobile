import { useQuery } from '@tanstack/react-query';
import { fetchProduct } from '../services/api';

export function useProduct(code: string) {
  return useQuery({
    queryKey: ['product', code],
    queryFn: () => fetchProduct(code),
    enabled: !!code,
  });
}
