import axios from 'axios';
import { SearchResult, Product } from '../types/searchresult.type';
import { ProductResponse } from '../types/productreponse.type';

const offApi = axios.create({
  baseURL: 'https://world.openfoodfacts.org',
  timeout: 10000,
});

const offV2Api = axios.create({
  baseURL: 'https://world.openfoodfacts.org/api/v2/',
  timeout: 10000,
});

export async function searchProducts(term: string): Promise<SearchResult> {
  const { data } = await offApi.get<SearchResult>('/cgi/search.pl', {
    params: {
      action: 'process',
      json: true,
      page_size: 20,
      fields: 'code,product_name,brands,nutriscore_grade,image_url',
      ...(term ? { search_terms: term } : {}),
    },
  });
  return data;
}

export async function fetchProduct(code: string): Promise<Product> {
  const { data } = await offV2Api.get<ProductResponse>(`product/${code}`);
  return data.product;
}
