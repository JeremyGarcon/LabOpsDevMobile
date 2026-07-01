// stores/usePreferencesStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NutriscoreGrade } from '../types/searchresult.type';

export type SortBy = 'name' | 'nutriscore';

type PreferencesState = {
    nutriscoreFilter: NutriscoreGrade | null;
    sortBy: SortBy;
    setNutriscoreFilter: (grade: NutriscoreGrade | null) => void;
    setSortBy: (sortBy: SortBy) => void;
    reset: () => void;
};

// Préférences utilisateur partagées entre les écrans, persistées via AsyncStorage.
export const usePreferencesStore = create<PreferencesState>()(
    persist(
        (set) => ({
            nutriscoreFilter: null,
            sortBy: 'name',
            setNutriscoreFilter: (grade) => set({ nutriscoreFilter: grade }),
            setSortBy: (sortBy) => set({ sortBy }),
            reset: () => set({ nutriscoreFilter: null, sortBy: 'name' }),
        }),
        { name: 'preferences', storage: createJSONStorage(() => AsyncStorage) }
    )
);
