import { createReducer, on } from '@ngrx/store';
import { initialPokemonState, PokemonState } from './pokemon.state';
import { PokemonActions } from './pokemon.actions';

export const pokemonReducer = createReducer<PokemonState>(
  initialPokemonState,

  on(PokemonActions.loadMore, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(PokemonActions.loadMoreSuccess, (state, { cards, totalCount }) => ({
    ...state,
    cards: [...state.cards, ...cards],
    totalCount,
    offset: state.offset + cards.length,
    loading: false,
  })),

  on(PokemonActions.loadMoreFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(PokemonActions.setSearchQuery, (state, { query }) => ({
    ...state,
    searchQuery: query.trim().toLowerCase(),
  })),

  on(PokemonActions.reset, () => ({ ...initialPokemonState })),
);
