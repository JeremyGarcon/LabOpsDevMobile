// repositories/productrepository.ts
import { searchProducts, fetchProduct } from '../services/api';
import {
    cacheProducts,
    getCachedProducts,
    cacheProduct,
    getCachedProduct,
} from '../services/storage';
import { Product, SearchResult } from '../types/searchresult.type';

export interface IProductRepository {
    search(query: string): Promise<SearchResult>;
    getByCode(code: string): Promise<Product>;
}

export class ProductRepository implements IProductRepository {
    async search(query: string): Promise<SearchResult> {
        try {
            const fresh = await searchProducts(query);
            await cacheProducts(query, fresh);
            return fresh;
        } catch {
            const cached = await getCachedProducts(query);
            if (cached) return cached;
            throw new Error('Aucune donnée disponible (ni réseau ni cache)');
        }
    }

    async getByCode(code: string): Promise<Product> {
        try {
            const fresh = await fetchProduct(code);
            await cacheProduct(code, fresh);
            return fresh;
        } catch {
            const cached = await getCachedProduct(code);
            if (cached) return cached;
            throw new Error('Aucune donnée disponible (ni réseau ni cache)');
        }
    }
}

// Instance singleton
export const productRepository = new ProductRepository();
