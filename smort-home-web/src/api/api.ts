import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { config } from '../config';

export const api = createApi({
  reducerPath: 'lights',
  baseQuery: fetchBaseQuery({ baseUrl: config.serverUrl }),
  endpoints: (builder) => ({
    updateLight: builder.mutation<void, { id: string; on: boolean }>({
      query: ({ id, on }) => ({
        method: 'POST',
        url: `light/${id}`,
        body: { on },
      }),
    }),
  }),
});

export const { useUpdateLightMutation } = api;
