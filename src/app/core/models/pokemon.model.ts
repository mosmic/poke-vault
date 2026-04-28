export interface PokemonListResponse {
  readonly count: number;
  readonly next: string | null;
  readonly previous: string | null;
  readonly results: readonly NamedResource[];
}

export interface NamedResource {
  readonly name: string;
  readonly url: string;
}

export interface Pokemon {
  readonly id: number;
  readonly name: string;
  readonly base_experience: number;
  readonly height: number;
  readonly weight: number;
  readonly sprites: PokemonSprites;
  readonly types: readonly PokemonType[];
  readonly stats: readonly PokemonStat[];
  readonly abilities: readonly PokemonAbility[];
  readonly moves: readonly PokemonMove[];
  readonly species: NamedResource;
}

export interface PokemonSprites {
  readonly front_default: string;
  readonly front_shiny: string;
  readonly other: {
    readonly 'official-artwork': {
      readonly front_default: string;
      readonly front_shiny: string;
    };
  };
}

export interface PokemonType {
  readonly slot: number;
  readonly type: NamedResource;
}

export interface PokemonStat {
  readonly base_stat: number;
  readonly effort: number;
  readonly stat: NamedResource;
}

export interface PokemonAbility {
  readonly slot: number;
  readonly is_hidden: boolean;
  readonly ability: NamedResource;
}

export interface PokemonMove {
  readonly move: NamedResource;
}

/**
 * Domain model — a lightweight card used in the list view.
 * Mapped from the full Pokemon API response at the service boundary.
 * Components that only render cards never receive the full 60-field response.
 */
export interface PokemonCard {
  readonly id: number;
  readonly name: string;
  readonly imageUrl: string;
  readonly types: readonly string[];
}
