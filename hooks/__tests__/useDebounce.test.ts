import { act, renderHook } from '@testing-library/react-native';
import { useDebounce } from '../useDebounce';

describe('useDebounce', () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it('retourne la valeur initiale immédiatement', () => {
        const { result } = renderHook(() => useDebounce('nutella', 400));

        expect(result.current).toBe('nutella');
    });

    it("ne met à jour la valeur qu'une fois le délai écoulé", () => {
        const { result, rerender } = renderHook(
            ({ value }) => useDebounce(value, 400),
            { initialProps: { value: 'a' } },
        );

        rerender({ value: 'ab' });

        // Juste avant l'échéance : on conserve encore l'ancienne valeur.
        act(() => {
            jest.advanceTimersByTime(399);
        });
        expect(result.current).toBe('a');

        // Une fois le délai atteint, la nouvelle valeur est propagée.
        act(() => {
            jest.advanceTimersByTime(1);
        });
        expect(result.current).toBe('ab');
    });

    it('réinitialise le minuteur à chaque frappe rapide (une seule valeur retenue)', () => {
        const { result, rerender } = renderHook(
            ({ value }) => useDebounce(value, 400),
            { initialProps: { value: 'n' } },
        );

        rerender({ value: 'nu' });
        act(() => {
            jest.advanceTimersByTime(200);
        });

        rerender({ value: 'nut' });
        act(() => {
            jest.advanceTimersByTime(200);
        });

        // 400 ms cumulés, mais chaque frappe a relancé le minuteur : rien n'est figé.
        expect(result.current).toBe('n');

        act(() => {
            jest.advanceTimersByTime(400);
        });
        // Seule la dernière valeur saisie est retenue.
        expect(result.current).toBe('nut');
    });
});
