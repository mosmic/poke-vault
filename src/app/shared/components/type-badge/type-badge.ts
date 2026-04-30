import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

const TYPE_CLASSES: Readonly<Record<string, string>> = {
  normal: 'bg-gray-400 text-white',
  fire: 'bg-orange-500 text-white',
  water: 'bg-blue-500 text-white',
  electric: 'bg-yellow-400 text-gray-900',
  grass: 'bg-green-500 text-white',
  ice: 'bg-cyan-300 text-gray-900',
  fighting: 'bg-red-700 text-white',
  poison: 'bg-purple-500 text-white',
  ground: 'bg-yellow-600 text-white',
  flying: 'bg-indigo-400 text-white',
  psychic: 'bg-pink-500 text-white',
  bug: 'bg-lime-500 text-white',
  rock: 'bg-yellow-700 text-white',
  ghost: 'bg-purple-700 text-white',
  dragon: 'bg-indigo-700 text-white',
  dark: 'bg-gray-700 text-white',
  steel: 'bg-slate-400 text-white',
  fairy: 'bg-pink-300 text-gray-900',
};

const FALLBACK_CLASS = 'bg-gray-300 text-gray-900';

@Component({
  selector: 'app-type-badge',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span
      [class]="
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ' +
        colorClass()
      "
    >
      {{ type() }}
    </span>
  `,
})
export class TypeBadge {
  readonly type = input.required<string>();

  protected readonly colorClass = computed(() => TYPE_CLASSES[this.type()] ?? FALLBACK_CLASS);
}
