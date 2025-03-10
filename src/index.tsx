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

if (import.meta.env.REACT_APP_DD_CLIENT_TOKEN) {
  datadogLogs.init({
    clientToken: import.meta.env.REACT_APP_DD_CLIENT_TOKEN as string,
    site: 'datadoghq.com',
    forwardErrorsToLogs: true,
    sessionSampleRate: 100,
    service: 'mindlogger-admin',
    env: import.meta.env.REACT_APP_ENV,
    version: import.meta.env.REACT_APP_DD_VERSION,
  });
}

if (
  import.meta.env.REACT_APP_DD_APP_ID &&
  import.meta.env.REACT_APP_DD_CLIENT_TOKEN &&
  (isDev || isProduction)
) {
  datadogRum.init({
    applicationId: import.meta.env.REACT_APP_DD_APP_ID as string,
    clientToken: import.meta.env.REACT_APP_DD_CLIENT_TOKEN as string,
    // `site` refers to the Datadog site parameter of your organization
    // see https://docs.datadoghq.com/getting_started/site/
    site: 'datadoghq.com',
    service: 'mindlogger-admin',
    env: import.meta.env.REACT_APP_ENV,
    // Specify a version number to identify the deployed version of your application in Datadog
    version: import.meta.env.REACT_APP_DD_VERSION,
    sessionSampleRate: 100,
    sessionReplaySampleRate: 0,
    defaultPrivacyLevel: 'mask',
    trackResources: true,
    trackLongTasks: true,
    trackUserInteractions: false,
    allowedTracingUrls: (import.meta.env.REACT_APP_DD_TRACING_URLS as string)
      .split(',')
      .map((it: string) => it.trim()),
  });
}

Sentry.init({
  dsn: import.meta.env.REACT_APP_DSN || '',
  integrations: [
    Sentry.browserTracingIntegration({
      tracePropagationTargets: import.meta.env.REACT_APP_TRACE_PROPAGATION_TARGETS
        ? JSON.parse(import.meta.env.REACT_APP_TRACE_PROPAGATION_TARGETS as string)
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

Mixpanel.init();

// Initialize LaunchDarkly and render the app
const initApp = async () => {
  try {
    const LDProvider = await asyncWithLDProvider({
      clientSideID: import.meta.env.REACT_APP_LAUNCHDARKLY_CLIENT_ID || '',
    });

    root.render(
      <React.StrictMode>
        <LDProvider>
          <App />
        </LDProvider>
      </React.StrictMode>,
    );
  } catch (error) {
    console.error('Failed to initialize LaunchDarkly:', error);
    // Render app without LaunchDarkly in case of initialization failure
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>,
    );
  }
};

// Start the application
initApp();

reportWebVitals();
