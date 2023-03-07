import { PayloadAction } from '@reduxjs/toolkit';
import { AxiosError, AxiosResponse } from 'axios';

export const getApiError = (action: PayloadAction<AxiosError>) => {
  const axiosError = action.payload as AxiosError;
  const axiosResponse = axiosError.response as AxiosResponse;

  return axiosResponse.data.result;
};
