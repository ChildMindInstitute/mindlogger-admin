import {
  AppletActivitiesResponse,
  GetActivitiesParams,
  GetWorkspaceManagersParams,
  GetWorkspaceRespondentsParams,
  WorkspaceRespondentsResponse,
  WorkspaceManagersResponse,
  AppletInvitationData,
  AppletShellAccountData,
  EditSubject,
  DeleteSubject,
  EditSubjectResponse,
  SubjectInvitationData,
} from 'api';
import { apiSlice } from 'shared/api/apiSlice';

import { ApiSuccessResponse } from './base.types';

export const apiDashboardSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAppletActivities: builder.query<AppletActivitiesResponse['result'], GetActivitiesParams>({
      query: ({ params: { appletId, ...rest } }) => ({
        url: `activities/applet/${appletId}`,
        params: rest,
      }),
      transformResponse: ({ result }: AppletActivitiesResponse) => result,
      providesTags: (result) => (result ? [{ type: 'Applet', id: result.appletDetail.id }] : []),
    }),

    getWorkspaceManagers: builder.query<WorkspaceManagersResponse, GetWorkspaceManagersParams>({
      query: ({ params: { ownerId, appletId, ...rest } }) => ({
        url: `workspaces/${ownerId}/${appletId ? `applets/${appletId}/` : ''}managers`,
        params: rest,
      }),
      providesTags: (data) => [
        ...(data?.result.map((manager) => ({
          type: 'Manager' as const,
          id: manager.id,
        })) ?? []),
        { type: 'Manager', id: 'LIST' },
      ],
    }),

    getWorkspaceRespondents: builder.query<
      WorkspaceRespondentsResponse,
      GetWorkspaceRespondentsParams
    >({
      query: ({ params: { ownerId, appletId, ...rest } }) => ({
        url: `workspaces/${ownerId}/${appletId ? `applets/${appletId}/` : ''}respondents`,
        params: rest,
      }),
      providesTags: (data) => [
        ...(data?.result.map((respondent) => ({
          type: 'Respondent' as const,
          id: respondent.details[0].subjectId,
        })) ?? []),
        { type: 'Respondent', id: 'LIST' },
      ],
    }),

    createInvitation: builder.mutation<
      ApiSuccessResponse<EditSubjectResponse>,
      AppletInvitationData
    >({
      query: ({ appletId, url, options }) => ({
        url: `invitations/${appletId}/${url}`,
        method: 'POST',
        body: options,
      }),
      invalidatesTags: [
        { type: 'Respondent', id: 'LIST' },
        { type: 'Manager', id: 'LIST' },
      ],
    }),

    createSubjectInvitation: builder.mutation<
      ApiSuccessResponse<EditSubjectResponse>,
      SubjectInvitationData
    >({
      query: ({ appletId, ...body }) => ({
        url: `invitations/${appletId}/subject`,
        method: 'POST',
        body,
      }),
      invalidatesTags: (data, error, { subjectId }) => [{ type: 'Respondent', id: subjectId }],
    }),

    createShellAccount: builder.mutation<
      ApiSuccessResponse<EditSubjectResponse>,
      AppletShellAccountData
    >({
      query: ({ appletId, options }) => ({
        url: `invitations/${appletId}/shell-account`,
        method: 'POST',
        body: options,
      }),
      invalidatesTags: [{ type: 'Respondent', id: 'LIST' }],
    }),

    editSubject: builder.mutation<ApiSuccessResponse<EditSubjectResponse>, EditSubject>({
      query: ({ subjectId, values }) => ({
        url: `subjects/${subjectId}`,
        method: 'PUT',
        body: values,
      }),
      invalidatesTags: (data, error, { subjectId }) => [{ type: 'Respondent', id: subjectId }],
    }),

    deleteSubject: builder.mutation<ApiSuccessResponse<EditSubjectResponse>, DeleteSubject>({
      query: ({ subjectId, deleteAnswers }) => ({
        url: `subjects/${subjectId}`,
        method: 'DELETE',
        body: { deleteAnswers },
      }),
      invalidatesTags: (data, error, { subjectId }) => [{ type: 'Respondent', id: subjectId }],
    }),
  }),
});

export const {
  useGetAppletActivitiesQuery,
  useGetWorkspaceRespondentsQuery,
  useGetWorkspaceManagersQuery,
  useLazyGetWorkspaceRespondentsQuery,
  useLazyGetWorkspaceManagersQuery,
  useCreateInvitationMutation,
  useCreateSubjectInvitationMutation,
  useCreateShellAccountMutation,
  useEditSubjectMutation,
  useDeleteSubjectMutation,
} = apiDashboardSlice;
