import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, exhaustMap, filter, map, of, withLatestFrom } from 'rxjs';
import { PokemonActions } from './pokemon.actions';
import { selectHasMore, selectOffset } from './pokemon.selectors';
import { PokemonService } from '../../core/services/pokemon.service';

@Injectable()
export class PokemonEffects {
  private readonly actions$ = inject(Actions);
  private readonly store = inject(Store);
  private readonly pokemonService = inject(PokemonService);

  /**
   * Handles pagination. Key decisions:
   * - withLatestFrom: snapshots offset + hasMore at dispatch time
   * - filter: guards against dispatching when there are no more pages
   * - exhaustMap: ignores new loadMore actions while a request is in flight
   *   (correct for infinite scroll — don't stack requests)
   */
  readonly loadMore$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PokemonActions.loadMore),
      withLatestFrom(this.store.select(selectOffset), this.store.select(selectHasMore)),
      filter(([, , hasMore]) => hasMore),
      exhaustMap(([, offset]) =>
        this.pokemonService.loadPage(offset).pipe(
          map(({ cards, totalCount }) => PokemonActions.loadMoreSuccess({ cards, totalCount })),
          catchError((err) =>
            of(
              PokemonActions.loadMoreFailure({
                error:
                  err instanceof Error ? err.message : 'Failed to load Pokémon. Please try again.',
              }),
            ),
          ),
        ),
      ),
    ),
  );
}
