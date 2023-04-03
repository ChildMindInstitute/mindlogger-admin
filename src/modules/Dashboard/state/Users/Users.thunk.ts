import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

import { ApiError } from 'redux/modules';
import { getInvitationsApi, getWorkspaceUsersApi, GetAppletsParams } from 'api';

const getUsersThunk = async ({ params }: GetAppletsParams, { rejectWithValue, signal }: any) => {
  try {
    return await getWorkspaceUsersApi({ params }, signal);
  } catch (exception) {
    return rejectWithValue(exception as AxiosError<ApiError>);
  }
};
export const getWorkspaceRespondents = createAsyncThunk(
  'users/getWorkspaceRespondents',
  getUsersThunk,
);
export const getWorkspaceManagers = createAsyncThunk('users/getWorkspaceManagers', getUsersThunk);

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
