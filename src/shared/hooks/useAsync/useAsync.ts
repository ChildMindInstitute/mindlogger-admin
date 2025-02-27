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

/**
 * Utility hook to handle async operations with loading state, error state, and callbacks.
 *
 * @deprecated This is legacy code used for handling API calls, but notably lacks caching support
 * and uses awkward syntax that requires bulky code in components. From now on, please use RTK Query
 * querying and mutation functions, found in `apiSlice.ts` files corresponding to each module.
 * Use of this hook is now discouraged and existing usage will be replaced over time.
 *
 * @param asyncFunction Async function to be called
 * @param options Options object with the following properties:
 * - `successCallback`: Callback to be called on success
 * - `errorCallback`: Callback to be called on error
 * - `finallyCallback`: Callback to be called on completion
 * - `retainValue`: Whether to preserve the previous returned value during loading state (if false,
 *   the value will be set to `null` the next time `execute` is called)
 * @returns Object with the following properties:
 * - `execute`: Function that executes the async function
 * - `value`: Async function's successful response value
 * - `error`: Async function's returned value if there is an error
 * - `isLoading`: Whether the async function is currently executing
 * - `setError`: Function to set the error value
 */
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
