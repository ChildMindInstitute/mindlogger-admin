import { renderHook } from '@testing-library/react';

import { applet } from 'shared/state';
import { ErrorResponseType } from 'shared/types';

import { useCheckIfAppletHasNotFoundError } from './useCheckIfAppletHasNotFoundError';

const spyUseResponseError: jest.SpyInstance = vi.spyOn(applet, 'useResponseError');

describe('useCheckIfAppletHasNotFoundError', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test.each`
    responseErrors                            | expected | description
    ${undefined}                              | ${false} | ${'returns false if useResponseError(): undefined'}
    ${[]}                                     | ${false} | ${'returns false if useResponseError(): []'}
    ${[{ type: ErrorResponseType.NotFound }]} | ${true}  | ${'returns true if there is an applet with not found error'}
    ${[{ type: '' }]}                         | ${false} | ${'returns false if there is an applet with error differs from not found error'}
  `('$description', ({ responseErrors, expected }) => {
    spyUseResponseError.mockReturnValueOnce(responseErrors);

    const { result } = renderHook(useCheckIfAppletHasNotFoundError);

    expect(result.current).toBe(expected);
  });
});
