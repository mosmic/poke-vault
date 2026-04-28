import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { ThemeToggle } from '../theme-toggle/theme-toggle';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';

interface NavLink {
  readonly label: string;
  readonly path: string;
  readonly icon: string;
}

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, ThemeToggle],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Navbar {
  private readonly router = inject(Router);

  protected readonly links: NavLink[] = [
    { label: 'Explorer', path: '/pokemon', icon: '🔍' },
    { label: 'Favorites', path: '/favorites', icon: '❤️' },
    { label: 'Team', path: '/team', icon: '⚔️' },
    { label: 'Compare', path: '/compare', icon: '⚖️' },
    { label: 'Dashboard', path: '/dashboard', icon: '📊' },
  ];

  protected readonly currentUrl = toSignal(
    this.router.events.pipe(
      // Filter for NavigationEnd events to get the current URL after navigation
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map((event) => event.urlAfterRedirects),
    ),
    { initialValue: this.router.url },
  );

  protected isActive(path: string): boolean {
    return this.currentUrl()?.startsWith(path) ?? false;
  }
}
