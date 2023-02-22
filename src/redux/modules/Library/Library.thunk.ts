import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

import { ApiError } from 'redux/modules';
import { getPublishedAppletsApi, PublishedApplets } from 'api';

export const getPublishedApplets = createAsyncThunk(
  'applets/getPublishedApplets',
  async (publishedApplets: PublishedApplets, { rejectWithValue, signal }) => {
    try {
      return await getPublishedAppletsApi(publishedApplets, signal);
    } catch (exception) {
      return rejectWithValue(exception as AxiosError<ApiError>);
    }
  },
);
