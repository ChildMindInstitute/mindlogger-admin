import React from 'react';
import ReactDOM from 'react-dom/client';
import * as Sentry from '@sentry/react';
import { asyncWithLDProvider } from 'launchdarkly-react-client-sdk';
import { datadogRum } from '@datadog/browser-rum';
import { datadogLogs } from '@datadog/browser-logs';

import { Mixpanel } from 'shared/utils/mixpanel';

import App from './App';
import './i18n';
import reportWebVitals from './reportWebVitals';
import { isDev, isProduction } from './shared/utils/env';

datadogLogs.init({
  clientToken: process.env.REACT_APP_DD_CLIENT_TOKEN as string,
  site: 'datadoghq.com',
  forwardErrorsToLogs: true,
  sessionSampleRate: 100,
  service: 'mindlogger-admin',
  env: process.env.REACT_APP_ENV,
  version: process.env.REACT_APP_DD_VERSION,
});

if (isDev || isProduction) {
  datadogRum.init({
    applicationId: process.env.REACT_APP_DD_APP_ID as string,
    clientToken: process.env.REACT_APP_DD_CLIENT_TOKEN as string,
    // `site` refers to the Datadog site parameter of your organization
    // see https://docs.datadoghq.com/getting_started/site/
    site: 'datadoghq.com',
    service: 'mindlogger-admin',
    env: process.env.REACT_APP_ENV,
    // Specify a version number to identify the deployed version of your application in Datadog
    version: process.env.REACT_APP_DD_VERSION,
    sessionSampleRate: 100,
    sessionReplaySampleRate: 20,
    defaultPrivacyLevel: 'mask',
    trackResources: true,
    trackLongTasks: true,
    trackUserInteractions: false,
    allowedTracingUrls: (process.env.REACT_APP_DD_TRACING_URLS as string)
      .split(',')
      .map((it: string) => it.trim()),
  });
}

Sentry.init({
  dsn: process.env.REACT_APP_DSN || '',
  integrations: [
    Sentry.browserTracingIntegration({
      tracePropagationTargets: process.env.REACT_APP_TRACE_PROPAGATION_TARGETS
        ? JSON.parse(process.env.REACT_APP_TRACE_PROPAGATION_TARGETS)
        : [],
    }),
    Sentry.replayIntegration({
      maskAllText: false,
      blockAllMedia: false,
    }),
  ],
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

const LDProvider = await asyncWithLDProvider({
  clientSideID: process.env.REACT_APP_LAUNCHDARKLY_CLIENT_ID || '',
});

Mixpanel.init();

root.render(
  <React.StrictMode>
    <LDProvider>
      <App />
    </LDProvider>
  </React.StrictMode>,
);

reportWebVitals();
