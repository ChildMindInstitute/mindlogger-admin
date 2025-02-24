import { TagDescription } from '@reduxjs/toolkit/query';

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
        url: `/activities/applet/${appletId}`,
        params: rest,
      }),
      transformResponse: ({ result }: AppletActivitiesResponse) => result,
      providesTags: (result) => (result ? [{ type: 'Applet', id: result.appletDetail.id }] : []),
    }),

    getWorkspaceManagers: builder.query<WorkspaceManagersResponse, GetWorkspaceManagersParams>({
      query: ({ params: { ownerId, appletId, ...rest } }) => ({
        url: `/workspaces/${ownerId}/${appletId ? `applets/${appletId}/` : ''}managers`,
        params: rest,
      }),
      providesTags: (data) => [
        ...(data?.result.map((manager) => ({
          type: 'User' as const,
          id: manager.id,
        })) ?? []),
        { type: 'User', id: 'LIST' },
      ],
    }),

    getWorkspaceRespondents: builder.query<
      WorkspaceRespondentsResponse,
      GetWorkspaceRespondentsParams
    >({
      query: ({ params: { ownerId, appletId, ...rest } }) => ({
        url: `/workspaces/${ownerId}/${appletId ? `applets/${appletId}/` : ''}respondents`,
        params: rest,
      }),
      providesTags: (data) => {
        const tags: TagDescription<'Applet' | 'Subject' | 'User'>[] = [
          { type: 'Subject', id: 'LIST' },
          { type: 'User', id: 'LIST' },
        ];

        if (!data) return tags;

        for (const respondent of data.result) {
          if (respondent.id) {
            tags.push({
              type: 'User' as const,
              id: respondent.id,
            });
          }

          tags.push({
            type: 'Subject' as const,
            id: respondent.details[0].subjectId,
          });
        }

        return tags;
      },
    }),

    createInvitation: builder.mutation<
      ApiSuccessResponse<EditSubjectResponse>,
      AppletInvitationData
    >({
      query: ({ appletId, url, options }) => ({
        url: `/invitations/${appletId}/${url}`,
        method: 'POST',
        body: options,
      }),
      invalidatesTags: [
        { type: 'Subject', id: 'LIST' },
        { type: 'User', id: 'LIST' },
      ],
    }),

    createSubjectInvitation: builder.mutation<
      ApiSuccessResponse<EditSubjectResponse>,
      SubjectInvitationData
    >({
      query: ({ appletId, ...body }) => ({
        url: `/invitations/${appletId}/subject`,
        method: 'POST',
        body,
      }),
      invalidatesTags: (data, error, { subjectId }) => [{ type: 'Subject', id: subjectId }],
    }),

    createShellAccount: builder.mutation<
      ApiSuccessResponse<EditSubjectResponse>,
      AppletShellAccountData
    >({
      query: ({ appletId, options }) => ({
        url: `/invitations/${appletId}/shell-account`,
        method: 'POST',
        body: options,
      }),
      invalidatesTags: [{ type: 'Subject', id: 'LIST' }],
    }),

    editSubject: builder.mutation<ApiSuccessResponse<EditSubjectResponse>, EditSubject>({
      query: ({ subjectId, values }) => ({
        url: `/subjects/${subjectId}`,
        method: 'PUT',
        body: values,
      }),
      invalidatesTags: (data, error, { subjectId }) => [{ type: 'Subject', id: subjectId }],
    }),

    deleteSubject: builder.mutation<ApiSuccessResponse<EditSubjectResponse>, DeleteSubject>({
      query: ({ subjectId, deleteAnswers }) => ({
        url: `/subjects/${subjectId}`,
        method: 'DELETE',
        body: { deleteAnswers },
      }),
      invalidatesTags: (data, error, { subjectId }) => [{ type: 'Subject', id: subjectId }],
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
