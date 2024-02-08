import React from 'react';

import ReactDOM from 'react-dom/client';

import { Mixpanel } from 'shared/utils/mixpanel';

import App from './App';
import './i18n';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

Mixpanel.init();

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

reportWebVitals();
