import { useState, useEffect } from 'react';

import { FieldValues, Path } from 'react-hook-form';

import { ApiError } from 'shared/state';
import { getErrorData, getErrorMessage } from 'shared/utils';

import { Fields } from './AddUserForm.const';
import { UseFormError } from './AddUserForm.types';

export const useFormError = <T extends FieldValues>({ error, setError }: UseFormError<T>) => {
  const [hasCommonError, setHasCommonError] = useState(false);

  useEffect(() => {
    if (!error) return setHasCommonError(false);

    const errorData: ApiError = getErrorData(error);
    const fieldName = errorData?.path?.at?.(-1) as Path<T>;

    if (!fieldName || (fieldName && !Fields[fieldName as keyof typeof Fields])) return setHasCommonError(true);

    setError(fieldName, { message: getErrorMessage(error) });
  }, [error]);

  return hasCommonError;
};
