// services/storage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SearchResult } from '../types/searchresult.type';

const cacheKey = (query: string) => `@cached_products_${encodeURIComponent(query)}`;

export async function cacheProducts(query: string, data: SearchResult): Promise<void> {
    await AsyncStorage.setItem(cacheKey(query), JSON.stringify(data));
}

export async function getCachedProducts(query: string): Promise<SearchResult | null> {
    const json = await AsyncStorage.getItem(cacheKey(query));
    return json ? JSON.parse(json) : null;
}
