import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { FavoritesStore } from './favorites.store';

describe('FavoritesStore', () => {
  let store: InstanceType<typeof FavoritesStore>;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    store = TestBed.inject(FavoritesStore);
  });

  it('should start with an empty list', () => {
    expect(store.count()).toBe(0);
    expect(store.isEmpty()).toBe(true);
  });

  it('toggle() should add an id', () => {
    store.toggle(1);
    expect(store.isFavorite(1)).toBe(true);
    expect(store.count()).toBe(1);
  });

  it('toggle() should remove an id when called twice', () => {
    store.toggle(1);
    store.toggle(1);
    expect(store.isFavorite(1)).toBe(false);
    expect(store.count()).toBe(0);
  });

  it('count() and isEmpty() should be reactive computed signals', () => {
    expect(store.isEmpty()).toBe(true);
    store.toggle(25);
    expect(store.isEmpty()).toBe(false);
    expect(store.count()).toBe(1);
  });

  it('should persist to localStorage on change', () => {
    store.toggle(25);
    // effect() is async in zoneless mode — flush before asserting side effects
    TestBed.flushEffects();
    const raw = localStorage.getItem('poke-vault-favorites');
    expect(raw).not.toBeNull();
    expect(JSON.parse(raw!)).toContain(25);
  });

  it('should rehydrate from localStorage on init', () => {
    localStorage.setItem('poke-vault-favorites', JSON.stringify([1, 4, 7]));
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({});
    const fresh = TestBed.inject(FavoritesStore);
    expect(fresh.count()).toBe(3);
    expect(fresh.isFavorite(4)).toBe(true);
  });

  it('clear() should remove all favorites', () => {
    store.toggle(1);
    store.toggle(4);
    store.clear();
    expect(store.count()).toBe(0);
    expect(store.ids()).toEqual([]);
  });

  it('should survive corrupt localStorage data without throwing', () => {
    localStorage.setItem('poke-vault-favorites', '{ not valid json [');
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({});
    const fresh = TestBed.inject(FavoritesStore);
    expect(fresh.count()).toBe(0);
  });
});
