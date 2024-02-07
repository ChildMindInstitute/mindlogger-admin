import { act, renderHook } from '@testing-library/react';

import { useWindowFocus } from './useWindowFocus';

const fireFocusEvent = () => {
  global.window.dispatchEvent(new Event('focus'));
};

const fireBlurEvent = () => {
  global.window.dispatchEvent(new Event('blur'));
};

describe('useWindowFocus)', () => {
  test('should default to false', () => {
    const { result } = renderHook(() => useWindowFocus());

    expect(result.current).toBe(false);
  });

  test('should be true after focus event', () => {
    const { result } = renderHook(() => useWindowFocus());

    act(() => {
      fireFocusEvent();
    });

    expect(result.current).toBe(true);
  });

  test('should be false after blur event', () => {
    const { result } = renderHook(() => useWindowFocus());

    act(() => {
      fireFocusEvent();
    });

    expect(result.current).toBe(true);

    act(() => {
      fireBlurEvent();
    });

    expect(result.current).toBe(false);
  });
});
