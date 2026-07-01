import { ProductRepository } from '../productrepository';
import { searchProducts } from '../../services/api';
import { cacheProducts, getCachedProducts } from '../../services/storage';
import { SearchResult } from '../../types/searchresult.type';

// On isole le repository de ses collaborateurs (réseau + persistance).
jest.mock('../../services/api');
jest.mock('../../services/storage');

const mockedSearchProducts = searchProducts as jest.MockedFunction<typeof searchProducts>;
const mockedCacheProducts = cacheProducts as jest.MockedFunction<typeof cacheProducts>;
const mockedGetCachedProducts = getCachedProducts as jest.MockedFunction<typeof getCachedProducts>;

const fakeResult: SearchResult = {
    count: 1,
    page: 1,
    page_count: 1,
    page_size: 20,
    skip: 0,
    products: [{ code: '3017620422003', product_name: 'Nutella' }],
};

describe('ProductRepository.search', () => {
    let repository: ProductRepository;

    beforeEach(() => {
        repository = new ProductRepository();
        jest.clearAllMocks();
    });

    it('renvoie les données réseau et met le cache à jour (chemin nominal)', async () => {
        mockedSearchProducts.mockResolvedValue(fakeResult);

        const result = await repository.search('nutella');

        expect(result).toEqual(fakeResult);
        expect(mockedSearchProducts).toHaveBeenCalledWith('nutella');
        expect(mockedCacheProducts).toHaveBeenCalledWith('nutella', fakeResult);
        // Sur le chemin nominal, on ne lit jamais le cache.
        expect(mockedGetCachedProducts).not.toHaveBeenCalled();
    });

    it('bascule sur le cache quand le réseau échoue', async () => {
        mockedSearchProducts.mockRejectedValue(new Error('network down'));
        mockedGetCachedProducts.mockResolvedValue(fakeResult);

        const result = await repository.search('nutella');

        expect(result).toEqual(fakeResult);
        expect(mockedGetCachedProducts).toHaveBeenCalledWith('nutella');
        // Un échec réseau ne doit pas réécrire le cache.
        expect(mockedCacheProducts).not.toHaveBeenCalled();
    });

    it('lève une erreur explicite quand ni le réseau ni le cache ne répondent', async () => {
        mockedSearchProducts.mockRejectedValue(new Error('network down'));
        mockedGetCachedProducts.mockResolvedValue(null);

        await expect(repository.search('nutella')).rejects.toThrow(
            'Aucune donnée disponible (ni réseau ni cache)',
        );
    });
});
