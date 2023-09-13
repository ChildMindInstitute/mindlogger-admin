import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

import { ApiError } from 'redux/modules';
import { getWorkspaceRespondentsApi, GetAppletsParams } from 'api';

import { RESPONDENTS_WITHOUT_LIMIT } from './Users.const';

export const getAllWorkspaceRespondents = createAsyncThunk(
  'users/getAllWorkspaceRespondents',
  async ({ params }: GetAppletsParams, { rejectWithValue, signal }) => {
    try {
      return await getWorkspaceRespondentsApi(
        { params: { ...params, limit: RESPONDENTS_WITHOUT_LIMIT } },
        signal,
      );
    } catch (exception) {
      return rejectWithValue(exception as AxiosError<ApiError>);
    }
  },
);
