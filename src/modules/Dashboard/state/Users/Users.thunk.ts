import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

import { ApiErrorResponse } from 'shared/state/Base';
import { getWorkspaceRespondentsApi, GetAppletsParams } from 'api';
import { MAX_LIMIT } from 'shared/consts';
import { getApiErrorResult } from 'shared/utils/errors';

export const getAllWorkspaceRespondents = createAsyncThunk(
  'users/getAllWorkspaceRespondents',
  async ({ params }: GetAppletsParams, { rejectWithValue, signal }) => {
    try {
      const { data } = await getWorkspaceRespondentsApi(
        { params: { ...params, limit: MAX_LIMIT } },
        signal,
      );

      return { data };
    } catch (exception) {
      const errorResult = getApiErrorResult(exception as AxiosError<ApiErrorResponse>);

      return rejectWithValue(errorResult);
    }
  },
);
