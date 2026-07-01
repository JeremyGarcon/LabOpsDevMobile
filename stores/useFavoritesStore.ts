// stores/useFavoritesStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

type FavoritesState = {
    // Codes-barres des produits mis en favori, partagés entre la liste et le détail.
    favorites: string[];
    toggleFavorite: (code: string) => void;
    isFavorite: (code: string) => boolean;
    clear: () => void;
};

export const useFavoritesStore = create<FavoritesState>()(
    persist(
        (set, get) => ({
            favorites: [],
            toggleFavorite: (code) =>
                set((s) => ({
                    favorites: s.favorites.includes(code)
                        ? s.favorites.filter((c) => c !== code)
                        : [...s.favorites, code],
                })),
            isFavorite: (code) => get().favorites.includes(code),
            clear: () => set({ favorites: [] }),
        }),
        { name: 'favorites', storage: createJSONStorage(() => AsyncStorage) }
    )
);
