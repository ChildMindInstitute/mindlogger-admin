import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

import { ApiErrorResponse } from 'shared/state/Base';
import {
  getRespondentDetailsApi,
  GetRespondentDetailsParams,
  SubjectId,
  getSubjectDetailsApi,
} from 'api';
import { getApiErrorResult } from 'shared/utils/errors';

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

export const getSubjectDetails = createAsyncThunk(
  'users/getSubjectDetails',
  async (params: SubjectId, { rejectWithValue, signal }) => {
    try {
      const { data } = await getSubjectDetailsApi(params, signal);

      return { data };
    } catch (exception) {
      const errorResult = getApiErrorResult(exception as AxiosError<ApiErrorResponse>);

      return rejectWithValue(errorResult);
    }
  },
);
