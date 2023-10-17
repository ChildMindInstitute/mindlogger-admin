import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

import { ApiError } from 'redux/modules';
import { DEFAULT_ROWS_PER_PAGE } from 'shared/consts';
import { getThemesApi, GetThemesParams } from 'modules/Builder/api';

export const getThemes = createAsyncThunk(
  'themes/getThemes',
  async (params: GetThemesParams, { rejectWithValue, signal }) => {
    try {
      return await getThemesApi({ ...params, limit: DEFAULT_ROWS_PER_PAGE }, signal);
    } catch (exception) {
      return rejectWithValue(exception as AxiosError<ApiError>);
    }
  },
);
