import { attachUrl } from './api.utils';
import {
  apiClient,
  apiClientWithLang,
  authApiClient,
  authApiClientWithFullLang,
} from './api.client';
import {
  SignIn,
  SignUpArgs,
  SignInRefreshTokenArgs,
  ResetPassword,
  SwitchAccount,
  AccountUserList,
  SetScheduleData,
  GetScheduleData,
  TransferOwnership,
  SetAccount,
  GetActivityByUrl,
  GetUserResponses,
  AddNewApplet,
  RevokeAppletUser,
  AppletId,
  UpdateActivityVis,
  GetUserList,
  UpdateUserRole,
  DeleteUserFromRole,
  CreateApplet,
  UpdateApplet,
  PrepareApplet,
  AppletInvitationData,
  UpdateItemTemplates,
  DuplicateApplet,
  ReplaceResponseData,
  FolderId,
  AppletNameArgs,
  AppletEncryption,
  ProtocolData,
  ValidateAppletName,
  UpdateRetainingSettings,
  UpdateProfile,
  UpdatePin,
  Folder,
  UpdateFolder,
  TogglePin,
  UpdateAlertStatus,
  PublishApplet,
  UpdateAppletSearchTerms,
  Notes,
  AddNote,
  DownloadGcpFile,
  UpdateNote,
  DeleteNote,
  PostAppletPublicLink,
  DownloadReviews,
  PostReviewerResponse,
  SetPdfPassword,
  SetWelcomeStatus,
  GetApplet,
  GetUsersData,
} from './api.types';

export const signInApi = ({ email, password }: SignIn, signal?: AbortSignal) =>
  apiClientWithLang.post(
    'auth/token',
    { email, password },
    {
      signal,
    },
  );

export const signInRefreshTokenApi = (
  { refreshToken }: SignInRefreshTokenArgs,
  signal?: AbortSignal,
) =>
  apiClientWithLang.post(
    '/auth/token/refresh',
    { refreshToken },
    {
      signal,
    },
  );

export const signUpApi = ({ body }: SignUpArgs, signal?: AbortSignal) =>
  apiClient.post(
    '/users',
    { ...body },
    {
      signal,
    },
  );

export const resetPasswordApi = ({ email }: ResetPassword, signal?: AbortSignal) =>
  apiClient.post(
    '/users/me/password/recover',
    { email },
    {
      signal,
    },
  );

export const getUserDetailsApi = (signal?: AbortSignal) =>
  authApiClient.get('/users/me', { signal });

export const getAccountsApi = (signal?: AbortSignal) =>
  authApiClient.get('/user/accounts', { signal });

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

export const getThemesApi = (signal?: AbortSignal) => authApiClient.get('/theme', { signal });

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

export const getLibraryCategoriesApi = (signal?: AbortSignal) =>
  authApiClient.get('/library/categories', { signal });

export const setScheduleApi = ({ id, data }: SetScheduleData, signal?: AbortSignal) =>
  authApiClient.put(`/applet/${id}/setSchedule`, JSON.stringify(data), {
    signal,
  });

export const getScheduleApi = ({ id }: GetScheduleData, signal?: AbortSignal) =>
  authApiClient.put(
    `/applet/${id}/getSchedule?getAllEvents=true`,
    {},
    {
      params: {
        localEvents: null,
      },
      signal,
    },
  );

export const transferOwnershipApi = (
  { appletId, email }: TransferOwnership,
  signal?: AbortSignal,
) =>
  authApiClient.put(
    `/applet/${appletId}/transferOwnerShip`,
    {},
    {
      params: {
        email,
      },
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

export const getActivityByUrlApi = ({ url }: GetActivityByUrl, signal?: AbortSignal) =>
  authApiClient.get('/activity', {
    params: {
      url,
    },
    signal,
  });

export const getUserResponsesApi = (
  { appletId, users, fromDate, toDate }: GetUserResponses,
  signal?: AbortSignal,
) =>
  authApiClient.get(`/response/${appletId}`, {
    params: { users: JSON.stringify(users), fromDate, toDate },
    signal,
  });

export const addNewAppletApi = ({ protocolUrl, email, data }: AddNewApplet, signal?: AbortSignal) =>
  authApiClientWithFullLang.post('/applet/', data, {
    params: {
      protocolUrl,
      email,
    },
    signal,
  });

export const refreshAppletApi = ({ appletId }: AppletId, signal?: AbortSignal) =>
  authApiClientWithFullLang.put(
    `/applet/${appletId}/refresh`,
    {},
    {
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

export const getGroupMembershipsApi = ({ appletId }: AppletId, signal?: AbortSignal) =>
  authApiClient.get(`/applet/${appletId}/roles`, {
    signal,
  });

export const getAppletUsersApi = ({ appletId }: AppletId, signal?: AbortSignal) =>
  authApiClient.get(`/applet/${appletId}/users?retrieveRoles=true`, {
    signal,
  });

export const updateActivityVisApi = (
  { id, status, activityFlowIds, activityIds }: UpdateActivityVis,
  signal?: AbortSignal,
) =>
  authApiClient.put(
    `/${id}/activities/visibility`,
    {},
    {
      params: {
        status,
        activityFlowIds: JSON.stringify(activityFlowIds),
        activityIds: JSON.stringify(activityIds),
      },
      signal,
    },
  );

export const getUserListApi = ({ appletId, reviewerId }: GetUserList, signal?: AbortSignal) =>
  authApiClient.get(`/applet/${appletId}/reviewer/userList`, {
    params: {
      reviewerId,
    },
    signal,
  });

export const updateUserRolesApi = (
  { appletId, userId, roleInfo }: UpdateUserRole,
  signal?: AbortSignal,
) =>
  authApiClient.put(
    `/applet/${appletId}/updateRoles`,
    {},
    {
      params: {
        userId,
        roleInfo,
      },
      signal,
    },
  );

export const deleteUserFromRoleApi = (
  { groupId, userId }: DeleteUserFromRole,
  signal?: AbortSignal,
) => {
  const data = new FormData();
  data.append('userId', userId);

  return authApiClient.delete(`/group/${groupId}/member`, { data, signal });
};

export const getOneTimeTokenApi = (signal?: AbortSignal) =>
  authApiClient.post('/user/token', {}, { signal });

export const deleteAppletApi = ({ appletId }: AppletId, signal?: AbortSignal) =>
  authApiClient.delete(`/applet/${appletId}`, { signal });

export const createAppletApi = ({ email, data, themeId }: CreateApplet, signal?: AbortSignal) =>
  authApiClientWithFullLang.post('/applet/fromJSON', data, {
    params: {
      email,
      ...(themeId && { themeId }),
      signal,
    },
  });

export const updateAppletApi = ({ data, appletId, themeId }: UpdateApplet, signal?: AbortSignal) =>
  authApiClient.put(`/applet/${appletId}/fromJSON`, data, {
    params: {
      ...(themeId && { themeId }),
    },
    signal,
  });

export const prepareAppletApi = ({ data, appletId, thread }: PrepareApplet, signal?: AbortSignal) =>
  authApiClient.put(`/applet/${appletId}/prepare?thread=${thread}`, data, {
    signal,
  });

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

export const updateItemTemplatesApi = ({ data }: UpdateItemTemplates, signal?: AbortSignal) =>
  authApiClient.put('/item/templates', data, {
    signal,
  });

export const getItemTemplatesApi = (signal?: AbortSignal) =>
  authApiClient.get('/item/templates', { signal });

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

export const replaceResponseDataApi = (
  { appletId, user, data }: ReplaceResponseData,
  signal?: AbortSignal,
) =>
  authApiClient.put(`/response/${appletId}`, data, {
    params: {
      user,
    },
    signal,
  });

export const setAppletEncryptionApi = (
  { appletId, data }: AppletEncryption,
  signal?: AbortSignal,
) => authApiClient.put(`/applet/${appletId}/encryption`, data, { signal });

export const getAppletVersionsApi = ({ appletId }: AppletId, signal?: AbortSignal) =>
  authApiClient.get(`/applet/${appletId}/versions`, { signal });

export const getProtocolDataApi = ({ appletId, versions }: ProtocolData, signal?: AbortSignal) =>
  authApiClient.get(`/applet/${appletId}/protocolData`, {
    params: { versions: JSON.stringify(versions) },
    signal,
  });

export const validateAppletNameApi = ({ name }: ValidateAppletName, signal?: AbortSignal) =>
  authApiClient.get('/applet/validateName', {
    params: { name },
    signal,
  });

export const updateRetainingSettingsApi = (
  { appletId, options }: UpdateRetainingSettings,
  signal?: AbortSignal,
) => authApiClient.post(`/applet/${appletId}/setRetention`, {}, { params: options, signal });

export const updateProfileApi = ({ appletId, options }: UpdateProfile, signal?: AbortSignal) =>
  authApiClient.put(`/applet/${appletId}/updateProfile`, {}, { params: options, signal });

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

export const getBasketContentApi = (signal?: AbortSignal) =>
  authApiClient.get('/library/basket/content', { signal });

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

export const changeAppletNameApi = (
  { appletId, appletName }: AppletNameArgs,
  signal?: AbortSignal,
) =>
  authApiClient.put(
    `/applet/${appletId}/name`,
    {},
    {
      params: {
        id: appletId,
        name: appletName,
      },
      signal,
    },
  );

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

export const getNotesApi = ({ appletId, responseId }: Notes, signal?: AbortSignal) =>
  authApiClient.get(`/response/${appletId}/notes`, {
    params: {
      responseId,
    },
    signal,
  });

export const addNoteApi = ({ appletId, responseId, note }: AddNote, signal?: AbortSignal) =>
  authApiClient.post(
    `/response/${appletId}/note`,
    {},
    {
      params: {
        responseId,
        note,
      },
      signal,
    },
  );

export const downloadGcpFileApi = (
  { appletId, bucket, key, isAzure }: DownloadGcpFile,
  signal?: AbortSignal,
) =>
  authApiClient.post(
    `/response/${appletId}/downloadGCPData`,
    {},
    {
      params: {
        bucket,
        key,
        isAzure,
      },
      signal,
    },
  );

export const updateNoteApi = ({ appletId, noteId, note }: UpdateNote, signal?: AbortSignal) =>
  authApiClient.put(
    `/response/${appletId}/note`,
    {},
    {
      params: {
        noteId,
        note,
      },
      signal,
    },
  );

export const deleteNoteApi = ({ appletId, noteId }: DeleteNote, signal?: AbortSignal) =>
  authApiClient.delete(`/response/${appletId}/note`, {
    params: {
      noteId,
    },
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

export const postAppletInviteLinkApi = ({ appletId }: AppletId, signal?: AbortSignal) =>
  authApiClient.post(`/applet/${appletId}/inviteLink`, {}, { signal });

export const deleteAppletInviteLinkApi = ({ appletId }: AppletId, signal?: AbortSignal) =>
  authApiClient.delete(`/applet/${appletId}/inviteLink`, { signal });

export const getAppletInviteLinkApi = ({ appletId }: AppletId, signal?: AbortSignal) =>
  authApiClient.get(`/applet/${appletId}/inviteLink`, { signal });

export const downloadReviewsApi = (
  { appletId, responseId }: DownloadReviews,
  signal?: AbortSignal,
) =>
  authApiClient.get(`/response/${appletId}/reviews`, {
    params: {
      responseId,
    },
    signal,
  });

export const postReviewerResponseApi = (
  { response }: PostReviewerResponse,
  signal?: AbortSignal,
) => {
  const data = new FormData();
  data.set('metadata', JSON.stringify(response));

  return authApiClient.post(`/response/${response.applet.id}/${response.activity.id}`, data, {
    signal,
  });
};

export const setPdfPasswordApi = (
  { url, token, password, serverAppletId, accountId, appletId }: SetPdfPassword,
  signal?: AbortSignal,
) =>
  apiClient.post(
    attachUrl(url, 'set-password'),
    {
      password,
      serverAppletId,
      accountId,
      appletId,
    },
    { headers: { token }, signal },
  );

export const setWelcomeAppletStatusApi = (
  { appletId, status }: SetWelcomeStatus,
  signal?: AbortSignal,
) =>
  apiClient.put(
    `/applet/${appletId}/welcomeApplet`,
    {},
    {
      params: { status },
      signal,
    },
  );

// TODO: Make functionality to getAppletApi and getUsersDataApi as in vue project.
//  Maybe move that logic to redux thunk
export const getAppletApi = (
  { retrieveSchedule, allEvent, id, nextActivity }: GetApplet,
  signal?: AbortSignal,
) => {
  let url = `/applet/${id}?retrieveSchedule=${retrieveSchedule}&retrieveAllEvents=${allEvent}&retrieveItems=true`;
  if (nextActivity) {
    url += `&nextActivity=${nextActivity}`;
  }

  return authApiClient.get(url, { signal });
};

export const getUsersDataApi = (
  { appletId, options, pageIndex }: GetUsersData,
  signal?: AbortSignal,
) =>
  authApiClient.get(`/applet/${appletId}/data`, {
    params: {
      ...options,
      pagination: {
        allow: true,
        pageIndex: pageIndex || 0,
      },
    },
    signal,
  });
