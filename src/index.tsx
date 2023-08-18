import React from 'react';
import ReactDOM from 'react-dom/client';
import { Mixpanel } from 'shared/utils';

import svgBuilder from 'shared/utils/svgBuilder';

import { svgSprite } from 'svgSprite';
import App from './App';
import './i18n';
import reportWebVitals from './reportWebVitals';

document.body.appendChild(svgBuilder(svgSprite));

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

Mixpanel.init();

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

reportWebVitals();
