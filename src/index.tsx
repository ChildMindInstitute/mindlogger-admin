import React from 'react';
import ReactDOM from 'react-dom/client';
import { asyncWithLDProvider } from 'launchdarkly-react-client-sdk';

import { Mixpanel } from 'shared/utils/mixpanel';

import App from './App';
import './i18n';
import reportWebVitals from './reportWebVitals';

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
