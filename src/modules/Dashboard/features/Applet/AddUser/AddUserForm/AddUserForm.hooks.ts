import { useState, useEffect } from 'react';
import { FieldValues, UseFormSetError } from 'react-hook-form';

import { getErrorData, getErrorMessage } from 'shared/utils';

import { Fields } from './AddUserForm.const';

export const useFormError = <T extends FieldValues>({
  error,
  setError,
}: {
  error: unknown | null;
  setError: UseFormSetError<T>;
}) => {
  const [hasCommonError, setHasCommonError] = useState(false);

  useEffect(() => {
    if (!error) return setHasCommonError(false);

    const errorData = getErrorData(error);
    const fieldName = errorData?.path?.at?.(-1) as keyof typeof Fields;

    if (!fieldName || (fieldName && !Fields[fieldName])) return setHasCommonError(true);

    setError(fieldName, { message: getErrorMessage(error) });
  }, [error]);

  return hasCommonError;
};
