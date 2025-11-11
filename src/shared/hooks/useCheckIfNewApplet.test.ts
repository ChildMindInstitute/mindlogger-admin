import { renderHook } from '@testing-library/react';
import * as routerDom from 'react-router-dom';

import { useCheckIfNewApplet } from './useCheckIfNewApplet';

vi.mock('react-router-dom', async () => {
  // pull in the real implementation
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');

  return {
    ...actual,
    useParams: () => vi.fn(),
  };
});

describe('useCheckIfNewApplet hook tests', () => {
  test('should return false', () => {
    vi.spyOn(routerDom, 'useParams').mockReturnValue({ appletId: 'new-applet' });
    const { result } = renderHook(useCheckIfNewApplet);

    expect(result.current).toBeTruthy();
  });

  test('should return true', () => {
    vi.spyOn(routerDom, 'useParams').mockReturnValue({ appletId: 'mockAppletId' });
    const { result } = renderHook(useCheckIfNewApplet);

    expect(result.current).toBeFalsy();
  });
});
