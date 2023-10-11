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
    const today = new Date();
    const yesterday = new Date(add(today, { days: -1 }));
    const tomorrow = new Date(add(today, { days: 1 }));

    expect(result.current.format(yesterday)).toBe('1 day ago');
    expect(result.current.format(today)).toBe('just now');
    expect(result.current.format(tomorrow)).toBe('in 1 day');
  });
});
