import { createActionGroup, emptyProps, props } from '@ngrx/store';
import type { PokemonCard } from '../../core/models';

export const PokemonActions = createActionGroup({
  source: 'Pokemon',
  events: {
    'Load More': emptyProps(),
    'Load More Success': props<{ cards: PokemonCard[]; totalCount: number }>(),
    'Load More Failure': props<{ error: string }>(),
    'Set Search Query': props<{ query: string }>(),
    Reset: emptyProps(),
  },
});
