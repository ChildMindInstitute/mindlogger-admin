import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

import { getWorkspaceRespondentsApi, GetAppletsParams, getRespondentDetailsApi, GetRespondentDetailsParams } from 'api';
import { MAX_LIMIT } from 'shared/consts';
import { ApiErrorResponse } from 'shared/state/Base';
import { getApiErrorResult } from 'shared/utils/errors';

export const getAllWorkspaceRespondents = createAsyncThunk(
  'users/getAllWorkspaceRespondents',
  async ({ params }: GetAppletsParams, { rejectWithValue, signal }) => {
    try {
      const { data } = await getWorkspaceRespondentsApi({ params: { ...params, limit: MAX_LIMIT } }, signal);

      return { data };
    } catch (exception) {
      const errorResult = getApiErrorResult(exception as AxiosError<ApiErrorResponse>);

      return rejectWithValue(errorResult);
    }
  },
);

export const getRespondentDetails = createAsyncThunk(
  'users/getRespondentDetails',
  async (params: GetRespondentDetailsParams, { rejectWithValue, signal }) => {
    try {
      const { data } = await getRespondentDetailsApi(params, signal);

      return { data };
    } catch (exception) {
      const errorResult = getApiErrorResult(exception as AxiosError<ApiErrorResponse>);

      return rejectWithValue(errorResult);
    }
  },
);
