import { useCallback, useState } from 'react';
import { AxiosError, AxiosResponse } from 'axios';

import { ApiError } from 'redux/modules';

export const useAsync = <T, K>(
  asyncFunction: (args: T) => Promise<AxiosResponse<K>>,
  callback?: (data: AxiosResponse<K> | null) => void,
  errorCallback?: (data: K | null) => void,
  finallyCallback?: () => void,
) => {
  const [value, setValue] = useState<AxiosResponse<K> | null>(null);
  const [error, setError] = useState<AxiosError<ApiError> | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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
          errorCallback && errorCallback(error);

          throw error.response;
        })
        .finally(() => {
          setIsLoading(false);
          finallyCallback?.();
        });
    },
    [asyncFunction],
  );

  return { execute, value, error, isLoading, setError };
};
