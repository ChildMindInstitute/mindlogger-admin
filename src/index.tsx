import React from 'react';
import ReactDOM from 'react-dom/client';

// todo: add after Mixpanel token is received - M2-3000
// import { Mixpanel } from 'shared/utils';
import svgBuilder from 'shared/utils/svgBuilder';
import { svgSprite } from 'svgSprite';

import App from './App';
import './i18n';
import reportWebVitals from './reportWebVitals';

document.body.appendChild(svgBuilder(svgSprite));

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

// todo: add after Mixpanel token is received - M2-3000
// Mixpanel.init();

root.render(
  // <React.StrictMode>
  <App />,
  // </React.StrictMode>,
);

reportWebVitals();
