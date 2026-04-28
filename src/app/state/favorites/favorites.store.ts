import { isPlatformBrowser } from '@angular/common';
import { computed, effect, inject, PLATFORM_ID } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';

const STORAGE_KEY = 'poke-vault-favorites';

interface FavoritesState {
  readonly ids: number[];
}

function loadFromStorage(isBrowser: boolean): number[] {
  if (!isBrowser) return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((v): v is number => typeof v === 'number');
  } catch {
    // Corrupt data — start fresh rather than crashing
    return [];
  }
}

export const FavoritesStore = signalStore(
  { providedIn: 'root' },
  withState<FavoritesState>({ ids: [] }),

  withComputed(({ ids }) => ({
    count: computed(() => ids().length),
    isEmpty: computed(() => ids().length === 0),
  })),

  withMethods((store) => ({
    toggle(id: number): void {
      patchState(store, (state) => ({
        ids: state.ids.includes(id) ? state.ids.filter((i) => i !== id) : [...state.ids, id],
      }));
    },

    isFavorite(id: number): boolean {
      return store.ids().includes(id);
    },

    clear(): void {
      patchState(store, { ids: [] });
    },
  })),

  withHooks({
    onInit(store) {
      const platformId = inject(PLATFORM_ID);
      const isBrowser = isPlatformBrowser(platformId);

      // Rehydrate from localStorage on startup
      const stored = loadFromStorage(isBrowser);
      if (stored.length > 0) {
        patchState(store, { ids: stored });
      }

      // Persist to localStorage on every change via effect()
      effect(() => {
        if (!isBrowser) return;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(store.ids()));
      });
    },
  }),
);
