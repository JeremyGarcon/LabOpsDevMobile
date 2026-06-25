import axios from 'axios';
import { SearchResult } from '../types/searchresult.type';
import { Product } from '../types/product.type';

const api = axios.create({
  baseURL: 'https://openfoodfacts.github.io/openfoodfacts-server/api/',
  timeout: 10000,
});

export async function searchProducts(query: string): Promise<SearchResult> {
  const { data } = await api.get<SearchResult>(`/search?${query}`);
  return data;
}

export async function fetchProduct(): Promise<Product[]> {
 const { data } = await api.get<Product[]>('/produit');
 return data;
}