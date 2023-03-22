import { authApiClient, authApiClientWithFullLang } from 'shared/api/api.client';

import {
  SwitchAccount,
  AccountUserList,
  TransferOwnershipType,
  SetAccount,
  RevokeAppletUser,
  AppletId,
  AppletInvitationData,
  DuplicateApplet,
  FolderId,
  AppletNameArgs,
  AppletEncryption,
  ValidateAppletName,
  UpdateRetainingSettings,
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
} from './api.types';

export const getUserDetailsApi = (signal?: AbortSignal) =>
  authApiClient.get('/users/me', { signal });

export const getAppletsApi = ({ params }: GetAppletsParams, signal?: AbortSignal) =>
  authApiClient.get('/applets', {
    params,
    signal,
  });

export const getWorkspaceAppletsApi = ({ params }: GetAppletsParams, signal?: AbortSignal) =>
  authApiClient.get(`/workspaces/${params.owner_id}`, {
    // params,
    signal,
  });

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

export const getAccountUserListApi = (
  { appletId, role, MRN, pagination, sort }: AccountUserList,
  signal?: AbortSignal,
) =>
  authApiClient.get('/account/users', {
    params: {
      appletId,
      role,
      MRN: MRN || '',
      pagination: pagination || JSON.stringify({ allow: false }),
      sort: sort || JSON.stringify({ allow: false }),
    },
    signal,
  });

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

export const getAppletInvitationApi = (
  { appletId, options }: AppletInvitationData,
  signal?: AbortSignal,
) =>
  authApiClient.post(
    `/applet/${appletId}/inviteUser`,
    {},
    {
      params: { ...options, users: JSON.stringify(options.users) },
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

export const updateRetainingSettingsApi = (
  { appletId, options }: UpdateRetainingSettings,
  signal?: AbortSignal,
) => authApiClient.post(`/applet/${appletId}/setRetention`, {}, { params: options, signal });

export const getInvitationsApi = ({ appletId }: AppletId, signal?: AbortSignal) =>
  authApiClient.get(`/applet/${appletId}/invitations`, {
    signal,
  });

export const updatePinApi = ({ profileId, newState }: UpdatePin, signal?: AbortSignal) =>
  authApiClient.put(
    '/account/manage/pin',
    {},
    {
      params: {
        profileId,
        newState,
      },
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
) =>
  authApiClient.post(`/applet/${appletId}/publicLink?requireLogin=${requireLogin}`, {}, { signal });

export const getAppletPublicLinkApi = ({ appletId }: AppletId, signal?: AbortSignal) =>
  authApiClient.get(`/applet/${appletId}/publicLink`, { signal });

export const deleteAppletPublicLinkApi = ({ appletId }: AppletId, signal?: AbortSignal) =>
  authApiClient.delete(`/applet/${appletId}/publicLink`, { signal });

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
