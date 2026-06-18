import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import * as Sentry from '@sentry/angular';

Sentry.init({
  dsn: "https://b12c32e9cb23dc93d55815e9e7d4984d@o4511583519244288.ingest.de.sentry.io/4511583558369360",
  environment: 'production',
  integrations: [
    Sentry.browserTracingIntegration(),  // suivi des performances
    Sentry.replayIntegration(),          // replay des sessions (optionnel)
  ],
  tracesSampleRate: 0.2,   // réduire à 0.2 en prod
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
