import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

import { ApiError } from 'redux/modules';
import { MAX_LIMIT } from 'shared/consts';
import { getThemesApi, GetThemesParams } from 'modules/Builder/api';

export const getThemes = createAsyncThunk(
  'themes/getThemes',
  async (params: GetThemesParams, { rejectWithValue, signal }) => {
    try {
      return await getThemesApi({ ...params, limit: MAX_LIMIT }, signal);
    } catch (exception) {
      return rejectWithValue(exception as AxiosError<ApiError>);
    }
  },
);
