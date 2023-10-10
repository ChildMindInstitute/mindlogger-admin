import { ChangeEvent } from 'react';
import { useFormContext } from 'react-hook-form';

import { getMaxLengthValidationError } from 'shared/utils';

export const useFieldLengthError = () => {
  const { setValue, setError, clearErrors } = useFormContext();

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
