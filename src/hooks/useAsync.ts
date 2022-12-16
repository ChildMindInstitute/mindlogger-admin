import { useCallback, useState } from 'react';
import { AxiosError, AxiosResponse } from 'axios';

import { ApiError } from 'redux/modules';

export const useAsync = (
  asyncFunction: () => Promise<AxiosResponse<unknown, AxiosError<ApiError>>>,
) => {
  const [value, setValue] = useState<unknown>(null);
  const [error, setError] = useState(null);

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

        return error;
      });
  }, [asyncFunction]);

  return { execute, value, error };
};
