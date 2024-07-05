import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

import { ApiErrorResponse } from 'shared/state/Base';
import { OwnerId, getWorkspaceRolesApi, getWorkspacesApi } from 'api';
import { getApiErrorResult } from 'shared/utils/errors';
import { FeatureFlags } from 'shared/utils/featureFlags';

export const getWorkspaceRoles = createAsyncThunk(
  'workspace/roles',
  async ({ ownerId }: OwnerId, { rejectWithValue, signal }) => {
    try {
      const { data } = await getWorkspaceRolesApi({ ownerId }, signal);

      return { data };
    } catch (exception) {
      const errorResult = getApiErrorResult(exception as AxiosError<ApiErrorResponse>);

      return rejectWithValue(errorResult);
    }
  },
);

export const getWorkspaces = createAsyncThunk(
  'workspaces/getWorkspaces',
  async (_, { rejectWithValue, signal }) => {
    try {
      const { data } = await getWorkspacesApi(signal);

      const workspaceNames = data.result.map((obj: { workspaceName: string }) => obj.workspaceName);
      await FeatureFlags.updateWorkspaces(workspaceNames);

      return { data };
    } catch (exception) {
      const errorResult = getApiErrorResult(exception as AxiosError<ApiErrorResponse>);

      return rejectWithValue(errorResult);
    }
  },
);
