import axios, { AxiosResponse, AxiosError } from 'axios';

import { ApiError } from 'shared/state';

export const isError = (error: unknown): error is Error => error instanceof Error;

export const getErrorData = (error: Error | AxiosError<ApiError> | unknown) => {
  if (isError(error)) {
    if (axios.isAxiosError(error) && error?.response?.data?.result?.length) {
      return error.response?.data?.result[0];
    }

    return error;
  } else if (typeof error === 'object') {
    const err = error as AxiosResponse;

    return err?.data;
  }

  return error;
};

export const getErrorMessage = (error: Error | AxiosError<ApiError> | unknown) => {
  const errorData = getErrorData(error);

  return errorData?.message ?? String(errorData);
};
