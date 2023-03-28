import { useCallback, useState } from 'react';
import { AxiosError } from 'axios';

import { ApiError } from 'redux/modules';

export const useAsync = <T, K>(
  asyncFunction: ((args: T) => Promise<K>) | undefined,
  callback?: (data: K | null) => void,
) => {
  const [value, setValue] = useState<K | null>(null);
  const [error, setError] = useState<AxiosError<ApiError> | null>(null);

  const execute = useCallback(
    (body: T) => {
      if (!asyncFunction) {
        return Promise.resolve();
      }

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

          throw error.response;
        });
    },
    [asyncFunction],
  );

  return { execute, value, error };
};
