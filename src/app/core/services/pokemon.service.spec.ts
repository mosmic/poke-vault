import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { PokemonService } from './pokemon.service';
import type { Pokemon, PokemonListResponse } from '../models';

// ── Factories ────────────────────────────────────────────────────────────────

function makePokemon(id: number, name: string): Pokemon {
  return {
    id,
    name,
    base_experience: 64,
    height: 7,
    weight: 69,
    species: { name, url: '' },
    sprites: {
      front_default: `https://img/${id}.png`,
      front_shiny: '',
      other: {
        'official-artwork': {
          front_default: `https://artwork/${id}.png`,
          front_shiny: '',
        },
      },
    },
    types: [{ slot: 1, type: { name: 'grass', url: '' } }],
    stats: [],
    abilities: [],
    moves: [],
  } satisfies Pokemon;
}

const listResponse: PokemonListResponse = {
  count: 100,
  next: 'https://pokeapi.co/api/v2/pokemon?offset=20',
  previous: null,
  results: [
    { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
    { name: 'charmander', url: 'https://pokeapi.co/api/v2/pokemon/4/' },
  ],
};

// ── Tests ────────────────────────────────────────────────────────────────────

describe('PokemonService', () => {
  let service: PokemonService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(PokemonService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify()); // ensures no unexpected requests were made

  it('should return mapped PokemonCard DTOs with correct fields', () => {
    let result: ReturnType<typeof service.loadPage> extends import('rxjs').Observable<infer T>
      ? T
      : never;

    service.loadPage(0).subscribe((page) => {
      expect(page.totalCount).toBe(100);
      expect(page.cards).toHaveLength(2);
      expect(page.cards[0]).toEqual({
        id: 1,
        name: 'bulbasaur',
        imageUrl: 'https://artwork/1.png',
        types: ['grass'],
      });
    });

    http
      .expectOne((r) => r.url.includes('/pokemon') && r.params.get('offset') === '0')
      .flush(listResponse);

    http.expectOne('https://pokeapi.co/api/v2/pokemon/1/').flush(makePokemon(1, 'bulbasaur'));
    http.expectOne('https://pokeapi.co/api/v2/pokemon/4/').flush(makePokemon(4, 'charmander'));
  });

  it('should propagate HTTP errors to the caller', () => {
    let caughtError: unknown;

    service.loadPage(0).subscribe({ error: (e) => (caughtError = e) });

    http
      .expectOne((r) => r.url.includes('/pokemon'))
      .flush('Server error', {
        status: 500,
        statusText: 'Internal Server Error',
      });

    expect(caughtError).toBeDefined();
  });

  it('getById should call the correct endpoint', () => {
    service.getById(25).subscribe();
    http.expectOne('https://pokeapi.co/api/v2/pokemon/25');
  });
});
