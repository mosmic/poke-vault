import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { PokemonList } from './pokemon-list';
import { PokemonActions } from '../../state/pokemon/pokemon.actions';
import {
  selectError,
  selectFilteredCards,
  selectHasMore,
  selectLoading,
} from '../../state/pokemon/pokemon.selectors';
import type { PokemonCard } from '../../core/models';

// jsdom does not implement IntersectionObserver. Provide a simple constructor
// so Angular's createIntersectionObserver (which uses `new`) works in tests.
class MockIntersectionObserver {
  private callback?: IntersectionObserverCallback;
  private options?: IntersectionObserverInit;
  constructor(cb?: IntersectionObserverCallback, options?: IntersectionObserverInit) {
    this.callback = cb;
    this.options = options;
  }
  observe() {
    return undefined;
  }
  unobserve() {
    return undefined;
  }
  disconnect() {
    return undefined;
  }
}
Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  value: MockIntersectionObserver,
});

const mockCards: PokemonCard[] = [
  { id: 1, name: 'bulbasaur', imageUrl: '', types: ['grass', 'poison'] },
  { id: 4, name: 'charmander', imageUrl: '', types: ['fire'] },
  { id: 7, name: 'squirtle', imageUrl: '', types: ['water'] },
];

describe('PokemonList', () => {
  let component: PokemonList;
  let fixture: ComponentFixture<PokemonList>;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PokemonList],
      providers: [
        provideRouter([]),
        provideMockStore({
          selectors: [
            { selector: selectFilteredCards, value: mockCards },
            { selector: selectLoading, value: false },
            { selector: selectError, value: null },
            { selector: selectHasMore, value: true },
          ],
        }),
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(PokemonList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch loadMore() on init', () => {
    const spy = vi.spyOn(store, 'dispatch');
    TestBed.createComponent(PokemonList);
    expect(spy).toHaveBeenCalledWith(PokemonActions.loadMore());
  });

  it('visibleCards() returns all cards when typeFilter is empty', () => {
    // access protected via cast — standard Angular testing pattern
    const cmp = component as unknown as { visibleCards: () => PokemonCard[] };
    expect(cmp.visibleCards()).toHaveLength(3);
  });

  it('visibleCards() filters by typeFilter signal', () => {
    const cmp = component as unknown as {
      typeFilter: { set(v: string): void };
      visibleCards: () => PokemonCard[];
    };
    cmp.typeFilter.set('fire');
    expect(cmp.visibleCards()).toHaveLength(1);
    expect(cmp.visibleCards()[0].name).toBe('charmander');
  });

  it('isEmpty() is true when no cards and not loading', () => {
    store.overrideSelector(selectFilteredCards, []);
    store.overrideSelector(selectLoading, false);
    store.refreshState();
    fixture.detectChanges();
    const cmp = component as unknown as { isEmpty: () => boolean };
    expect(cmp.isEmpty()).toBe(true);
  });

  it('isEmpty() is false when loading (skeletons are showing)', () => {
    store.overrideSelector(selectFilteredCards, []);
    store.overrideSelector(selectLoading, true);
    store.refreshState();
    fixture.detectChanges();
    const cmp = component as unknown as { isEmpty: () => boolean };
    expect(cmp.isEmpty()).toBe(false);
  });

  it('searchQuery signal updates correctly', () => {
    const cmp = component as unknown as { searchQuery: { set(v: string): void; (): string } };
    cmp.searchQuery.set('pika');
    expect(cmp.searchQuery()).toBe('pika');
  });

  it('viewMode toggles between grid and list', () => {
    const cmp = component as unknown as {
      viewMode: { (): string };
      toggleViewMode: () => void;
    };
    expect(cmp.viewMode()).toBe('grid');
    cmp.toggleViewMode();
    expect(cmp.viewMode()).toBe('list');
    cmp.toggleViewMode();
    expect(cmp.viewMode()).toBe('grid');
  });

  it('availableTypes() returns deduplicated sorted types from cards', () => {
    const cmp = component as unknown as { availableTypes: () => string[] };
    expect(cmp.availableTypes()).toEqual(['fire', 'grass', 'poison', 'water']);
  });
});
