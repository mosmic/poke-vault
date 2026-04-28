import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { Observable, of, throwError } from 'rxjs';
import { Action } from '@ngrx/store';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PokemonEffects } from './pokemon.effects';
import { PokemonActions } from './pokemon.actions';
import { selectHasMore, selectOffset } from './pokemon.selectors';
import { PokemonService } from '../../core/services/pokemon.service';
import type { PokemonCard } from '../../core/models';

describe('PokemonEffects', () => {
  let effects: PokemonEffects;
  let actions$: Observable<Action>;
  let pokemonService: { loadPage: ReturnType<typeof vi.fn> };

  const mockCards: PokemonCard[] = [{ id: 1, name: 'bulbasaur', imageUrl: '', types: ['grass'] }];

  beforeEach(() => {
    pokemonService = { loadPage: vi.fn() };

    TestBed.configureTestingModule({
      providers: [
        PokemonEffects,
        provideMockActions(() => actions$),
        provideMockStore({
          selectors: [
            { selector: selectOffset, value: 0 },
            { selector: selectHasMore, value: true },
          ],
        }),
        { provide: PokemonService, useValue: pokemonService },
      ],
    });

    effects = TestBed.inject(PokemonEffects);
  });

  it('should dispatch loadMoreSuccess on successful page load', () => {
    pokemonService.loadPage.mockReturnValue(of({ cards: mockCards, totalCount: 100 }));
    actions$ = of(PokemonActions.loadMore());

    effects.loadMore$.subscribe((action) => {
      expect(action).toEqual(PokemonActions.loadMoreSuccess({ cards: mockCards, totalCount: 100 }));
    });
  });

  it('should dispatch loadMoreFailure on HTTP error', () => {
    pokemonService.loadPage.mockReturnValue(throwError(() => new Error('Network error')));
    actions$ = of(PokemonActions.loadMore());

    effects.loadMore$.subscribe((action) => {
      expect(action).toEqual(PokemonActions.loadMoreFailure({ error: 'Network error' }));
    });
  });

  it('should do nothing when hasMore is false', () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        PokemonEffects,
        provideMockActions(() => actions$),
        provideMockStore({
          selectors: [
            { selector: selectOffset, value: 1302 },
            { selector: selectHasMore, value: false }, // ← all loaded
          ],
        }),
        { provide: PokemonService, useValue: pokemonService },
      ],
    });
    effects = TestBed.inject(PokemonEffects);

    actions$ = of(PokemonActions.loadMore());
    let actionCount = 0;
    effects.loadMore$.subscribe(() => actionCount++);
    expect(actionCount).toBe(0);
    expect(pokemonService.loadPage).not.toHaveBeenCalled();
  });
});
