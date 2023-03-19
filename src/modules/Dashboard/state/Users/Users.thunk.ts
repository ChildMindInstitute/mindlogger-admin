import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

import { ApiError } from 'redux/modules';

import { getAccountUserListApi, updatePinApi, UpdatePin, getInvitationsApi } from 'api';

export const getManagersList = createAsyncThunk(
  'users/getManagersList',
  async (args, { rejectWithValue, signal }) => {
    try {
      return await getAccountUserListApi({ role: 'manager' }, signal);
    } catch (exception) {
      return rejectWithValue(exception as AxiosError<ApiError>);
    }
  },
);

export const getUsersList = createAsyncThunk(
  'users/getUsersList',
  async (args, { rejectWithValue, signal }) => {
    try {
      return await getAccountUserListApi({ role: 'user' }, signal);
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
  async (args, { rejectWithValue, signal }) => {
    try {
      return await getInvitationsApi(signal);
    } catch (exception) {
      return rejectWithValue(exception as AxiosError<ApiError>);
    }
  },
);
