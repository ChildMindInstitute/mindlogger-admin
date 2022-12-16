import axios from 'axios';

export const isError = (error: unknown): error is Error => error instanceof Error;

export function getErrorMessage(error: unknown) {
  if (isError(error)) {
    if (axios.isAxiosError(error) && error.response?.data.message) {
      return error.response?.data.message;
    }

    return error.message;
  }

  return String(error);
}
