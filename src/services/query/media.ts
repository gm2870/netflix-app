import { GenreWithMedia, Media } from '@/src/store/redux/media/model';
import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../api';

export const mediaApi = createApi({
  reducerPath: 'mediaApi',
  baseQuery: baseQueryWithReauth,
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
    getTitleInfo: build.query<
      Media,
      {
        id: number;
        type: string;
      }
    >({
      query: ({ id, type }) => {
        let url = '';
        switch (type) {
          case 'tv':
            url = `/media/tv/${id}`;
            break;
          case 'movie':
            url = `/media/movie/${id}`;
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

export const {
  useGetBillboardMediaQuery,
  useGetTitlesWithGenreQuery,
  useGetTitleInfoQuery,
} = mediaApi;
