import axios, { AxiosResponse } from 'axios';

export const isError = (error: unknown): error is Error => error instanceof Error;

export const getErrorData = (error: unknown) => {
  if (isError(error)) {
    if (axios.isAxiosError(error) && error?.response?.data?.result?.length) {
      return error.response?.data?.result[0];
    }

    return error;
  } else if (typeof error === 'object') {
    const err = error as AxiosResponse;

    return err.data;
  }

  return error;
};

export const getErrorMessage = (error: unknown) => {
  const errorData = getErrorData(error);

  return errorData?.message ?? errorData?.data?.message ?? String(errorData);
};
