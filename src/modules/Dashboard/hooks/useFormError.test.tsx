// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { renderHook } from '@testing-library/react';

import { useFormError } from './useFormError';

const setHasCommonError = vi.fn();
const setError = vi.fn();
const commonProps = { setError, setHasCommonError };
const fieldName = 'email';
const mockedApiErrorMessage = 'some message';
const mockedErrorMessage = 'another message';
const mockedErrorComponent = <div>error component </div>;

class CustomError extends Error {
  constructor(message: string) {
    super(message);
    this.isAxiosError = true;
    this.response = {
      data: {
        result: [
          {
            type: 'SOME_TYPE',
            path: [fieldName],
            message,
          },
        ],
      },
    };
  }
}

const mockedError = new CustomError(mockedApiErrorMessage);

describe('useFormError', () => {
  test('should set hasCommonError to false when there is no error', () => {
    renderHook(() => useFormError({ ...commonProps, error: null, fields: {} }));

    expect(setHasCommonError).toHaveBeenCalledWith(false);
    expect(setError).not.toHaveBeenCalled();
  });

  test('should set hasCommonError to true when there is an error and no matching field', () => {
    const fields = { secretId: 'some-id' };
    renderHook(() => useFormError({ ...commonProps, error: mockedError, fields }));

    expect(setHasCommonError).toHaveBeenCalledWith(true);
    expect(setError).not.toHaveBeenCalled();
  });

  test('should set field error when there is an error and matching field', () => {
    const fields = { email: 'email' };

    renderHook(() => useFormError({ ...commonProps, error: mockedError, fields }));

    expect(setHasCommonError).not.toHaveBeenCalled();
    expect(setError).toHaveBeenCalledWith('email', { message: mockedApiErrorMessage });
  });

  test('should set field error with custom message', () => {
    const fields = { email: 'email' };
    const customFieldErrors = [
      {
        fieldName,
        apiMessage: mockedApiErrorMessage,
        errorMessage: mockedErrorMessage,
      },
    ];

    renderHook(() =>
      useFormError({ ...commonProps, error: mockedError, fields, customFieldErrors }),
    );

    expect(setHasCommonError).not.toHaveBeenCalled();
    expect(setError).toHaveBeenCalledWith('email', { message: mockedErrorMessage });
  });

  test('should set field error with custom error component', () => {
    const fields = { email: 'email' };
    const customFieldErrors = [
      {
        fieldName,
        apiMessage: mockedApiErrorMessage,
        errorMessage: mockedErrorComponent,
      },
    ];

    renderHook(() =>
      useFormError({ ...commonProps, error: mockedError, fields, customFieldErrors }),
    );

    expect(setHasCommonError).not.toHaveBeenCalled();
    expect(setError).toHaveBeenCalledWith('email', { message: mockedErrorComponent });
  });
});
