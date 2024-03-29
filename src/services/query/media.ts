import { GenreWithMedia, Media } from '@/src/store/redux/media/model';
import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../api';
import { SeasonDetails, TitleDetails } from '@/src/models/media.model';

export const mediaApi = createApi({
  reducerPath: 'mediaApi',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    getBillboardMedia: builder.query<Media, string>({
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
      transformResponse: (response: { data: Media; status: string }) => {
        return response.data || [];
      },
    }),
    getTitlesWithGenre: builder.query<
      GenreWithMedia[],
      { type: string; genreId: string }
    >({
      query: ({ type, genreId }) => {
        let url = '';
        switch (type) {
          case '1':
            url = genreId
              ? `/media/tv-shows/genres/${genreId}`
              : '/media/tv-shows';
            break;
          case '2':
            url = genreId ? `/media/movies/genres/${genreId}` : '/media/movies';
            break;
          default:
            url = '/media/all';
            break;
        }

        return { url };
      },
      transformResponse: (response: {
        data: GenreWithMedia[];
        status: string;
      }) => {
        return response.data;
      },
    }),

    getMyList: builder.query<Media[],undefined>({
      query: () => 'media/favorites',
      transformResponse: (response: { data: Media[]; status: string }) => {
        return response.data;
      },
    }),

    getTitleInfo: builder.query<
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
      transformResponse: (response: { data: Media; status: string }) => {
        return response.data;
      },
    }),
    getTitleDetails: builder.query<
      TitleDetails,
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
      transformResponse: (response: { data: TitleDetails; status: string }) => {
        const seasons = response.data.seasons.filter(
          (s) => s.season_number !== 0
        );
        return {
          ...response.data,
          seasons,
        };
      },
    }),
    getSeasonDetails: builder.query<
      SeasonDetails,
      {
        id: number;
        seasonNumber: number;
      }
    >({
      query: ({ id, seasonNumber }) => {
        return { url: `/media/tv-shows/${id}/season/${seasonNumber}` };
      },
      transformResponse: (response: {
        data: SeasonDetails;
        status: string;
      }) => {
        return response.data;
      },
    }),
    getCropSize: builder.query<
      number,
      {
        id: number;
        type: string;
      }
    >({
      query: ({ id, type }) => {
        let url = '';
        switch (type) {
          case 'tv':
            url = `/stream/crop-size/tv/${id}`;
            break;
          case 'movie':
            url = `/stream/crop-size/movie/${id}`;
            break;
        }
        return {
          url,
        };
      },
      transformResponse: (response: { data: number; status: string }) => {
        return response.data;
      },
    }),
    searchTitle: builder.query<Media[], string>({
      query: (name: string) => {
        return {
          url: `/stream/search/${name}`,
        };
      },
      transformResponse: (response: { data: Media[]; status: string }) => {
        return response.data;
      },
    }),
    addTitleToMyList: builder.mutation<
      any,
      {
        id: number;
      }
    >({
      query({ id }) {
        return {
          method: 'POST',
          url: '/media/favorites',
          body: {
            id,
          },
        };
      },
      transformResponse: (response: { data: number[]; status: string }) => {
        return response.data;
      },
    }),
    removeTitleFromMyList: builder.mutation<
    any,
    {
      id: number;
    }
  >({
    query({ id }) {
      return {
        method: 'DELETE',
        url: '/media/favorites',
        body: {
          id,
        },
      };
    },
    transformResponse: (response: { data: number[]; status: string }) => {
      return response.data;
    },
  }),
  }),
});

export const {
  useGetBillboardMediaQuery,
  useGetTitlesWithGenreQuery,
  useGetTitleInfoQuery,
  useGetTitleDetailsQuery,
  useGetCropSizeQuery,
  useSearchTitleQuery,
  useGetSeasonDetailsQuery,
  useAddTitleToMyListMutation,
  useGetMyListQuery,
  useRemoveTitleFromMyListMutation
} = mediaApi;
