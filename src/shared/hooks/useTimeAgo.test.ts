import { add } from 'date-fns';
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
  test('useTimeAgo should format date', () => {
    const { result } = renderHook(() => useTimeAgo());
    const yesterdayDate = new Date(add(new Date(), { days: -1 }));

    expect(result.current.format(yesterdayDate)).toBe('1 day ago');
  });
});
