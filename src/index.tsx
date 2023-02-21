import React from 'react';
import ReactDOM from 'react-dom/client';

import svgBuilder from 'utils/svgBuilder';

import { svgSprite } from 'svgSprite';
import App from './App';
import './i18n';
import reportWebVitals from './reportWebVitals';

document.body.appendChild(svgBuilder(svgSprite));

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

reportWebVitals();
