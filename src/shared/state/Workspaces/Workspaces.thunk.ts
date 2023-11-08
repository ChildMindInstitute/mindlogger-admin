import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError, AxiosResponse } from 'axios';

import { ApiErrorResponse } from 'shared/state/Base';
import { OwnerId, getWorkspaceRolesApi, getWorkspacesApi } from 'api';
import { getApiErrorResult } from 'shared/utils/errors';

import { Workspace } from './Workspaces.schema';

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

export const getWorkspacesRoles = createAsyncThunk(
  'workspaces/roles',
  async (workspaces: Workspace[], { rejectWithValue, signal }) => {
    try {
      const workspaceRoles = await Promise.all(
        workspaces.map(({ ownerId }) => getWorkspaceRolesApi({ ownerId }, signal)),
      );

      return {
        data: workspaces.map(({ ownerId, workspaceName }, index) => ({
          ownerId,
          workspaceName,
          workspaceRoles: workspaceRoles[index].data.result,
        })),
      };
    } catch (exception) {
      const errorResult = getApiErrorResult(exception as AxiosError<ApiErrorResponse>);

      return rejectWithValue(errorResult);
    }
  },
) as unknown as AsyncThunk<AxiosResponse, Workspace[], Record<string, never>>;

export const getWorkspaces = createAsyncThunk(
  'workspaces/getWorkspaces',
  async (_, { rejectWithValue, signal }) => {
    try {
      const { data } = await getWorkspacesApi(signal);

      return { data };
    } catch (exception) {
      const errorResult = getApiErrorResult(exception as AxiosError<ApiErrorResponse>);

      return rejectWithValue(errorResult);
    }
  },
);
