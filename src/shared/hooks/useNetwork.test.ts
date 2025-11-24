import { act, fireEvent, renderHook } from '@testing-library/react';

import { useNetwork } from './useNetwork';

const spyNavigatorOnline = vi.spyOn(window.navigator, 'onLine', 'get');

describe('useNetwork', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test.each`
    onLine   | expected | description
    ${true}  | ${true}  | ${'default value "true" if navigator online'}
    ${false} | ${false} | ${'default value "false" if navigator offline'}
  `('$description', ({ onLine, expected }) => {
    spyNavigatorOnline.mockReturnValueOnce(onLine);
    const { result } = renderHook(useNetwork);

    expect(result.current).toBe(expected);
  });

  test.each`
    onLine   | expected | description
    ${true}  | ${false} | ${'changes value if offline listener was triggered'}
    ${false} | ${true}  | ${'changes value if online listener was triggered'}
  `('$description', ({ onLine, expected }) => {
    spyNavigatorOnline.mockReturnValueOnce(onLine);
    const { result } = renderHook(useNetwork);

    act(() => {
      spyNavigatorOnline.mockReturnValueOnce(!onLine);
      fireEvent.offline(window);
    });

    expect(result.current).toBe(expected);
  });
});
