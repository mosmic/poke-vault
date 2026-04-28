import { describe, expect, it } from 'vitest';
import { pokemonReducer } from './pokemon.reducer';
import { PokemonActions } from './pokemon.actions';
import { initialPokemonState } from './pokemon.state';
import type { PokemonCard } from '../../core/models';

const mockCard = (id: number): PokemonCard => ({
  id,
  name: `pokemon-${id}`,
  imageUrl: '',
  types: ['fire'],
});

describe('pokemonReducer', () => {
  it('should return the initial state', () => {
    const state = pokemonReducer(undefined, { type: '@@INIT' } as never);
    expect(state).toEqual(initialPokemonState);
  });

  it('loadMore → sets loading true and clears error', () => {
    const state = pokemonReducer(
      { ...initialPokemonState, error: 'previous error' },
      PokemonActions.loadMore(),
    );
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('loadMoreSuccess → appends cards, updates offset and totalCount', () => {
    const cards = [mockCard(1), mockCard(2)];
    const state = pokemonReducer(
      { ...initialPokemonState, loading: true },
      PokemonActions.loadMoreSuccess({ cards, totalCount: 50 }),
    );
    expect(state.cards).toHaveLength(2);
    expect(state.offset).toBe(2);
    expect(state.totalCount).toBe(50);
    expect(state.loading).toBe(false);
  });

  it('loadMoreSuccess → appends to existing cards, does not replace', () => {
    const existing = pokemonReducer(
      { ...initialPokemonState },
      PokemonActions.loadMoreSuccess({ cards: [mockCard(1)], totalCount: 10 }),
    );
    const next = pokemonReducer(
      existing,
      PokemonActions.loadMoreSuccess({ cards: [mockCard(2)], totalCount: 10 }),
    );
    expect(next.cards).toHaveLength(2);
    expect(next.offset).toBe(2);
  });

  it('loadMoreFailure → sets error, clears loading', () => {
    const state = pokemonReducer(
      { ...initialPokemonState, loading: true },
      PokemonActions.loadMoreFailure({ error: 'Network error' }),
    );
    expect(state.error).toBe('Network error');
    expect(state.loading).toBe(false);
  });

  it('setSearchQuery → normalises to lowercase trimmed string', () => {
    const state = pokemonReducer(
      initialPokemonState,
      PokemonActions.setSearchQuery({ query: '  Pika  ' }),
    );
    expect(state.searchQuery).toBe('pika');
  });

  it('reset → returns to initial state', () => {
    const dirty = pokemonReducer(
      { ...initialPokemonState, cards: [mockCard(1)], totalCount: 50 },
      PokemonActions.reset(),
    );
    expect(dirty).toEqual(initialPokemonState);
  });
});
