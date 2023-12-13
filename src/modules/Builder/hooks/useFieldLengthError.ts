import { ChangeEvent } from 'react';

import { getMaxLengthValidationError } from 'shared/utils';

import { useCustomFormContext } from './useCustomFormContext';

export const useFieldLengthError = () => {
  const { setValue, setError, clearErrors } = useCustomFormContext();

  return ({
    event,
    fieldName,
    maxLength,
  }: {
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;
    fieldName: string;
    maxLength: number;
  }) => {
    const value = event.target.value;
    setValue(fieldName, value);
    if (value.length > maxLength) {
      return setError(fieldName, {
        message: getMaxLengthValidationError({ max: maxLength }),
      });
    }

    return clearErrors(fieldName);
  };
};
