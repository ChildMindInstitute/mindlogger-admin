import axios, { AxiosResponse } from 'axios';

export const isError = (error: unknown): error is Error => error instanceof Error;

export const getErrorMessage = (error: unknown) => {
  if (isError(error)) {
    if (axios.isAxiosError(error) && error.response?.data.message) {
      return error.response?.data.message;
    }

    return error.message;
  } else if (typeof error === 'object') {
    const err = error as AxiosResponse;

    return err.data.message;
  }

  return String(error);
};
