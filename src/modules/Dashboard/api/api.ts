import axios from 'axios';

import { authApiClient } from 'shared/api/api.client';
import { AppletId, ActivityId, ActivityFlowId, Response, ResponseWithObject } from 'shared/api';
import { EncryptedAnswerSharedProps, ExportDataResult } from 'shared/types';
import { MAX_LIMIT } from 'shared/consts'; // TODO: replace MAX_LIMIT with infinity scroll

import {
  TransferOwnershipType,
  AppletInvitationData,
  DuplicateApplet,
  FolderId,
  AppletEncryption,
  UpdatePin,
  UpdateFolder,
  TogglePin,
  PublishApplet,
  PostAppletPublicLink,
  GetAppletsParams,
  CreateEventType,
  OwnerId,
  Answers,
  GetAnswersNotesParams,
  NoteId,
  Note,
  AppletSubmitDateList,
  RespondentId,
  EventId,
  RemoveRespondentAccess,
  AppletDataRetention,
  ImportSchedule,
  GetWorkspaceAppletsParams,
  FolderName,
  ReportConfig,
  EditRespondent,
  AppletVersionChanges,
  RemoveAccess,
  ActivityAnswer,
  Folder,
  Applet,
  EditManagerAccess,
  ExportData,
  SaveAssessment,
  DatavizActivity,
  Version,
  SummaryAnswers,
  DatavizAnswer,
  Identifier,
  ReviewActivity,
  Review,
  AssessmentReview,
  AppletName,
  LatestReport,
  Identifiers,
  GetRespondentDetailsParams,
  AssessmentResult,
  SubmitDates,
  AppletShellAccountData,
  SubjectInvitationData,
} from './api.types';
import { DEFAULT_ROWS_PER_PAGE } from './api.const';

export const getUserDetailsApi = (signal?: AbortSignal) =>
  authApiClient.get('/users/me', { signal });

export const getWorkspaceAppletsApi = (
  { params }: GetWorkspaceAppletsParams,
  signal?: AbortSignal,
) => {
  const { ownerId, ...restParams } = params;

  return authApiClient.get<Response<Applet>>(`/workspaces/${ownerId}/applets`, {
    params: restParams,
    signal,
  });
};

export const getWorkspaceFolderAppletsApi = (
  { params }: GetWorkspaceAppletsParams,
  signal?: AbortSignal,
) => {
  const { ownerId, folderId } = params;

  return authApiClient.get<Response<Applet>>(`/workspaces/${ownerId}/folders/${folderId}/applets`, {
    signal,
  });
};

export const getFilteredWorkspaceAppletsApi = (
  { params }: GetWorkspaceAppletsParams,
  signal?: AbortSignal,
) => {
  const { ownerId, search, ...restParams } = params;

  return authApiClient.get<Response<Applet>>(`/workspaces/${ownerId}/applets/search/${search}`, {
    params: restParams,
    signal,
  });
};

export const getWorkspaceManagersApi = ({ params }: GetAppletsParams, signal?: AbortSignal) => {
  const { ownerId, appletId, ...restParams } = params;

  return authApiClient.get(
    `/workspaces/${ownerId}/${appletId ? `applets/${appletId}/` : ''}managers`,
    {
      params: restParams,
      signal,
    },
  );
};

export const getWorkspaceRespondentsApi = ({ params }: GetAppletsParams, signal?: AbortSignal) => {
  const { ownerId, appletId, ...restParams } = params;

  return authApiClient.get(
    `/workspaces/${ownerId}/${appletId ? `applets/${appletId}/` : ''}respondents`,
    {
      params: restParams,
      signal,
    },
  );
};

export const getWorkspaceInfoApi = ({ ownerId }: OwnerId, signal?: AbortSignal) =>
  authApiClient.get(`/workspaces/${ownerId}`, {
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

export const createEventApi = ({ appletId, body }: CreateEventType, signal?: AbortSignal) =>
  authApiClient.post(`/applets/${appletId}/events`, body, {
    signal,
  });

export const createIndividualEventsApi = (
  { appletId, respondentId }: AppletId & RespondentId,
  signal?: AbortSignal,
) =>
  authApiClient.post(
    `/applets/${appletId}/events/individual/${respondentId}`,
    {},
    {
      signal,
    },
  );

export const updateEventApi = (
  { appletId, body, eventId }: CreateEventType & EventId,
  signal?: AbortSignal,
) => authApiClient.put(`/applets/${appletId}/events/${eventId}`, body, { signal });

export const importScheduleApi = ({ appletId, body }: ImportSchedule, signal?: AbortSignal) =>
  authApiClient.post(`/applets/${appletId}/events/import`, body, {
    signal,
  });

export const getEventsApi = (
  { appletId, respondentId }: AppletId & Partial<RespondentId>,
  signal?: AbortSignal,
) =>
  authApiClient.get(`/applets/${appletId}/events`, {
    params: {
      respondentId,
    },
    signal,
  });

export const deleteScheduledEventsApi = ({ appletId }: AppletId, signal?: AbortSignal) =>
  authApiClient.delete(`/applets/${appletId}/events`, { signal });

export const deleteEventApi = ({ appletId, eventId }: AppletId & EventId, signal?: AbortSignal) =>
  authApiClient.delete(`/applets/${appletId}/events/${eventId}`, { signal });

export const deleteIndividualEventsApi = (
  { appletId, respondentId }: AppletId & RespondentId,
  signal?: AbortSignal,
) =>
  authApiClient.delete(`/applets/${appletId}/events/delete_individual/${respondentId}`, { signal });

export const removeIndividualEventsApi = (
  { appletId, respondentId }: AppletId & RespondentId,
  signal?: AbortSignal,
) =>
  authApiClient.delete(`/applets/${appletId}/events/remove_individual/${respondentId}`, { signal });

export const removeManagerAccessApi = ({ userId, appletIds }: RemoveAccess, signal?: AbortSignal) =>
  authApiClient.delete('/workspaces/managers/removeAccess', {
    signal,
    data: {
      userId,
      appletIds,
    },
  });

export const editManagerAccessApi = (
  { ownerId, userId, accesses }: EditManagerAccess,
  signal?: AbortSignal,
) =>
  authApiClient.post(
    `/workspaces/${ownerId}/managers/${userId}/accesses`,
    {
      accesses,
    },
    { signal },
  );

export const removeRespondentAccessApi = (
  { userId, appletIds, deleteResponses }: RemoveRespondentAccess,
  signal?: AbortSignal,
) =>
  authApiClient.delete('/applets/respondent/removeAccess', {
    signal,
    data: {
      userId,
      appletIds,
      deleteResponses,
    },
  });

export const editRespondentApi = (
  { ownerId, appletId, respondentId, values }: EditRespondent,
  signal?: AbortSignal,
) =>
  authApiClient.post(
    `/workspaces/${ownerId}/applets/${appletId}/respondents/${respondentId}`,
    {
      ...values,
    },
    { signal },
  );

export const deleteAppletApi = ({ appletId }: AppletId, signal?: AbortSignal) =>
  authApiClient.delete(`/applets/${appletId}`, {
    signal,
  });

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

export const postAppletShellAccountApi = (
  { appletId, options }: AppletShellAccountData,
  signal?: AbortSignal,
) =>
  authApiClient.post(
    `/invitations/${appletId}/shell-account`,
    { ...options },
    {
      signal,
    },
  );

export const postSubjectInvitationApi = (
  { appletId, respondentId, email }: SubjectInvitationData,
  signal?: AbortSignal,
) =>
  authApiClient.post(
    `/invitations/${appletId}/subject`,
    { subjectId: respondentId, email },
    {
      signal,
    },
  );

export const duplicateAppletApi = ({ appletId, options }: DuplicateApplet, signal?: AbortSignal) =>
  authApiClient.post(
    `/applets/${appletId}/duplicate`,
    { ...options },
    {
      signal,
    },
  );

export const setAppletEncryptionApi = (
  { appletId, encryption }: AppletEncryption,
  signal?: AbortSignal,
) => authApiClient.post(`/applets/${appletId}/encryption`, { ...encryption }, { signal });

export const getInvitationsApi = ({ params }: GetAppletsParams, signal?: AbortSignal) => {
  const { ownerId, ...restParams } = params;

  return authApiClient.get('/invitations', {
    params: restParams,
    signal,
  });
};

export const updateRespondentsPinApi = ({ ownerId, userId }: UpdatePin, signal?: AbortSignal) =>
  authApiClient.post(
    `/workspaces/${ownerId}/respondents/${userId}/pin`,
    {},
    {
      signal,
    },
  );

export const updateManagersPinApi = ({ ownerId, userId }: UpdatePin, signal?: AbortSignal) =>
  authApiClient.post(
    `/workspaces/${ownerId}/managers/${userId}/pin`,
    {},
    {
      signal,
    },
  );

export const getAppletsInFolderApi = ({ folderId }: FolderId, signal?: AbortSignal) =>
  authApiClient.get(`/folder/${folderId}/applets`, {
    signal,
  });

export const deleteFolderApi = ({ ownerId, folderId }: OwnerId & FolderId, signal?: AbortSignal) =>
  authApiClient.delete(`/workspaces/${ownerId}/folders/${folderId}`, {
    signal,
  });

export const setFolderApi = (
  { folderId, appletId }: Partial<FolderId> & AppletId,
  signal?: AbortSignal,
) =>
  authApiClient.post(
    '/applets/set_folder',
    {
      folderId,
      appletId,
    },
    { signal },
  );

export const getWorkspaceFoldersApi = ({ ownerId }: OwnerId, signal?: AbortSignal) =>
  authApiClient.get<Response<Folder>>(`/workspaces/${ownerId}/folders`, {
    signal,
  });

export const saveFolderApi = ({ ownerId, name }: OwnerId & FolderName, signal?: AbortSignal) =>
  authApiClient.post(
    `/workspaces/${ownerId}/folders`,
    { name },
    {
      signal,
    },
  );

export const updateFolderApi = ({ ownerId, name, folderId }: UpdateFolder, signal?: AbortSignal) =>
  authApiClient.put(`/workspaces/${ownerId}/folders/${folderId}`, { name }, { signal });

export const togglePinApi = (
  { ownerId, appletId, folderId, isPinned }: TogglePin,
  signal?: AbortSignal,
) => {
  const method = isPinned ? 'post' : 'delete';

  return authApiClient[method](
    `/workspaces/${ownerId}/folders/${folderId}/pin/${appletId}`,
    {},
    { signal },
  );
};

export const checkAppletNameInLibraryApi = ({ appletName }: AppletName, signal?: AbortSignal) =>
  authApiClient.post('/library/check_name', { name: appletName }, { signal });

export const publishAppletToLibraryApi = (
  { appletId, keywords, appletName }: PublishApplet,
  signal?: AbortSignal,
) =>
  authApiClient.post(
    '/library',
    {
      appletId,
      keywords,
      name: appletName,
    },
    { signal },
  );

export const getAppletSearchTermsApi = ({ appletId }: AppletId, signal?: AbortSignal) =>
  authApiClient.get(`/applet/${appletId}/searchTerms`, {
    signal,
  });

export const getAppletLibraryUrlApi = ({ appletId }: AppletId, signal?: AbortSignal) =>
  authApiClient.get(`/applets/${appletId}/library_link`, {
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

export const getReviewActivitiesApi = (
  { appletId, respondentId, createdDate }: Answers,
  signal?: AbortSignal,
) =>
  authApiClient.get<Response<ReviewActivity>>(`/answers/applet/${appletId}/review/activities`, {
    params: {
      respondentId,
      createdDate,
      limit: MAX_LIMIT,
    },
    signal,
  });

export const getAnswerApi = ({ appletId, answerId }: ActivityAnswer, signal?: AbortSignal) =>
  authApiClient.get(`/answers/applet/${appletId}/answers/${answerId}`, { signal });

export const getActivityAnswerApi = (
  { appletId, answerId, activityId }: ActivityAnswer,
  signal?: AbortSignal,
) =>
  authApiClient.get<ResponseWithObject<EncryptedAnswerSharedProps>>(
    `/answers/applet/${appletId}/answers/${answerId}/activities/${activityId}`,
    {
      params: { limit: MAX_LIMIT },
      signal,
    },
  );

export const getAnswersNotesApi = (
  { appletId, answerId, activityId, params }: ActivityAnswer & GetAnswersNotesParams,
  signal?: AbortSignal,
) =>
  authApiClient.get(
    `/answers/applet/${appletId}/answers/${answerId}/activities/${activityId}/notes`,
    {
      params: {
        ...params,
        limit: MAX_LIMIT,
      },
      signal,
    },
  );

export const createAnswerNoteApi = (
  { appletId, answerId, activityId, note }: ActivityAnswer & Note,
  signal?: AbortSignal,
) =>
  authApiClient.post(
    `/answers/applet/${appletId}/answers/${answerId}/activities/${activityId}/notes`,
    { note },
    {
      signal,
    },
  );

export const editAnswerNoteApi = (
  { appletId, answerId, noteId, activityId, note }: ActivityAnswer & NoteId & Note,
  signal?: AbortSignal,
) =>
  authApiClient.put(
    `/answers/applet/${appletId}/answers/${answerId}/activities/${activityId}/notes/${noteId}`,
    { note },
    {
      signal,
    },
  );

export const deleteAnswerNoteApi = (
  { appletId, answerId, activityId, noteId }: ActivityAnswer & NoteId,
  signal?: AbortSignal,
) =>
  authApiClient.delete(
    `/answers/applet/${appletId}/answers/${answerId}/activities/${activityId}/notes/${noteId}`,
    {
      signal,
    },
  );

export const getAppletSubmitDateListApi = (
  { appletId, ...params }: AppletSubmitDateList,
  signal?: AbortSignal,
) =>
  authApiClient.get<ResponseWithObject<SubmitDates>>(`/answers/applet/${appletId}/dates`, {
    params,
    signal,
  });

export const getAssessmentApi = ({ appletId, answerId }: AssessmentReview, signal?: AbortSignal) =>
  authApiClient.get<ResponseWithObject<AssessmentResult>>(
    `/answers/applet/${appletId}/answers/${answerId}/assessment`,
    {
      signal,
    },
  );

export const createAssessmentApi = (
  { appletId, answerId, ...assessment }: SaveAssessment,
  signal?: AbortSignal,
) =>
  authApiClient.post(
    `/answers/applet/${appletId}/answers/${answerId}/assessment`,
    { ...assessment },
    {
      signal,
    },
  );

export const getReviewsApi = ({ appletId, answerId }: AssessmentReview, signal?: AbortSignal) =>
  authApiClient.get<Response<Review>>(`/answers/applet/${appletId}/answers/${answerId}/reviews`, {
    signal,
  });

export const getSummaryActivitiesApi = (
  { appletId, respondentId }: AppletId & RespondentId,
  signal?: AbortSignal,
) =>
  authApiClient.get<Response<DatavizActivity>>(`/answers/applet/${appletId}/summary/activities`, {
    params: {
      respondentId,
      limit: MAX_LIMIT,
    },
    signal,
  });

export const getIdentifiersApi = (
  { appletId, activityId, respondentId }: Identifiers,
  signal?: AbortSignal,
) =>
  authApiClient.get<Response<Identifier>>(
    `/answers/applet/${appletId}/summary/activities/${activityId}/identifiers`,
    {
      params: {
        respondentId,
      },
      signal,
    },
  );

export const getVersionsApi = (
  { appletId, activityId }: AppletId & { activityId: string },
  signal?: AbortSignal,
) =>
  authApiClient.get<Response<Version>>(
    `/answers/applet/${appletId}/summary/activities/${activityId}/versions`,
    {
      signal,
    },
  );

export const getLatestReportApi = (
  { appletId, activityId, respondentId }: LatestReport,
  signal?: AbortSignal,
) =>
  authApiClient.post(
    `/answers/applet/${appletId}/activities/${activityId}/answers/${respondentId}/latest_report`,
    {},
    {
      responseType: 'arraybuffer',
      signal,
    },
  );

export const getAnswersApi = (
  { appletId, activityId, params: { identifiers, versions, ...params } }: SummaryAnswers,
  signal?: AbortSignal,
) =>
  authApiClient.get<Response<DatavizAnswer>>(
    `/answers/applet/${appletId}/activities/${activityId}/answers`,
    {
      params: {
        ...params,
        identifiers: identifiers?.join(','),
        versions: versions?.join(','),
      },
      signal,
    },
  );

export const postAppletDataRetentionApi = (
  { appletId, ...dataRetentionParams }: AppletDataRetention,
  signal?: AbortSignal,
) =>
  authApiClient.post(
    `/applets/${appletId}/retentions`,
    { ...dataRetentionParams },
    {
      signal,
    },
  );

export const publishAppletApi = ({ appletId }: AppletId, signal?: AbortSignal) =>
  authApiClient.post(`/applets/${appletId}/publish`, { signal });

export const concealAppletApi = ({ appletId }: AppletId, signal?: AbortSignal) =>
  authApiClient.post(`/applets/${appletId}/conceal`, { signal });

export const postReportConfigApi = (
  { appletId, ...params }: AppletId & ReportConfig,
  signal?: AbortSignal,
) => authApiClient.post(`/applets/${appletId}/report_configuration`, { ...params }, { signal });

export const postActivityReportConfigApi = (
  {
    appletId,
    activityId,
    ...params
  }: AppletId & ActivityId & Pick<ReportConfig, 'reportIncludedItemName'>,
  signal?: AbortSignal,
) =>
  authApiClient.put(
    `/applets/${appletId}/activities/${activityId}/report_configuration`,
    { ...params },
    { signal },
  );

export const postActivityFlowReportConfigApi = (
  {
    appletId,
    activityFlowId,
    ...params
  }: AppletId &
    ActivityFlowId &
    Pick<ReportConfig, 'reportIncludedItemName' | 'reportIncludedActivityName'>,
  signal?: AbortSignal,
) =>
  authApiClient.put(
    `/applets/${appletId}/flows/${activityFlowId}/report_configuration`,
    { ...params },
    { signal },
  );

export const getAppletVersionsApi = ({ appletId }: AppletId, signal?: AbortSignal) =>
  authApiClient.get(`/applets/${appletId}/versions`, { signal });

export const getAppletVersionChangesApi = (
  { appletId, version }: AppletVersionChanges,
  signal?: AbortSignal,
) => authApiClient.get(`/applets/${appletId}/versions/${version}/changes`, { signal });

export const getExportDataApi = (
  { appletId, page = 1, limit = DEFAULT_ROWS_PER_PAGE, ...rest }: ExportData,
  signal?: AbortSignal,
) =>
  authApiClient.get<ResponseWithObject<ExportDataResult>>(`/answers/applet/${appletId}/data`, {
    params: {
      page,
      limit,
      ...rest,
    },
    signal,
  });

export const getOptionTextApi = (url: string) =>
  axios({
    method: 'get',
    url,
  });

export const getRespondentDetailsApi = (
  { ownerId, appletId, respondentId }: GetRespondentDetailsParams,
  signal?: AbortSignal,
) =>
  authApiClient.get(`/workspaces/${ownerId}/applets/${appletId}/respondents/${respondentId}`, {
    signal,
  });
