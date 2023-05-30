import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

import { ApiError } from 'redux/modules';
import { OwnerId, getWorkspaceRolesApi } from 'api';

export const getWorkspaceRoles = createAsyncThunk(
  'workspace/roles',
  async ({ ownerId }: OwnerId, { rejectWithValue, signal }) => {
    try {
      return await getWorkspaceRolesApi({ ownerId }, signal);
    } catch (exception) {
      return rejectWithValue(exception as AxiosError<ApiError>);
    }
  },
);
