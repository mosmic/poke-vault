import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { TypeBadge } from '../type-badge/type-badge';
import { RouterLink } from '@angular/router';
import { PokemonCard as IPokemonCard } from '../../../core/models';

@Component({
  selector: 'app-pokemon-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, TypeBadge],
  templateUrl: './pokemon-card.html',
  styleUrl: './pokemon-card.css',
})
export class PokemonCard {
  readonly pokemon = input.required<IPokemonCard>();
  readonly isFavorite = input(false);
  readonly toggleFavorite = output<number>();

  protected readonly formattedName = computed(() =>
    this.pokemon()
      .name.replace(/-/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase()),
  );

  protected readonly paddedId = computed(() => `#${String(this.pokemon().id).padStart(3, '0')}`);
}
