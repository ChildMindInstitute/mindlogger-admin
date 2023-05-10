import axios, { AxiosResponse } from 'axios';

export const isError = (error: unknown): error is Error => error instanceof Error;

export const getErrorMessage = (error: unknown) => {
  if (isError(error)) {
    if (axios.isAxiosError(error) && error?.response?.data?.result?.length) {
      return error.response?.data?.result[0]?.message;
    }

    return error.message;
  } else if (typeof error === 'object') {
    const err = error as AxiosResponse;

    return err.data.message;
  }

  return String(error);
};
