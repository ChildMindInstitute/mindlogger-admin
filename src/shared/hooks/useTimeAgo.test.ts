import { add } from 'date-fns';
import { renderHook } from '@testing-library/react';

import { mockI18Next } from 'shared/tests';

import { useTimeAgo } from './useTimeAgo';

vi.mock('react-i18next', () => mockI18Next);

describe('useTimeAgo hook tests', () => {
  test('should format date', () => {
    const { result } = renderHook(() => useTimeAgo());
    const today = new Date();
    const yesterday = new Date(add(today, { days: -1 }));
    const tomorrow = new Date(add(today, { days: 1 }));

    expect(result.current.format(yesterday)).toBe('1 day ago');
    expect(result.current.format(today)).toBe('just now');
    expect(result.current.format(tomorrow)).toBe('in 1 day');
  });
});
