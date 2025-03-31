import { Dispatch, ReactNode, SetStateAction, useEffect } from 'react';
import { FieldValues, Path, UseFormSetError } from 'react-hook-form';
import { AxiosError } from 'axios';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { SerializedError } from '@reduxjs/toolkit';

import { ApiError, ApiErrorResponse } from 'shared/state';
import { getErrorData, getErrorMessage } from 'shared/utils';

type UseFormError<T extends FieldValues> = {
  error?: AxiosError<ApiErrorResponse> | FetchBaseQueryError | SerializedError | null;
  setError: UseFormSetError<T>;
  setHasCommonError: Dispatch<SetStateAction<boolean>>;
  fields: Record<string, string>;
  customFieldErrors?: {
    fieldName: string;
    apiMessage: string;
    errorMessage: string | ReactNode;
  }[];
};

export const useFormError = <T extends FieldValues>({
  error,
  setError,
  setHasCommonError,
  fields,
  customFieldErrors,
}: UseFormError<T>) => {
  useEffect(() => {
    if (!error) return setHasCommonError(false);

    const errorData: ApiError = getErrorData(error);
    const fieldName = errorData?.path?.at?.(-1) as Path<T>;

    if (!fieldName || (fieldName && !fields[fieldName as keyof typeof fields])) {
      return setHasCommonError(true);
    }

    const errorMessage = getErrorMessage(error);
    const getMessage = () => {
      if (!customFieldErrors) return errorMessage;

      for (const customFieldError of customFieldErrors) {
        if (
          fieldName === customFieldError.fieldName &&
          errorMessage === customFieldError.apiMessage
        ) {
          return customFieldError.errorMessage;
        }
      }

      return errorMessage;
    };

    setError(fieldName, { message: getMessage() });
  }, [error]);
};
