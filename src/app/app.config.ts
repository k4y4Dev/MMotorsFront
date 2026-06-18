import { ApplicationConfig, ErrorHandler, inject, provideAppInitializer, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, Router, withComponentInputBinding } from '@angular/router';
import * as Sentry from '@sentry/angular';

import { routes } from './app.routes';
import { AuthService } from './_services/auth-service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding()),
    provideAppInitializer(() => inject(AuthService).checkAuthStatus()),
        {
      provide: ErrorHandler,
      useValue: Sentry.createErrorHandler(),
    },
        {
      provide: Sentry.TraceService,
      deps: [Router],
    },
      {
      provide: provideAppInitializer,
      useFactory: () => () => {},
      deps: [Sentry.TraceService],
      multi: true,
    },

  ]
};
