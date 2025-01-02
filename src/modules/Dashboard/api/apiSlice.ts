import { AppletActivitiesResponse, GetActivitiesParams } from 'api';
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
  }),
});

export const { useGetAppletActivitiesQuery } = apiDashboardSlice;
