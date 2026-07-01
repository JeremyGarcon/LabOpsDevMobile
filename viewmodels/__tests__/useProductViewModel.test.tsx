import React, { ReactNode } from 'react';
import { act, renderHook, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useProductsViewModel } from '../useProductViewModel';
import { productRepository } from '../../repositories/productrepository';
import { getCachedProducts } from '../../services/storage';
import { SearchResult } from '../../types/searchresult.type';

// On teste la logique du ViewModel, pas ses dépendances I/O.
jest.mock('../../repositories/productrepository', () => ({
    productRepository: { search: jest.fn() },
}));
jest.mock('../../services/storage');
// Le debounce est neutralisé : la valeur de recherche est propagée immédiatement.
jest.mock('../../hooks/useDebounce', () => ({
    useDebounce: (value: string) => value,
}));

const mockedSearch = productRepository.search as jest.MockedFunction<
    typeof productRepository.search
>;
const mockedGetCachedProducts = getCachedProducts as jest.MockedFunction<
    typeof getCachedProducts
>;

const fakeResult: SearchResult = {
    count: 2,
    page: 1,
    page_count: 1,
    page_size: 20,
    skip: 0,
    products: [
        { code: '3017620422003', product_name: 'Nutella' },
        { code: '0000000000000', product_name: 'Pâte à tartiner' },
    ],
};

function createWrapper() {
    // retry: false pour que les erreurs remontent immédiatement dans les tests.
    const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false } },
    });

    return ({ children }: { children: ReactNode }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
}

describe('useProductsViewModel', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockedGetCachedProducts.mockResolvedValue(null);
    });

    it('expose une liste vide et un loader au premier rendu', () => {
        // Requête jamais résolue => l'état de chargement persiste.
        mockedSearch.mockReturnValue(new Promise(() => {}));

        const { result } = renderHook(() => useProductsViewModel(), {
            wrapper: createWrapper(),
        });

        expect(result.current.products).toEqual([]);
        expect(result.current.showListLoader).toBe(true);
    });

    it('expose les produits renvoyés par le repository après une recherche', async () => {
        mockedSearch.mockResolvedValue(fakeResult);

        const { result } = renderHook(() => useProductsViewModel(), {
            wrapper: createWrapper(),
        });

        act(() => {
            result.current.setSearch('nutella');
        });

        await waitFor(() => {
            expect(result.current.products).toHaveLength(2);
        });

        expect(result.current.products[0].product_name).toBe('Nutella');
        expect(mockedSearch).toHaveBeenCalledWith('nutella');
        expect(result.current.showListLoader).toBe(false);
    });

    it("remonte l'état d'erreur quand le repository échoue", async () => {
        mockedSearch.mockRejectedValue(new Error('boom'));

        const { result } = renderHook(() => useProductsViewModel(), {
            wrapper: createWrapper(),
        });

        act(() => {
            result.current.setSearch('xxx');
        });

        await waitFor(() => {
            expect(result.current.isError).toBe(true);
        });
    });
});
