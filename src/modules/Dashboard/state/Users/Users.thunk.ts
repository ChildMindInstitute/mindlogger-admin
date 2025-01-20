import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

import { ApiErrorResponse } from 'shared/state/Base';
import {
  GetAppletsParams,
  getRespondentDetailsApi,
  GetRespondentDetailsParams,
  SubjectId,
  getSubjectDetailsApi,
} from 'api';
import { MAX_LIMIT } from 'shared/consts';
import { getApiErrorResult } from 'shared/utils/errors';
import { store } from 'redux/store';
import { apiDashboardSlice } from 'modules/Dashboard/api/apiSlice';

export const getAllWorkspaceRespondents = createAsyncThunk(
  'users/getAllWorkspaceRespondents',
  async ({ params }: GetAppletsParams, { rejectWithValue }) => {
    try {
      const promise = store.dispatch(
        apiDashboardSlice.endpoints.getWorkspaceRespondents.initiate({
          params: { ...params, limit: MAX_LIMIT },
        }),
      );
      const { data } = await promise;
      promise.unsubscribe();

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
