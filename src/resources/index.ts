import { Resource } from 'i18next';

export const resources: Resource = {
  en: {
    translation: { notUse: 'not-used' },
    app: await import('./app-en.json'),
  },
  fr: {
    translation: { notUse: 'not-used' },
    app: await import('./app-fr.json'),
  },
};

export { default as page } from './pages.json';
