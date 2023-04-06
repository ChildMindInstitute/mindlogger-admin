import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

import { ApiError } from 'redux/modules';
import {
  getInvitationsApi,
  getWorkspaceRespondentsApi,
  getWorkspaceManagersApi,
  GetAppletsParams,
} from 'api';

export const getWorkspaceRespondents = createAsyncThunk(
  'users/getWorkspaceRespondents',
  async ({ params }: GetAppletsParams, { rejectWithValue, signal }) => {
    try {
      return await getWorkspaceRespondentsApi({ params }, signal);
    } catch (exception) {
      return rejectWithValue(exception as AxiosError<ApiError>);
    }
  },
);

export const getWorkspaceManagers = createAsyncThunk(
  'users/getWorkspaceManagers',
  async ({ params }: GetAppletsParams, { rejectWithValue, signal }) => {
    try {
      return await getWorkspaceManagersApi({ params }, signal);
    } catch (exception) {
      return rejectWithValue(exception as AxiosError<ApiError>);
    }
  },
);

export const getInvitations = createAsyncThunk(
  'users/getInvitations',
  async (args, { rejectWithValue, signal }) => {
    try {
      return await getInvitationsApi(signal);
    } catch (exception) {
      return rejectWithValue(exception as AxiosError<ApiError>);
    }
  },
);
