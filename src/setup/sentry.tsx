import { CaptureConsole, HttpClient } from "@sentry/integrations";
import * as Sentry from "@sentry/react";

import { conf } from "@/setup/config";
import { SENTRY_DSN } from "@/setup/constants";

Sentry.init({
  dsn: SENTRY_DSN,
  release: `movie-web@${conf().APP_VERSION}`,
  sampleRate: 0.5,
  integrations: [
    new Sentry.BrowserTracing(),
    new CaptureConsole(),
    new HttpClient(),
  ],
});
