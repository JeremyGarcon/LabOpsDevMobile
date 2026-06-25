// services/storage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Product, SearchResult } from '../types/searchresult.type';

const searchCacheKey = (query: string) => `@cached_products_${encodeURIComponent(query)}`;
const productCacheKey = (code: string) => `@cached_product_${encodeURIComponent(code)}`;

export async function cacheProducts(query: string, data: SearchResult): Promise<void> {
    await AsyncStorage.setItem(searchCacheKey(query), JSON.stringify(data));
}

export async function getCachedProducts(query: string): Promise<SearchResult | null> {
    const json = await AsyncStorage.getItem(searchCacheKey(query));
    return json ? JSON.parse(json) : null;
}

export async function cacheProduct(code: string, product: Product): Promise<void> {
    await AsyncStorage.setItem(productCacheKey(code), JSON.stringify(product));
}

export async function getCachedProduct(code: string): Promise<Product | null> {
    const json = await AsyncStorage.getItem(productCacheKey(code));
    return json ? JSON.parse(json) : null;
}
