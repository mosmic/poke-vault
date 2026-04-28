import { inject, Injectable } from '@angular/core';
import { Pokemon, PokemonCard, PokemonListResponse } from '../models';
import { HttpClient } from '@angular/common/http';
import { forkJoin, map, Observable, switchMap } from 'rxjs';

export interface PokemonPage {
  readonly cards: PokemonCard[];
  readonly totalCount: number;
}

@Injectable({
  providedIn: 'root',
})
export class PokemonService {
  private readonly http = inject(HttpClient);

  private readonly BASE_URL = 'https://pokeapi.co/api/v2' as const;
  readonly LIMIT = 20 as const;

  loadPage(offset: number): Observable<PokemonPage> {
    return this.http
      .get<PokemonListResponse>(`${this.BASE_URL}/pokemon`, {
        params: { limit: this.LIMIT, offset },
      })
      .pipe(
        switchMap((response) =>
          forkJoin(response.results.map((r) => this.http.get<Pokemon>(r.url))).pipe(
            map((pokemons) => ({
              cards: pokemons.map((p) => this.toCard(p)),
              totalCount: response.count,
            })),
          ),
        ),
      );
  }

  getById(id: string | number): Observable<Pokemon> {
    return this.http.get<Pokemon>(`${this.BASE_URL}/pokemon/${id}`);
  }

  private toCard(pokemon: Pokemon): PokemonCard {
    return {
      id: pokemon.id,
      name: pokemon.name,
      imageUrl:
        pokemon.sprites.other['official-artwork'].front_default ?? pokemon.sprites.front_default,
      types: pokemon.types.map((t) => t.type.name),
    };
  }
}
