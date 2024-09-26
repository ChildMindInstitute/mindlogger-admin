import { useCallback, useState } from 'react';
import { AxiosError, AxiosResponse } from 'axios';

import { ApiErrorResponse } from 'shared/state/Base';

import {
  ErrorCallback,
  FinallyCallback,
  optionsIsObjectTypeGuard,
  SuccessCallback,
  UseAsyncOptions,
} from './useAsync.types';

export const useAsync = <T, K>(
  asyncFunction: (args: T) => Promise<AxiosResponse<K>>,
  ...options: UseAsyncOptions<T, K>
) => {
  let successCallback: SuccessCallback<T, K> | undefined;
  let errorCallback: ErrorCallback<T> | undefined;
  let finallyCallback: FinallyCallback<T> | undefined;
  let retainValue = false;

  // Support both array-based and object-based options
  if (optionsIsObjectTypeGuard(options)) {
    const opts = options[0];
    successCallback = opts.successCallback;
    errorCallback = opts.errorCallback;
    finallyCallback = opts.finallyCallback;
    retainValue = opts.retainValue ?? false;
  } else {
    [successCallback, errorCallback, finallyCallback] = options;
  }

  const [value, setValue] = useState<AxiosResponse<K> | null>(null);
  const [error, setError] = useState<AxiosError<ApiErrorResponse> | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const execute = useCallback(
    (body: T) => {
      setIsLoading(true);

      if (!retainValue) setValue(null);
      setError(null);

      return asyncFunction(body)
        ?.then((response) => {
          setValue(response);
          successCallback?.(response, body);

          return response;
        })
        .catch((error) => {
          setError(error);
          errorCallback?.(error, body);

          throw error.response;
        })
        .finally(() => {
          setIsLoading(false);
          finallyCallback?.(body);
        });
    },
    [asyncFunction], // eslint-disable-line react-hooks/exhaustive-deps
  );

  return {
    execute,
    value,
    error,
    isLoading,
    setError,
  };
};
