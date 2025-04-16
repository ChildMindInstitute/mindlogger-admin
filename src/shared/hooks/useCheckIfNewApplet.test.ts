import { renderHook } from '@testing-library/react';
import * as routerDom from 'react-router-dom';

import { useCheckIfNewApplet } from './useCheckIfNewApplet';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: vi.fn(),
}));

describe('useCheckIfNewApplet hook tests', () => {
  test('should return false', () => {
    jest.spyOn(routerDom, 'useParams').mockReturnValue({ appletId: 'new-applet' });
    const { result } = renderHook(useCheckIfNewApplet);

    expect(result.current).toBeTruthy();
  });

  test('should return true', () => {
    jest.spyOn(routerDom, 'useParams').mockReturnValue({ appletId: 'mockAppletId' });
    const { result } = renderHook(useCheckIfNewApplet);

    expect(result.current).toBeFalsy();
  });
});
