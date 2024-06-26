import React from 'react';
import ReactDOM from 'react-dom/client';
import * as Sentry from '@sentry/react';
import { asyncWithLDProvider } from 'launchdarkly-react-client-sdk';

import { Mixpanel } from 'shared/utils/mixpanel';

import App from './App';
import './i18n';
import reportWebVitals from './reportWebVitals';

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
