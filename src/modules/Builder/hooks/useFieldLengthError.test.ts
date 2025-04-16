import { renderHook } from '@testing-library/react';

import { getMaxLengthValidationError } from 'shared/utils';

import { useFieldLengthError } from './useFieldLengthError';

const mockedFieldName = 'fieldName';
const mockedMaxLength = 10;
const mockedLessValue = 'lessvalue';
const mockedEqualValue = 'equalvalue';
const mockedExceededValue = 'exceededvalue';

const mockedSetErrorObj = {
  message: getMaxLengthValidationError({ max: mockedMaxLength }),
};

const mockedSetValue = vi.fn();
const mockedSetError = vi.fn();
const mockedClearErrors = vi.fn();

jest.mock('react-hook-form', () => ({
  useFormContext: () => ({
    setValue: mockedSetValue,
    setError: mockedSetError,
    clearErrors: mockedClearErrors,
  }),
}));

describe('useFieldLengthError', () => {
  test.each`
    value                  | expected                                | description
    ${mockedLessValue}     | ${undefined}                            | ${'error is not set for value with length less than max'}
    ${mockedEqualValue}    | ${undefined}                            | ${'error is not set for value with length equals to max'}
    ${mockedExceededValue} | ${[mockedFieldName, mockedSetErrorObj]} | ${'error is set for value with length exceeds max'}
  `('$description', ({ value, expected }) => {
    const { result } = renderHook(useFieldLengthError);

    result.current({
      //eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      event: { target: { value } },
      fieldName: mockedFieldName,
      maxLength: mockedMaxLength,
    });

    expect(mockedSetValue).toBeCalledWith(mockedFieldName, value, { shouldDirty: true });

    expected
      ? expect(mockedSetError).toBeCalledWith(...expected)
      : expect(mockedClearErrors).toBeCalledWith(mockedFieldName);
  });
});
