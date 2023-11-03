export const mockI18Next = {
  useTranslation: () => ({
    i18n: {
      changeLanguage: () => new Promise(() => {}),
      language: 'en',
    },
    t: () => {},
  }),
  initReactI18next: {
    type: '3rdParty',
    init: () => {},
  },
};
