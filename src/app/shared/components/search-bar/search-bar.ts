import { ChangeDetectionStrategy, Component, model } from '@angular/core';

@Component({
  selector: 'app-search-bar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="relative">
      <svg
        class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
        />
      </svg>

      <input
        type="search"
        [value]="value()"
        (input)="value.set($any($event.target).value)"
        placeholder="Search Pokémon…"
        aria-label="Search Pokémon by name"
        class="w-full rounded-xl border border-gray-300 bg-white py-2.5 pl-10 pr-2 text-sm text-gray-900
               placeholder-gray-400 transition focus:border-red-400 focus:outline-none focus:ring-2
               focus:ring-red-400/30 dark:border-gray-600 dark:bg-gray-800 dark:text-white
               dark:placeholder-gray-500"
      />
    </div>
  `,
})
export class SearchBar {
  /**
   * model() creates a two-way bindable signal input.
   * Parent binds: [(value)]="searchQuery"
   * When the user types, model() emits valueChange and the parent signal updates.
   * When the parent signal changes externally, this value() also updates.
   */
  readonly value = model('');
}
