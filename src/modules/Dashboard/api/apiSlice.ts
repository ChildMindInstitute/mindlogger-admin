import {
  AppletActivitiesResponse,
  GetActivitiesParams,
  GetWorkspaceManagersParams,
  GetWorkspaceRespondentsParams,
  WorkspaceRespondentsResponse,
  WorkspaceManagersResponse,
} from 'api';
import { apiSlice } from 'shared/api/apiSlice';

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
      providesTags: (data) =>
        data
          ? data.result.map((manager) => ({
              type: 'Manager' as const,
              id: manager.id,
            }))
          : [],
    }),

    getWorkspaceRespondents: builder.query<
      WorkspaceRespondentsResponse,
      GetWorkspaceRespondentsParams
    >({
      query: ({ params: { ownerId, appletId, ...rest } }) => ({
        url: `workspaces/${ownerId}/${appletId ? `applets/${appletId}/` : ''}respondents`,
        params: rest,
      }),
      providesTags: (data) =>
        data
          ? data.result.map((respondent) => ({
              type: 'Respondent' as const,
              id: respondent.details[0].subjectId,
            }))
          : [],
    }),
  }),
});

export const {
  useGetAppletActivitiesQuery,
  useGetWorkspaceRespondentsQuery,
  useGetWorkspaceManagersQuery,
  useLazyGetWorkspaceRespondentsQuery,
  useLazyGetWorkspaceManagersQuery,
} = apiDashboardSlice;
