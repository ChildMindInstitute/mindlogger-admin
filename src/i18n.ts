import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

import { resources } from 'resources';

i18next
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    supportedLngs: ['en', 'fr'],
    ns: ['app'],
    defaultNS: 'app',
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

export default i18next;
