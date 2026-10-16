import { apiSlice } from 'shared/api/apiSlice';

import { MsaStatusResponse, MsaStatusResult } from './api.types';

export const msaApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMsaStatus: builder.query<MsaStatusResult, void>({
      query: () => ({ url: '/legal/msa/status' }),
      transformResponse: ({ result }: MsaStatusResponse) => result,
      providesTags: ['MsaStatus'],
    }),

    // Accepting from the grace prompt; refetches the status so the prompt and banner go away
    acceptMsa: builder.mutation<MsaStatusResult, { msaVersion: string }>({
      query: (body) => ({ url: '/legal/msa/accept', method: 'post', body }),
      transformResponse: ({ result }: MsaStatusResponse) => result,
      invalidatesTags: ['MsaStatus'],
    }),
  }),
});

export const { useGetMsaStatusQuery, useAcceptMsaMutation } = msaApiSlice;
