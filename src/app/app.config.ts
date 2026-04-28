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
  ],
};
