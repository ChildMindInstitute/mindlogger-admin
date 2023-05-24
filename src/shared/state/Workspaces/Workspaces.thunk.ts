import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

import { ApiError, WorkspacePriorityRoleApiParams } from 'redux/modules';
import { getWorkspacePriorityRoleApi } from 'api';

export const getWorkspacePriorityRole = createAsyncThunk(
  'workspace/priorityRole',
  async ({ params }: WorkspacePriorityRoleApiParams, { rejectWithValue, signal }) => {
    try {
      return await getWorkspacePriorityRoleApi({ params }, signal);
    } catch (exception) {
      return rejectWithValue(exception as AxiosError<ApiError>);
    }
  },
);
