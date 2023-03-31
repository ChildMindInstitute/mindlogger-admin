import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

import { ApiError } from 'redux/modules';
import {
  updatePinApi,
  UpdatePin,
  getInvitationsApi,
  getWorkspaceUsersApi,
  GetAppletsParams,
} from 'api';

export const getWorkspaceUsers = createAsyncThunk(
  'applets/getWorkspaceUsers',
  async ({ params }: GetAppletsParams, { rejectWithValue, signal }) => {
    try {
      return await getWorkspaceUsersApi({ params }, signal);
    } catch (exception) {
      return rejectWithValue(exception as AxiosError<ApiError>);
    }
  },
);

export const updatePin = createAsyncThunk(
  'users/updatePin',
  async ({ profileId, newState }: UpdatePin, { rejectWithValue, signal }) => {
    try {
      return await updatePinApi({ profileId, newState }, signal);
    } catch (exception) {
      return rejectWithValue(exception as AxiosError<ApiError>);
    }
  },
);

export const getInvitations = createAsyncThunk(
  'users/getInvitations',
  async ({ id }: { id: string }, { rejectWithValue, signal }) => {
    try {
      return await getInvitationsApi({ appletId: id }, signal);
    } catch (exception) {
      return rejectWithValue(exception as AxiosError<ApiError>);
    }
  },
);
