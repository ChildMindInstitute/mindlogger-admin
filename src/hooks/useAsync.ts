import { useCallback, useState } from 'react';
import { AxiosError, AxiosResponse } from 'axios';

import { ApiError } from 'redux/modules';

export const useAsync = (
  asyncFunction: () => Promise<AxiosResponse<unknown, AxiosError<ApiError>>>,
) => {
  const [value, setValue] = useState<AxiosResponse<unknown> | null>(null);
  const [error, setError] = useState<AxiosError<ApiError> | null>(null);

  const execute = useCallback(() => {
    setValue(null);
    setError(null);

    return asyncFunction()
      .then((response) => {
        setValue(response);

        return response;
      })
      .catch((error) => {
        setError(error);

        throw error.response;
      });
  }, [asyncFunction]);

  return { execute, value, error };
};
