import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

import { AppletId, ActivityId, ActivityFlowId, Response, ResponseWithObject } from 'shared/api';
import { ExportDataResult } from 'shared/types';
import { DEFAULT_ROWS_PER_PAGE as SHARED_DEFAULT_ROWS_PER_PAGE, MAX_LIMIT } from 'shared/consts'; // TODO: replace MAX_LIMIT with infinity scroll
import { authApiClient } from 'shared/api/apiConfig';

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
  GetNotesParams,
  NoteId,
  Note,
  AppletSubmitDateList,
  RespondentId,
  EventId,
  AppletDataRetention,
  ImportSchedule,
  GetWorkspaceAppletsParams,
  FolderName,
  ReportConfig,
  AppletVersionChanges,
  RemoveAccess,
  ActivityAnswerParams,
  Folder,
  Applet,
  EditManagerAccess,
  ExportData,
  SaveAssessment,
  Version,
  EncryptedActivityAnswers,
  Identifier,
  Review,
  AssessmentReview,
  AppletName,
  GetRespondentDetailsParams,
  AssessmentResult,
  SubmitDates,
  AppletShellAccountData,
  SubjectInvitationData,
  EditSubject,
  DeleteSubject,
  TargetSubjectId,
  SubjectId,
  GetActivitiesParams,
  DeleteReview,
  EncryptedActivityAnswer,
  Integration,
  GetWorkspaceRespondentsParams,
  GetAppletSubmissionsParams,
  GetAppletSubmissionsResponse,
  ReviewEntity,
  FlowAnswersParams,
  EncryptedFlowAnswers,
  DatavizEntity,
  GetFlowIdentifiersParams,
  GetFlowVersionsParams,
  GetActivityIdentifiersParams,
  GetActivityVersionsParams,
  SummaryActivityAnswersParams,
  SummaryFlowAnswersParams,
  GetLatestReportParams,
  EncryptedFlowsAnswers,
  SaveFlowAssessmentParams,
  DeleteFlowReviewParams,
  AssessmentFlowReviewParams,
  FeedbackNote,
  GetActivityResponse,
  GetActivityParams,
  EditSubjectResponse,
  CreateTemporaryMultiInformantRelation,
  GetAssignmentsParams,
  PostAssignmentsParams,
  GetSubjectActivitiesParams,
  AppletSubjectActivitiesResponse,
  AppletActivitiesResponse,
  AppletAssignmentsResponse,
  AppletParticipantActivitiesResponse,
} from './api.types';
import { DEFAULT_ROWS_PER_PAGE } from './api.const';
import { ApiSuccessResponse } from './base.types';

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

export const getWorkspaceRespondentsApi = (
  { params }: GetWorkspaceRespondentsParams,
  signal?: AbortSignal,
) => {
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

export const editSubjectApi = (
  { subjectId, values }: EditSubject,
  signal?: AbortSignal,
): Promise<AxiosResponse<ApiSuccessResponse<EditSubjectResponse>>> =>
  authApiClient.put(
    `/subjects/${subjectId}`,
    {
      ...values,
    },
    { signal },
  );

export const deleteSubjectApi = (
  { subjectId, deleteAnswers }: DeleteSubject,
  signal?: AbortSignal,
) =>
  authApiClient.delete(`/subjects/${subjectId}`, {
    signal,
    data: {
      deleteAnswers,
    },
  });

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
  { appletId, subjectId, email, language }: SubjectInvitationData,
  signal?: AbortSignal,
) =>
  authApiClient.post(
    `/invitations/${appletId}/subject`,
    { subjectId, email, language },
    {
      signal,
    },
  );

export const duplicateAppletApi = ({ appletId, options }: DuplicateApplet, signal?: AbortSignal) =>
  authApiClient.post<ResponseWithObject<Applet>>(
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
  const { ownerId: _ownerId, ...restParams } = params;

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

export const updateSubjectsPinApi = ({ ownerId, userId }: UpdatePin, signal?: AbortSignal) =>
  authApiClient.post(
    `/workspaces/${ownerId}/subjects/${userId}/pin`,
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
  { appletId, targetSubjectId, createdDate }: Answers,
  signal?: AbortSignal,
) =>
  authApiClient.get<Response<ReviewEntity>>(`/answers/applet/${appletId}/review/activities`, {
    params: {
      targetSubjectId,
      createdDate,
      limit: MAX_LIMIT,
    },
    signal,
  });

export const getReviewFlowsApi = (
  { appletId, targetSubjectId, createdDate }: Answers,
  signal?: AbortSignal,
) =>
  authApiClient.get<Response<ReviewEntity>>(`/answers/applet/${appletId}/review/flows`, {
    params: {
      targetSubjectId,
      createdDate,
      limit: MAX_LIMIT,
    },
    signal,
  });

export const getAnswerApi = ({ appletId, answerId }: ActivityAnswerParams, signal?: AbortSignal) =>
  authApiClient.get(`/answers/applet/${appletId}/answers/${answerId}`, { signal });

export const getActivityApi = ({ activityId }: GetActivityParams, signal?: AbortSignal) =>
  authApiClient.get(`activities/${activityId}`, { signal }) as Promise<
    AxiosResponse<GetActivityResponse>
  >;

export const getActivityAnswerApi = (
  { appletId, answerId, activityId }: ActivityAnswerParams,
  signal?: AbortSignal,
) =>
  authApiClient.get<ResponseWithObject<EncryptedActivityAnswer>>(
    `/answers/applet/${appletId}/activities/${activityId}/answers/${answerId}`,
    {
      params: { limit: MAX_LIMIT },
      signal,
    },
  );

export const getAppletSubmissionsApi = (
  { appletId, page = 1, limit = SHARED_DEFAULT_ROWS_PER_PAGE }: GetAppletSubmissionsParams,
  signal?: AbortSignal,
) =>
  authApiClient.get(`/answers/applet/${appletId}/submissions`, {
    params: { page, limit: Math.min(limit, MAX_LIMIT) },
    signal,
  }) as Promise<AxiosResponse<GetAppletSubmissionsResponse>>;

export const getFlowAnswersApi = (
  { appletId, submitId, flowId }: FlowAnswersParams,
  signal?: AbortSignal,
) =>
  authApiClient.get<ResponseWithObject<EncryptedFlowAnswers>>(
    `/answers/applet/${appletId}/flows/${flowId}/submissions/${submitId}`,
    {
      params: { limit: MAX_LIMIT },
      signal,
    },
  );

export const getNotesApi = (
  {
    appletId,
    answerId,
    activityId,
    submitId,
    flowId,
    params,
  }: Partial<ActivityAnswerParams> & Partial<FlowAnswersParams> & GetNotesParams,
  signal?: AbortSignal,
) =>
  authApiClient.get<Response<FeedbackNote>>(
    answerId && activityId
      ? `/answers/applet/${appletId}/answers/${answerId}/activities/${activityId}/notes`
      : `/answers/applet/${appletId}/submissions/${submitId}/flows/${flowId}/notes`,
    {
      params: {
        ...params,
        limit: MAX_LIMIT,
      },
      signal,
    },
  );

export const createNoteApi = (
  {
    appletId,
    answerId,
    activityId,
    submitId,
    flowId,
    note,
  }: Partial<ActivityAnswerParams> & Partial<FlowAnswersParams> & Note,
  signal?: AbortSignal,
) =>
  authApiClient.post(
    answerId && activityId
      ? `/answers/applet/${appletId}/answers/${answerId}/activities/${activityId}/notes`
      : `/answers/applet/${appletId}/submissions/${submitId}/flows/${flowId}/notes`,
    { note },
    {
      signal,
    },
  );

export const editNoteApi = (
  {
    appletId,
    answerId,
    activityId,
    submitId,
    flowId,
    noteId,
    note,
  }: Partial<ActivityAnswerParams> & Partial<FlowAnswersParams> & NoteId & Note,
  signal?: AbortSignal,
) =>
  authApiClient.put(
    answerId && activityId
      ? `/answers/applet/${appletId}/answers/${answerId}/activities/${activityId}/notes/${noteId}`
      : `/answers/applet/${appletId}/submissions/${submitId}/flows/${flowId}/notes/${noteId}`,
    { note },
    {
      signal,
    },
  );

export const deleteNoteApi = (
  {
    appletId,
    answerId,
    activityId,
    submitId,
    flowId,
    noteId,
  }: Partial<ActivityAnswerParams> & Partial<FlowAnswersParams> & NoteId,
  signal?: AbortSignal,
) =>
  authApiClient.delete(
    answerId && activityId
      ? `/answers/applet/${appletId}/answers/${answerId}/activities/${activityId}/notes/${noteId}`
      : `/answers/applet/${appletId}/submissions/${submitId}/flows/${flowId}/notes/${noteId}`,
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

export const getFlowAssessmentApi = (
  { appletId, submitId }: AssessmentFlowReviewParams,
  signal?: AbortSignal,
) =>
  authApiClient.get<ResponseWithObject<AssessmentResult>>(
    `/answers/applet/${appletId}/submissions/${submitId}/assessments`,
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

export const createFlowAssessmentApi = (
  { appletId, submitId, ...assessment }: SaveFlowAssessmentParams,
  signal?: AbortSignal,
) =>
  authApiClient.post(
    `/answers/applet/${appletId}/submissions/${submitId}/assessments`,
    { ...assessment },
    {
      signal,
    },
  );

export const deleteReviewApi = (
  { appletId, answerId, assessmentId }: DeleteReview,
  signal?: AbortSignal,
) =>
  authApiClient.delete(
    `/answers/applet/${appletId}/answers/${answerId}/assessment/${assessmentId}`,
    {
      signal,
    },
  );

export const deleteFlowReviewApi = (
  { appletId, submitId, assessmentId }: DeleteFlowReviewParams,
  signal?: AbortSignal,
) =>
  authApiClient.delete(
    `/answers/applet/${appletId}/submissions/${submitId}/assessments/${assessmentId}`,
    {
      signal,
    },
  );

export const getReviewsApi = ({ appletId, answerId }: AssessmentReview, signal?: AbortSignal) =>
  authApiClient.get<Response<Review>>(`/answers/applet/${appletId}/answers/${answerId}/reviews`, {
    signal,
  });

export const getFlowReviewsApi = (
  { appletId, submitId }: AssessmentFlowReviewParams,
  signal?: AbortSignal,
) =>
  authApiClient.get<Response<Review>>(
    `/answers/applet/${appletId}/submissions/${submitId}/reviews`,
    {
      signal,
    },
  );

export const getSummaryActivitiesApi = (
  { appletId, targetSubjectId }: AppletId & TargetSubjectId,
  signal?: AbortSignal,
) =>
  authApiClient.get<Response<DatavizEntity>>(`/answers/applet/${appletId}/summary/activities`, {
    params: {
      targetSubjectId,
      limit: MAX_LIMIT,
    },
    signal,
  });

export const getSummaryFlowsApi = (
  { appletId, targetSubjectId }: AppletId & TargetSubjectId,
  signal?: AbortSignal,
) =>
  authApiClient.get<Response<DatavizEntity>>(`/answers/applet/${appletId}/summary/flows`, {
    params: {
      targetSubjectId,
      limit: MAX_LIMIT,
    },
    signal,
  });

export const getActivityIdentifiersApi = (
  { appletId, activityId, targetSubjectId }: GetActivityIdentifiersParams,
  signal?: AbortSignal,
) =>
  authApiClient.get<Response<Identifier>>(
    `/answers/applet/${appletId}/summary/activities/${activityId}/identifiers`,
    {
      params: {
        targetSubjectId,
      },
      signal,
    },
  );

export const getFlowIdentifiersApi = (
  { appletId, flowId, targetSubjectId }: GetFlowIdentifiersParams,
  signal?: AbortSignal,
) =>
  authApiClient.get<Response<Identifier>>(
    `/answers/applet/${appletId}/flows/${flowId}/identifiers`,
    {
      params: {
        targetSubjectId,
      },
      signal,
    },
  );

export const getActivityVersionsApi = (
  { appletId, activityId }: GetActivityVersionsParams,
  signal?: AbortSignal,
) =>
  authApiClient.get<Response<Version>>(
    `/answers/applet/${appletId}/summary/activities/${activityId}/versions`,
    {
      signal,
    },
  );

export const getFlowVersionsApi = (
  { appletId, flowId }: GetFlowVersionsParams,
  signal?: AbortSignal,
) =>
  authApiClient.get<Response<Version>>(`/answers/applet/${appletId}/flows/${flowId}/versions`, {
    signal,
  });

export const getLatestReportApi = (
  { appletId, activityId, flowId, subjectId }: GetLatestReportParams,
  signal?: AbortSignal,
) =>
  authApiClient.post(
    `/answers/applet/${appletId}/${
      activityId ? `activities/${activityId}` : `flows/${flowId}`
    }/subjects/${subjectId}/latest_report`,
    {},
    {
      responseType: 'arraybuffer',
      signal,
    },
  );

export const getActivityAnswersApi = (
  {
    appletId,
    activityId,
    params: { identifiers, versions, ...params },
  }: SummaryActivityAnswersParams,
  signal?: AbortSignal,
) =>
  authApiClient.get<Response<EncryptedActivityAnswers>>(
    `/answers/applet/${appletId}/activities/${activityId}/answers`,
    {
      params: {
        ...params,
        identifiers: identifiers?.join(','),
        versions: versions?.join(','),
        limit: MAX_LIMIT,
      },
      signal,
    },
  );

export const getSummaryFlowAnswersApi = (
  { appletId, flowId, params: { identifiers, versions, ...params } }: SummaryFlowAnswersParams,
  signal?: AbortSignal,
) =>
  authApiClient.get<ResponseWithObject<EncryptedFlowsAnswers>>(
    `/answers/applet/${appletId}/flows/${flowId}/submissions`,
    {
      params: {
        ...params,
        identifiers: identifiers?.join(','),
        versions: versions?.join(','),
        limit: MAX_LIMIT,
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

export const getOptionTextApi = (url: string) => axios.get(url);

export const getRespondentDetailsApi = (
  { ownerId, appletId, respondentId }: GetRespondentDetailsParams,
  signal?: AbortSignal,
) =>
  authApiClient.get(`/workspaces/${ownerId}/applets/${appletId}/respondents/${respondentId}`, {
    signal,
  });

export const getSubjectDetailsApi = ({ subjectId }: SubjectId, signal?: AbortSignal) =>
  authApiClient.get(`/subjects/${subjectId}`, {
    signal,
  });

export const getAppletActivitiesApi = (
  { params: { appletId, ...params } }: GetActivitiesParams,
  signal?: AbortSignal,
): Promise<AxiosResponse<AppletActivitiesResponse>> =>
  authApiClient.get(`/activities/applet/${appletId}`, {
    params,
    signal,
  });

export const getAppletSubjectActivitiesApi = (
  { appletId, subjectId }: GetSubjectActivitiesParams,
  signal?: AbortSignal,
): Promise<AxiosResponse<AppletSubjectActivitiesResponse>> =>
  authApiClient.get(`/activities/applet/${appletId}/subject/${subjectId}`, {
    signal,
  });

export const getAppletTargetSubjectActivitiesApi = (
  { appletId, subjectId }: GetSubjectActivitiesParams,
  signal?: AbortSignal,
): Promise<AxiosResponse<AppletParticipantActivitiesResponse>> =>
  authApiClient.get(`/activities/applet/${appletId}/target/${subjectId}`, {
    signal,
  });

export const getAppletRespondentSubjectActivitiesApi = (
  { appletId, subjectId }: GetSubjectActivitiesParams,
  signal?: AbortSignal,
): Promise<AxiosResponse<AppletParticipantActivitiesResponse>> =>
  authApiClient.get(`/activities/applet/${appletId}/respondent/${subjectId}`, {
    signal,
  });

export const createTemporaryMultiInformantRelationApi = (
  { subjectId, sourceSubjectId }: CreateTemporaryMultiInformantRelation,
  signal?: AbortSignal,
): Promise<AxiosResponse<null>> =>
  authApiClient.post(
    `/subjects/${subjectId}/relations/${sourceSubjectId}/multiinformant-assessment`,
    {},
    {
      signal,
    },
  );

export const getAppletAssignmentsApi = (
  { appletId, ...params }: GetAssignmentsParams,
  signal?: AbortSignal,
): Promise<AxiosResponse<AppletAssignmentsResponse>> =>
  authApiClient.get(`/assignments/applet/${appletId}`, {
    params,
    signal,
  });

export const postAppletAssignmentsApi = (
  { appletId, assignments }: PostAssignmentsParams,
  signal?: AbortSignal,
): Promise<AxiosResponse<AppletAssignmentsResponse>> =>
  authApiClient.post(`/assignments/applet/${appletId}`, {
    assignments: assignments.map((a) => ({
      activity_id: a.activityId,
      activity_flow_id: a.activityFlowId,
      respondent_subject_id: a.respondentSubjectId,
      target_subject_id: a.targetSubjectId,
    })),
    signal,
  });

export const deleteAppletAssignmentsApi = (
  { appletId, assignments }: PostAssignmentsParams,
  signal?: AbortSignal,
): Promise<AxiosResponse<null>> =>
  authApiClient.delete(`/assignments/applet/${appletId}`, {
    data: {
      assignments: assignments.map((a) => ({
        activity_id: a.activityId,
        activity_flow_id: a.activityFlowId,
        respondent_subject_id: a.respondentSubjectId,
        target_subject_id: a.targetSubjectId,
      })),
    },
    signal,
  });

export const enableIntegrationApi = (integrations: Integration[], signal?: AbortSignal) =>
  authApiClient.post('/integrations/', integrations, {
    signal,
  });

export const disableIntegrationApi = (integrations: string[], signal?: AbortSignal) => {
  const config: AxiosRequestConfig = {
    data: integrations,
    signal,
  };

  return authApiClient.delete('/integrations/', config);
};
