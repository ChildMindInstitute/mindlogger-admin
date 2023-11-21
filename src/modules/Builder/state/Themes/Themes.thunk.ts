import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

import { ApiErrorResponse } from 'shared/state/Base';
import { MAX_LIMIT } from 'shared/consts';
import { getThemesApi, GetThemesParams } from 'modules/Builder/api';
import { getApiErrorResult } from 'shared/utils/errors';

export const getThemes = createAsyncThunk(
  'themes/getThemes',
  async (params: GetThemesParams, { rejectWithValue, signal }) => {
    try {
      const { data } = await getThemesApi({ ...params, limit: MAX_LIMIT }, signal);

      return { data };
    } catch (exception) {
      const errorResult = getApiErrorResult(exception as AxiosError<ApiErrorResponse>);

      return rejectWithValue(errorResult);
    }
  },
);
