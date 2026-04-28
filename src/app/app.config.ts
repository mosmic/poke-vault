import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import {
  NoPreloading,
  provideRouter,
  withComponentInputBinding,
  withPreloading,
  withViewTransitions,
} from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { PokemonEffects, pokemonReducer } from './state/pokemon';
import { provideEffects } from '@ngrx/effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(
      routes,
      withComponentInputBinding(), // route :id param binds to input() directly
      withViewTransitions(),
      withPreloading(NoPreloading),
    ),
    provideHttpClient(
      withFetch(), // uses fetch() instead of XHR — better for SSR
      withInterceptors([]),
    ),
    provideStore({ pokemon: pokemonReducer }),
    provideEffects(PokemonEffects),
  ],
};
