// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { renderHook } from '@testing-library/react';

import { getErrorData, getErrorMessage } from 'shared/utils';

import { useFormError } from './AddUserForm.hooks';
import { Fields } from './AddUserForm.const';

jest.mock('shared/utils', () => ({
  getErrorData: jest.fn(),
  getErrorMessage: jest.fn(),
}));

describe('useFormError', () => {
  const setError = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should return false when there is no error', () => {
    const { result } = renderHook(() => useFormError({ error: null, setError }));

    expect(result.current).toBe(false);
  });

  test('should return true and not set error for common error', () => {
    const error = { message: 'Common error' };
    getErrorData.mockReturnValue({ path: null });

    const { result } = renderHook(() => useFormError({ error, setError }));

    expect(result.current).toBe(true);
    expect(setError).not.toHaveBeenCalled();
  });

  test('should return true for unknown field error', () => {
    const error = { message: 'Unknown field error' };
    getErrorData.mockReturnValue({ path: ['unknownField'] });

    const { result } = renderHook(() => useFormError({ error, setError }));

    expect(result.current).toBe(true);
    expect(setError).not.toHaveBeenCalled();
  });

  test('should set field error and return false for known field error', () => {
    const error = { message: 'Field error' };
    const fieldName = 'knownField';
    const errorMessage = 'Error message';
    Fields[fieldName] = true;
    getErrorData.mockReturnValue({ path: [fieldName] });
    getErrorMessage.mockReturnValue(errorMessage);

    const { result } = renderHook(() => useFormError({ error, setError }));

    expect(result.current).toBe(false);
    expect(setError).toHaveBeenCalledWith(fieldName, { message: errorMessage });
  });
});
