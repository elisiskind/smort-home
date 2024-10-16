import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Light, lightsSchema } from './schema';
import { config } from '../config';

export const api = createApi({
  reducerPath: 'lights',
  baseQuery: fetchBaseQuery({ baseUrl: config.serverUrl }),
  endpoints: (builder) => ({
    getLights: builder.query<Light[], void>({
      query: () => `light`,
      transformResponse: (response) => lightsSchema.parse(response),
    }),
    updateLight: builder.mutation<void, { id: string; on: boolean }>({
      query: ({ id, on }) => ({
        method: 'POST',
        url: `light/${id}`,
        body: { on },
      }),
      onQueryStarted: async ({ id, on }, { dispatch, queryFulfilled }) => {
        await queryFulfilled;
        dispatch(
          api.util.updateQueryData('getLights', undefined, (lights) => {
            const light = lights.find((light) => light.id === id);
            if (light) {
              light.on = on;
            }
          }),
        );
      },
    }),
  }),
});

export const { useGetLightsQuery, useUpdateLightMutation } = api;
