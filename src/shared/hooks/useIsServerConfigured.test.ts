import { renderHook } from '@testing-library/react';

import { SingleApplet, applet } from 'shared/state';

import { useIsServerConfigured } from './useIsServerConfigured';

describe('useIsServerConfigured hook tests', () => {
  test('should return false', () => {
    vi.spyOn(applet, 'useAppletData').mockReturnValue(null);
    const { result } = renderHook(() => useIsServerConfigured());

    expect(result.current).toBeFalsy();
  });

  test('should return true', () => {
    vi.spyOn(applet, 'useAppletData').mockReturnValue({
      result: {
        reportServerIp: 'mockReportServerIp',
        reportPublicKey: 'mockReportPublicKey',
      } as SingleApplet,
    });
    const { result } = renderHook(() => useIsServerConfigured());

    expect(result.current).toBeTruthy();
  });
});
