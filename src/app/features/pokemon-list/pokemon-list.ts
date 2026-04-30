import {
  afterNextRender,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { FavoritesStore } from '../../state/favorites/favorites.store';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import {
  PokemonActions,
  selectError,
  selectFilteredCards,
  selectHasMore,
  selectLoading,
} from '../../state/pokemon';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { SearchBar } from '../../shared/components/search-bar/search-bar';
import { PokemonCard } from '../../shared/components/pokemon-card/pokemon-card';
import { SkeletonCard } from '../../shared/components/skeleton-card/skeleton-card';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-pokemon-list',
  imports: [SearchBar, PokemonCard, SkeletonCard, TitleCasePipe],
  templateUrl: './pokemon-list.html',
  styleUrl: './pokemon-list.css',
})
export class PokemonList {
  private readonly store = inject(Store);
  protected readonly favoritesStore = inject(FavoritesStore);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly cards = toSignal(this.store.select(selectFilteredCards), { initialValue: [] });
  protected readonly loading = toSignal(this.store.select(selectLoading), { initialValue: false });
  protected readonly error = toSignal(this.store.select(selectError), { initialValue: null });
  private readonly hasMore = toSignal(this.store.select(selectHasMore), { initialValue: true });

  protected readonly searchQuery = signal('');
  protected readonly typeFilter = signal('');
  protected readonly viewMode = signal<'grid' | 'list'>('grid');

  protected readonly visibleCards = computed(() => {
    const filter = this.typeFilter();
    return filter ? this.cards().filter((c) => c.types.includes(filter)) : this.cards();
  });

  protected readonly isEmpty = computed(() => !this.loading() && this.visibleCards().length === 0);

  protected readonly availableTypes = computed(() =>
    Array.from(new Set(this.cards().flatMap((c) => c.types))).sort(),
  );

  protected readonly gridClass = computed(() =>
    this.viewMode() === 'grid'
      ? 'grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'
      : 'flex flex-col gap-3',
  );

  // Loading skeleton array — fixed size, no state needed
  protected readonly loadingSkeletons = Array.from({ length: 10 }, (_, i) => i);

  // Sentinel element for IntersectionObserver
  private readonly sentinelRef = viewChild<ElementRef<HTMLElement>>('sentinel');

  constructor() {
    // Initial load
    this.store.dispatch(PokemonActions.loadMore());

    /**
     * Bridge: WritableSignal → Observable → debounce → NgRx dispatch.
     * toObservable() turns the signal into a cold RxJS stream.
     * takeUntilDestroyed() auto-completes when the component is destroyed.
     */
    toObservable(this.searchQuery)
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe((query) => this.store.dispatch(PokemonActions.setSearchQuery({ query })));

    /**
     * afterNextRender(): runs once after the first render cycle.
     * Required for any code that touches the DOM (like IntersectionObserver).
     * This is the zoneless-safe alternative to ngAfterViewInit.
     */
    afterNextRender(() => {
      const sentinel = this.sentinelRef()?.nativeElement;
      if (!sentinel) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && this.hasMore() && !this.loading()) {
            this.store.dispatch(PokemonActions.loadMore());
          }
        },
        { rootMargin: '300px' },
      );

      observer.observe(sentinel);
      // DestroyRef.onDestroy is the injected equivalent of ngOnDestroy
      this.destroyRef.onDestroy(() => observer.disconnect());
    });
  }

  protected setTypeFilter(type: string): void {
    this.typeFilter.set(type);
  }

  protected toggleViewMode(): void {
    this.viewMode.update((m) => (m === 'grid' ? 'list' : 'grid'));
  }

  protected toggleFavorite(id: number): void {
    this.favoritesStore.toggle(id);
  }
}
