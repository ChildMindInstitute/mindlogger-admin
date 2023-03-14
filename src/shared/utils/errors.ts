import axios, { AxiosResponse } from 'axios';

import i18n from 'i18n';

export const isError = (error: unknown): error is Error => error instanceof Error;

export const getErrorMessage = (error: unknown) => {
  if (isError(error)) {
    if (axios.isAxiosError(error) && error?.response?.data?.result?.length) {
      const currentLanguage = i18n.language;
      const errorMessage = error.response?.data?.result[0]?.message;

      return errorMessage[currentLanguage];
    }

    return error.message;
  } else if (typeof error === 'object') {
    const err = error as AxiosResponse;

    return err.data.message;
  }

  return String(error);
};
