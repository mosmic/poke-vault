import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home').then((m) => m.Home),
  },
  {
    path: 'pokemon',
    loadComponent: () => import('./features/pokemon-list/pokemon-list').then((m) => m.PokemonList),
  },
  {
    path: 'pokemon/:id',
    loadComponent: () =>
      import('./features/pokemon-detail/pokemon-detail').then((m) => m.PokemonDetail),
  },
  {
    path: 'favorites',
    loadComponent: () => import('./features/favorites/favorites').then((m) => m.Favorites),
  },
  {
    path: 'team',
    loadComponent: () => import('./features/team-builder/team-builder').then((m) => m.TeamBuilder),
  },
  {
    path: 'compare',
    loadComponent: () => import('./features/compare/compare').then((m) => m.Compare),
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard').then((m) => m.Dashboard),
  },
  {
    path: '**',
    loadComponent: () => import('./features/not-found/not-found').then((m) => m.NotFound),
  },
];
