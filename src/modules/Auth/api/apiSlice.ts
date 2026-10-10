import { apiSlice } from 'shared/api/apiSlice';

import { MsaVersionResponse } from './api.types';

export const apiAuthSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMsaVersion: builder.query<string, void>({
      query: () => ({ url: '/legal/msa' }),
      transformResponse: ({ result }: MsaVersionResponse) => result.version,
    }),
  }),
});

export const { useGetMsaVersionQuery } = apiAuthSlice;
