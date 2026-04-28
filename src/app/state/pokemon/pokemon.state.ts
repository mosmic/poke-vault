import type { PokemonCard } from '../../core/models';

export interface PokemonState {
  readonly cards: PokemonCard[];
  readonly loading: boolean;
  readonly error: string | null;
  readonly offset: number;
  readonly totalCount: number;
  readonly searchQuery: string;
}

export const initialPokemonState: PokemonState = {
  cards: [],
  loading: false,
  error: null,
  offset: 0,
  totalCount: 0,
  searchQuery: '',
};
