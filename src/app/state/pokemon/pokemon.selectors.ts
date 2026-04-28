import { createFeatureSelector, createSelector } from '@ngrx/store';
import { PokemonState } from './pokemon.state';

export const selectPokemonState = createFeatureSelector<PokemonState>('pokemon');

export const selectAllCards = createSelector(selectPokemonState, (state) => state.cards);

export const selectLoading = createSelector(selectPokemonState, (state) => state.loading);

export const selectError = createSelector(selectPokemonState, (state) => state.error);

export const selectSearchQuery = createSelector(selectPokemonState, (state) => state.searchQuery);

export const selectOffset = createSelector(selectPokemonState, (state) => state.offset);

export const selectTotalCount = createSelector(selectPokemonState, (state) => state.totalCount);

/**
 * hasMore is true on initial load (totalCount 0 means we haven't fetched yet)
 * and true whenever loaded cards < total available.
 */
export const selectHasMore = createSelector(
  selectPokemonState,
  (state) => state.totalCount === 0 || state.cards.length < state.totalCount,
);

/**
 * Memoized client-side filter. Only recomputes when cards or query change.
 * PokeAPI has no search endpoint — filtering is always client-side.
 */
export const selectFilteredCards = createSelector(
  selectAllCards,
  selectSearchQuery,
  (cards, query) => (query === '' ? cards : cards.filter((c) => c.name.includes(query))),
);
