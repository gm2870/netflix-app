import { Media } from '@/src/store/redux/media/model';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const mediaApi = createApi({
  reducerPath: 'mediaApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:8001/api/v1',
  }),
  endpoints: (build) => ({
    getBillboardMedia: build.query<Media, string>({
      query: (type: string) => {
        let url = '';
        switch (type) {
          case '1':
            url = '/media/billboard/tv';
            break;
          case '2':
            url = '/media/billboard/movie';
            break;
          default:
            url = '/media/billboard/general';
            break;
        }
        return { url };
      },
      transformResponse: (
        response: { data: Media; status: string },
        meta,
        arg
      ) => {
        return response.data;
      },
    }),
  }),
});

export const { useGetBillboardMediaQuery } = mediaApi;
