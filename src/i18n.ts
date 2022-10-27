import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

import { resources } from 'resources';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    supportedLngs: ['en', 'fr'],
    detection: {
      order: ['navigator'],
    },

    // TODO: add the ability to define the language
    // and take the already saved language as well
    // from the route (as was done in the vue project), store, localStorage - clarifications are needed.

    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
