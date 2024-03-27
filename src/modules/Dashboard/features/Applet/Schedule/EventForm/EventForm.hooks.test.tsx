import { renderHook } from '@testing-library/react';

import { useNextDayLabel } from './EventForm.hooks';

describe('useNextDayLabel', () => {
  test.each([
    ['00:00', '23:59', false],
    ['18:00', '18:00', false],
    ['18:00', '08:00', true],
  ])('when startTime is %s and endTime is %s should return %s ', (startTime, endTime, expected) => {
    const { result } = renderHook(() => useNextDayLabel({ startTime, endTime }));
    expect(result.current).toBe(expected);
  });
});
