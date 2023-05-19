import { GenreWithMedia, Media } from '@/src/store/redux/media/model';
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
        return response.data || [];
      },
    }),
    getTitlesWithGenre: build.query<
      GenreWithMedia[],
      { type: string; genreId: string }
    >({
      query: ({ type, genreId }) => {
        console.log(genreId);
        let url = '';
        switch (type) {
          case '1':
            url = genreId ? `/media/tv-shows/${genreId}` : '/media/tv-shows';
            break;
          case '2':
            url = genreId ? `/media/movies/${genreId}` : '/media/movies';
            break;
          default:
            url = '/media/all';
            break;
        }
        return { url };
      },
      transformResponse: (
        response: { data: GenreWithMedia[]; status: string },
        meta,
        arg
      ) => {
        return response.data;
      },
    }),
  }),
});

export const { useGetBillboardMediaQuery, useGetTitlesWithGenreQuery } =
  mediaApi;
