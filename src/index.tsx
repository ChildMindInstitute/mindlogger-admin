import React from 'react';
import ReactDOM from 'react-dom/client';
import * as Sentry from '@sentry/react';
import { asyncWithLDProvider } from 'launchdarkly-react-client-sdk';
import { datadogRum } from '@datadog/browser-rum';

import { Mixpanel } from 'shared/utils/mixpanel';

import App from './App';
import './i18n';
import reportWebVitals from './reportWebVitals';
import { isUat } from './shared/utils/env';

if (isUat) {
  datadogRum.init({
    applicationId: `${process.env.REACT_APP_DD_APP_ID}`,
    clientToken: `${process.env.REACT_APP_DD_CLIENT_TOKEN}`,
    // `site` refers to the Datadog site parameter of your organization
    // see https://docs.datadoghq.com/getting_started/site/
    site: 'datadoghq.com',
    service: 'mindlogger-admin',
    env: 'uat',
    // Specify a version number to identify the deployed version of your application in Datadog
    // version: '1.0.0',
    sessionSampleRate: 100,
    sessionReplaySampleRate: 0,
    defaultPrivacyLevel: 'mask-user-input',
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
