import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

import { ApiError } from 'redux/modules';
import {
  getEventsApi,
  GetAppletsParams,
  AppletId,
  getWorkspaceAppletsApi,
  RespondentId,
  setAppletEncryptionApi,
} from 'api';
import { Encryption } from 'shared/utils';
import { applets as appletsRedux } from 'redux/modules';

export const getWorkspaceApplets = createAsyncThunk(
  'applets/getWorkspaceApplets',
  async ({ params }: GetAppletsParams, { rejectWithValue, signal }) => {
    try {
      return await getWorkspaceAppletsApi({ params }, signal);
    } catch (exception) {
      return rejectWithValue(exception as AxiosError<ApiError>);
    }
  },
);

export const getEvents = createAsyncThunk(
  'applets/getEvents',
  async (
    { appletId, respondentId }: AppletId & Partial<RespondentId>,
    { rejectWithValue, signal },
  ) => {
    try {
      return await getEventsApi({ appletId, respondentId }, signal);
    } catch (exception) {
      return rejectWithValue(exception as AxiosError<ApiError>);
    }
  },
);

export const setAppletEncryption = createAsyncThunk(
  'applets/setAppletEncryption',
  async (
    { appletId, encryption }: { appletId: string; encryption: Encryption },
    { rejectWithValue, signal, dispatch },
  ) => {
    try {
      await setAppletEncryptionApi({ appletId, encryption }, signal);
      dispatch(appletsRedux.actions.changeAppletEncryption({ appletId, encryption }));
    } catch (exception) {
      return rejectWithValue(exception as AxiosError<ApiError>);
    }
  },
);
