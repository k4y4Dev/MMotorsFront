import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import * as Sentry from '@sentry/angular';

Sentry.init({
  dsn: "https://b12c32e9cb23dc93d55815e9e7d4984d@o4511583519244288.ingest.de.sentry.io/4511583558369360",
  dataCollection: {
    // To disable sending user data and HTTP bodies, uncomment the lines below. For more info visit:
    // https://docs.sentry.io/platforms/javascript/guides/angular/configuration/options/#dataCollection
    // userInfo: false,
    // httpBodies: []
  }
});

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
