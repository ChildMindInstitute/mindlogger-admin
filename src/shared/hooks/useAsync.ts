import { useCallback, useState } from 'react';
import { AxiosError, AxiosResponse } from 'axios';

import { ApiResponseCodes } from 'api';
import { ApiErrorResponse } from 'shared/state/Base';

export const useAsync = <T, K>(
  asyncFunction: (args: T) => Promise<AxiosResponse<K>>,
  callback?: (data: AxiosResponse<K>) => void,
  errorCallback?: (data: AxiosError<ApiErrorResponse> | null) => void,
  finallyCallback?: () => void,
  dependencies?: unknown[],
) => {
  const [value, setValue] = useState<AxiosResponse<K> | null>(null);
  const [error, setError] = useState<AxiosError<ApiErrorResponse> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [noPermission, setNoPermission] = useState(false);
  const deps = dependencies ?? [];

  const execute = useCallback(
    (body: T) => {
      setIsLoading(true);

      setValue(null);
      setError(null);

      return asyncFunction(body)
        ?.then((response) => {
          setValue(response);
          callback && callback(response);

          return response;
        })
        .catch((error) => {
          setError(error);
          if (error.response?.status === ApiResponseCodes.Forbidden) {
            setNoPermission(true);
          }
          errorCallback && errorCallback(error);

          throw error.response;
        })
        .finally(() => {
          setIsLoading(false);
          finallyCallback?.();
        });
    },
    [asyncFunction, ...deps],
  );

  return { execute, value, error, isLoading, setError, noPermission, setNoPermission };
};
