import React from 'react';
import ReactDOM from 'react-dom/client';
import { asyncWithLDProvider } from 'launchdarkly-react-client-sdk';
import { datadogRum, RumEvent } from '@datadog/browser-rum';
import { datadogLogs } from '@datadog/browser-logs';

import { Mixpanel } from 'shared/utils/mixpanel';

import App from './App';
import './i18n';
import reportWebVitals from './reportWebVitals';
import { isUat, isProduction } from './shared/utils/env';

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
  (isUat || isProduction || true)
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
    defaultPrivacyLevel: 'mask-user-input',
    trackResources: true,
    trackLongTasks: false,
    trackUserInteractions: false,
    allowedTracingUrls: [
      (url) => url.indexOf('api-uat.cmiml.net') > -1,
      (url) => url.indexOf('api-v2.gettingcurious.com') > -1,
    ],
    beforeSend: (event: RumEvent) => {
      // Do not instrument S3 calls, especially for exports.
      if (event.type === 'resource' && event.resource.url.indexOf('s3.amazonaws.com') > -1) {
        return false;
      }

      return true;
    },
  });
}

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

Mixpanel.init();

(async () => {
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
})();

reportWebVitals();
