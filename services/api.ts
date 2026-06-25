import axios from 'axios';
import { SearchResult, Product } from '../types/searchresult.type';
import { ProductResponse } from '../../hooks/useSearch';

const api = axios.create({
  baseURL: 'https://world.openfoodfacts.org/api/v2/',
  timeout: 10000,
});

export async function searchProducts(query: string): Promise<SearchResult> {
  const { data } = await api.get<SearchResult>(`search?${query}`);
  return data;
}

export async function fetchProduct(code: string): Promise<Product> {
  const { data } = await api.get<ProductResponse>(`product/${code}`);
  return data.product;
}