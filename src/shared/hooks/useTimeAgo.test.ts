import { renderHook } from '@testing-library/react';

import { useTimeAgo } from './useTimeAgo';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    i18n: {
      changeLanguage: () => new Promise(() => {}),
      language: 'en',
    },
  }),
  initReactI18next: {
    type: '3rdParty',
    init: () => {},
  },
}));

describe('useTimeAgo hook tests', () => {
  test('timeAgo locale should be "en"', () => {
    const { result } = renderHook(() => useTimeAgo());

    expect(result.current.locale).toBe('en');
  });
});
