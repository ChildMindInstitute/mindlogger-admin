import React from 'react';
import ReactDOM from 'react-dom/client';
import { asyncWithLDProvider } from 'launchdarkly-react-client-sdk';
import { datadogRum } from '@datadog/browser-rum';
import { datadogLogs } from '@datadog/browser-logs';

import { Mixpanel } from 'shared/utils/mixpanel';

import App from './App';
import './i18n';
import reportWebVitals from './reportWebVitals';
import { isUat, isProduction } from './shared/utils/env';

if (process.env.REACT_APP_DD_CLIENT_TOKEN) {
  datadogLogs.init({
    clientToken: process.env.REACT_APP_DD_CLIENT_TOKEN,
    site: 'datadoghq.com',
    forwardErrorsToLogs: true,
    sessionSampleRate: 100,
    service: 'mindlogger-admin',
    env: process.env.REACT_APP_ENV,
    version: process.env.REACT_APP_DD_VERSION,
  });
}

if (
  process.env.REACT_APP_DD_APP_ID &&
  process.env.REACT_APP_DD_CLIENT_TOKEN &&
  (isUat || isProduction || true)
) {
  datadogRum.init({
    applicationId: process.env.REACT_APP_DD_APP_ID,
    clientToken: process.env.REACT_APP_DD_CLIENT_TOKEN,
    // `site` refers to the Datadog site parameter of your organization
    // see https://docs.datadoghq.com/getting_started/site/
    site: 'datadoghq.com',
    service: 'mindlogger-admin',
    env: process.env.REACT_APP_ENV,
    // Specify a version number to identify the deployed version of your application in Datadog
    version: process.env.REACT_APP_DD_VERSION,
    sessionSampleRate: 100,
    sessionReplaySampleRate: 0,
    defaultPrivacyLevel: 'mask-user-input',
    trackResources: true,
    trackLongTasks: true,
    trackUserInteractions: false,
    allowedTracingUrls: [
      (url) => url.indexOf('cmiml.net') > -1,
      (url) => url.indexOf('gettingcurious.com') > -1,
    ],
  });
}


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
