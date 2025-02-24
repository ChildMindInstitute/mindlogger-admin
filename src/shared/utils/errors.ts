import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import axios, { AxiosResponse, AxiosError } from 'axios';

import { ApiErrorResponse, ApiErrorReturn } from 'shared/state/Base';

type ErrorData = Error | AxiosError<ApiErrorResponse> | FetchBaseQueryError | unknown;

export const isError = (error: unknown): error is Error => error instanceof Error;

export const getErrorData = (error: ErrorData) => {
  if (isError(error)) {
    if (axios.isAxiosError(error) && error?.response?.data?.result?.length) {
      return error.response?.data?.result[0];
    }

    return error;
  } else if (typeof error === 'object') {
    const err = error as AxiosResponse;

    if (err?.data?.result?.length) {
      return err?.data?.result[0];
    }

    return err?.data;
  }

  return error;
};

export const getErrorMessage = (error: ErrorData) => {
  const errorData = getErrorData(error);

  return errorData?.message ?? String(errorData);
};

export const getApiErrorResult = (axiosError: AxiosError<ApiErrorResponse>): ApiErrorReturn => {
  const axiosResponse = axiosError.response as AxiosResponse;
  const axiosResponseData = axiosResponse.data;

  return axiosResponseData.result ?? axiosResponseData.detail ?? '';
};
