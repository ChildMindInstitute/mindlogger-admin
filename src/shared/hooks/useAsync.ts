import { useCallback, useRef, useState } from 'react';
import { AxiosError, AxiosResponse } from 'axios';

import { ApiErrorResponse } from 'shared/state/Base';

export const useAsync = <T, K>(
  asyncFunction: (args: T) => Promise<AxiosResponse<K>>,
  callback?: (data: AxiosResponse<K>, args?: T) => void,
  errorCallback?: (data: AxiosError<ApiErrorResponse> | null, args?: T) => void,
  finallyCallback?: (args?: T) => void,
  dependencies?: unknown[],
) => {
  const [value, setValue] = useState<AxiosResponse<K> | null>(null);
  const refValue = useRef<AxiosResponse<K> | null>(null);
  const refPrevValue = useRef(refValue.current);
  const [error, setError] = useState<AxiosError<ApiErrorResponse> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const deps = dependencies ?? [];

  const execute = useCallback(
    (body: T) => {
      setIsLoading(true);

      if (refValue.current !== null) {
        refPrevValue.current = refValue.current;
      }

      setValue(null);
      setError(null);

      return asyncFunction(body)
        ?.then((response) => {
          setValue(response);
          callback?.(response, body);
          refValue.current = response;

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
    [asyncFunction, ...deps],
  );

  return {
    execute,
    previousValue: refPrevValue.current,
    value,
    error,
    isLoading,
    setError,
  };
};
