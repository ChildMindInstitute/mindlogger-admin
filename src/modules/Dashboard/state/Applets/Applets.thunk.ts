import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

import { getEventsApi, AppletId, RespondentId } from 'api';
import { ApiErrorResponse } from 'shared/state/Base';
import { getApiErrorResult } from 'shared/utils/errors';

export const getEvents = createAsyncThunk(
  'applets/getEvents',
  async ({ appletId, respondentId }: AppletId & Partial<RespondentId>, { rejectWithValue, signal }) => {
    try {
      const { data } = await getEventsApi({ appletId, respondentId }, signal);

      return { data };
    } catch (exception) {
      const errorResult = getApiErrorResult(exception as AxiosError<ApiErrorResponse>);

      return rejectWithValue(errorResult);
    }
  },
);
