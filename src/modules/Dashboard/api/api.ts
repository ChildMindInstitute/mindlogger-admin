import { authApiClient, authApiClientWithFullLang } from 'shared/api/api.client';
import { AppletId } from 'shared/api';

import {
  SwitchAccount,
  TransferOwnershipType,
  SetAccount,
  RevokeAppletUser,
  AppletInvitationData,
  DuplicateApplet,
  FolderId,
  AppletNameArgs,
  AppletEncryption,
  ValidateAppletName,
  UpdatePin,
  Folder,
  UpdateFolder,
  TogglePin,
  UpdateAlertStatus,
  PublishApplet,
  UpdateAppletSearchTerms,
  PostAppletPublicLink,
  GetUsersData,
  GetAppletsParams,
  CreateEventType,
} from './api.types';

export const getUserDetailsApi = (signal?: AbortSignal) =>
  authApiClient.get('/users/me', { signal });

export const getWorkspaceAppletsApi = ({ params }: GetAppletsParams, signal?: AbortSignal) => {
  const { ownerId, ...restParams } = params;

  return authApiClient.get(`/workspaces/${ownerId}/applets`, {
    params: restParams,
    signal,
  });
};

export const getWorkspaceManagersApi = ({ params }: GetAppletsParams, signal?: AbortSignal) => {
  const { ownerId, ...restParams } = params;

  return authApiClient.get(`/workspaces/${ownerId}/managers`, {
    params: restParams,
    signal,
  });
};

export const getWorkspaceRespondentsApi = ({ params }: GetAppletsParams, signal?: AbortSignal) => {
  const { ownerId, ...restParams } = params;

  return authApiClient.get(`/workspaces/${ownerId}/respondents`, {
    params: restParams,
    signal,
  });
};

export const switchAccountApi = ({ accountId }: SwitchAccount, signal?: AbortSignal) =>
  authApiClient.put(
    '/user/switchAccount',
    {},
    {
      params: {
        accountId,
      },
      signal,
    },
  );

export const transferOwnershipApi = (
  { appletId, email }: TransferOwnershipType,
  signal?: AbortSignal,
) =>
  authApiClient.post(
    `/applets/${appletId}/transferOwnership`,
    { email },
    {
      signal,
    },
  );

export const createEventApi = ({ appletId, body }: CreateEventType, signal?: AbortSignal) =>
  authApiClient.post(`/applets/${appletId}/events`, body, {
    signal,
  });

export const getEventsApi = ({ appletId }: AppletId, signal?: AbortSignal) =>
  authApiClient.get(`/applets/${appletId}/events`, {
    signal,
  });

export const setAccountNameApi = ({ accountName }: SetAccount, signal?: AbortSignal) =>
  authApiClient.put(
    '/user/accountName',
    {},
    {
      params: {
        accountName,
      },
      signal,
    },
  );

export const revokeAppletUserApi = (
  { appletId, profileId, deleteResponse }: RevokeAppletUser,
  signal?: AbortSignal,
) =>
  authApiClient.delete(`/applet/${appletId}/deleteUser`, {
    params: {
      profileId,
      deleteResponse,
    },
    signal,
  });

export const deleteAppletApi = ({ appletId }: AppletId, signal?: AbortSignal) =>
  authApiClient.delete(`/applets/${appletId}`, { signal });

export const postAppletInvitationApi = (
  { url, appletId, options }: AppletInvitationData,
  signal?: AbortSignal,
) =>
  authApiClient.post(
    `/invitations/${appletId}/${url}`,
    { ...options },
    {
      signal,
    },
  );

export const duplicateAppletApi = (
  { appletId, options, data }: DuplicateApplet,
  signal?: AbortSignal,
) =>
  authApiClientWithFullLang.post(`/applet/${appletId}/duplicate`, data, {
    params: {
      ...options,
    },
    signal,
  });

export const setAppletEncryptionApi = (
  { appletId, data }: AppletEncryption,
  signal?: AbortSignal,
) => authApiClient.put(`/applet/${appletId}/encryption`, data, { signal });

export const validateAppletNameApi = ({ name }: ValidateAppletName, signal?: AbortSignal) =>
  authApiClient.get('/applet/validateName', {
    params: { name },
    signal,
  });

export const getInvitationsApi = ({ params }: GetAppletsParams, signal?: AbortSignal) => {
  const { ownerId, ...restParams } = params;

  return authApiClient.get('/invitations', {
    params: restParams,
    signal,
  });
};

export const updatePinApi = ({ ownerId, accessId }: UpdatePin, signal?: AbortSignal) =>
  authApiClient.post(
    `/workspaces/${ownerId}/respondents/pin`,
    { accessId },
    {
      signal,
    },
  );

export const getAppletsInFolderApi = ({ folderId }: FolderId, signal?: AbortSignal) =>
  authApiClient.get(`/folder/${folderId}/applets`, {
    signal,
  });

export const deleteFolderApi = ({ folderId }: FolderId, signal?: AbortSignal) =>
  authApiClient.delete(`/folder/${folderId}`, {
    signal,
  });

export const addAppletToFolderApi = (
  { folderId, appletId }: FolderId & AppletId,
  signal?: AbortSignal,
) =>
  authApiClient.put(
    `/folder/${folderId}/add`,
    {},
    {
      params: {
        id: folderId,
        appletId,
      },
      signal,
    },
  );

export const removeAppletApi = (
  { folderId, appletId }: FolderId & AppletId,
  signal?: AbortSignal,
) =>
  authApiClient.delete(`/folder/${folderId}/remove`, {
    params: {
      id: folderId,
      appletId,
    },
    signal,
  });

export const saveFolderApi = ({ folder: { name, parentId } }: Folder, signal?: AbortSignal) =>
  authApiClient.post(
    '/folder',
    {},
    {
      params: {
        name,
        parentType: 'user',
        parentId,
      },
      signal,
    },
  );

export const updateFolderApi = (
  { folder: { name, parentId }, folderId }: UpdateFolder,
  signal?: AbortSignal,
) =>
  authApiClient.put(
    `/folder/${folderId}`,
    {},
    {
      params: {
        name,
        parentType: 'user',
        parentId,
      },
      signal,
    },
  );

export const togglePinApi = (
  { applet: { parentId, id }, isPinned }: TogglePin,
  signal?: AbortSignal,
) => {
  const url = isPinned ? `/folder/${parentId}/pin` : `/folder/${parentId}/unpin`;

  return authApiClient.put(
    url,
    {},
    {
      params: {
        id: parentId,
        appletId: id,
      },
      signal,
    },
  );
};

export const updateAlertStatusApi = ({ alertId }: UpdateAlertStatus, signal?: AbortSignal) =>
  authApiClient.put(`account/updateAlertStatus/${alertId}`, {}, { signal });

export const checkAppletNameInLibraryApi = (
  { appletId, appletName }: AppletNameArgs,
  signal?: AbortSignal,
) =>
  authApiClient.get(`/library/${appletId}/checkName`, {
    params: {
      name: appletName,
    },
    signal,
  });

export const publishAppletToLibraryApi = (
  { appletId, publish = true }: PublishApplet,
  signal?: AbortSignal,
) =>
  authApiClient.put(
    `/applet/${appletId}/status`,
    {},
    {
      params: {
        id: appletId,
        publish,
      },
      signal,
    },
  );

export const updateAppletSearchTermsApi = (
  { appletId, params }: UpdateAppletSearchTerms,
  signal?: AbortSignal,
) =>
  authApiClient.put(
    `/applet/${appletId}/searchTerms`,
    {},
    {
      params: {
        ...params,
        id: appletId,
      },
      signal,
    },
  );

export const getAppletSearchTermsApi = ({ appletId }: AppletId, signal?: AbortSignal) =>
  authApiClient.get(`/applet/${appletId}/searchTerms`, {
    signal,
  });

export const getAppletLibraryUrlApi = ({ appletId }: AppletId, signal?: AbortSignal) =>
  authApiClient.get(`/applet/${appletId}/libraryUrl`, {
    signal,
  });

export const postAppletPublicLinkApi = (
  { appletId, requireLogin }: PostAppletPublicLink,
  signal?: AbortSignal,
) => authApiClient.post(`/applets/${appletId}/access_link`, { requireLogin }, { signal });

export const getAppletPublicLinkApi = ({ appletId }: AppletId, signal?: AbortSignal) =>
  authApiClient.get(`/applets/${appletId}/access_link`, { signal });

export const deleteAppletPublicLinkApi = ({ appletId }: AppletId, signal?: AbortSignal) =>
  authApiClient.delete(`/applets/${appletId}/access_link`, { signal });

export const getAppletInviteLinkApi = ({ appletId }: AppletId, signal?: AbortSignal) =>
  authApiClient.get(`/applet/${appletId}/inviteLink`, { signal });

export const getUsersDataApi = (
  { appletId, users, pageIndex }: GetUsersData,
  signal?: AbortSignal,
) =>
  authApiClient.get(`/applet/${appletId}/data`, {
    params: {
      users: JSON.stringify(users),
      pagination: JSON.stringify({
        allow: true,
        pageIndex: pageIndex || 0,
      }),
    },
    signal,
  });
