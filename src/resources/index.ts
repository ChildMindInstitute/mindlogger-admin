import { Resource } from 'i18next';

import appEn from './app-en.json';
import appFr from './app-fr.json';

export const resources: Resource = {
  en: {
    translation: { notUse: 'not-used' },
    app: appEn,
  },
  fr: {
    translation: { notUse: 'not-used' },
    app: appFr,
  },
};

export { default as page } from './pages';
