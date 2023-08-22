import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError, AxiosResponse } from 'axios';

import { ApiError, Workspace } from 'redux/modules';
import { OwnerId, getWorkspaceRolesApi, getWorkspacesApi } from 'api';

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
      return rejectWithValue(exception as AxiosError<ApiError>);
    }
  },
) as unknown as AsyncThunk<AxiosResponse, Workspace[], Record<string, never>>;

export const getWorkspaces = createAsyncThunk(
  'workspaces/getWorkspaces',
  async (_, { rejectWithValue, signal }) => {
    try {
      return await getWorkspacesApi(signal);
    } catch (exception) {
      return rejectWithValue(exception as AxiosError<ApiError>);
    }
  },
);
