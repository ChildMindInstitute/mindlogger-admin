import { AxiosError, AxiosResponse } from 'axios';

import { ApiErrorResponse } from 'redux/modules';

export type SuccessCallback<T, K> = (data: AxiosResponse<K>, args?: T) => void;
export type ErrorCallback<T> = (data: AxiosError<ApiErrorResponse> | null, args?: T) => void;
export type FinallyCallback<T> = (args?: T) => void;

type OptionsAsObject<T, K> = [
  {
    successCallback?: SuccessCallback<T, K>;
    errorCallback?: ErrorCallback<T>;
    finallyCallback?: FinallyCallback<T>;
    retainValue?: boolean;
  },
];
/** @deprecated */
type OptionsAsArray<T, K> = [SuccessCallback<T, K>?, ErrorCallback<T>?, FinallyCallback<T>?];

export type UseAsyncOptions<T, K> = OptionsAsObject<T, K> | OptionsAsArray<T, K>;

export const optionsIsObjectTypeGuard = <T, K>(
  options: UseAsyncOptions<T, K>,
): options is OptionsAsObject<T, K> => options.length === 1 && typeof options[0] === 'object';
