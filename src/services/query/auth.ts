import { baseQueryWithReauth } from '../api';
import { createApi } from '@reduxjs/toolkit/query/react';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: baseQueryWithReauth,
  endpoints: (build) => ({
    login: build.mutation<
      any,
      {
        email: string;
        password: string;
      }
    >({
      query({ email, password }) {
        return {
          method: 'POST',
          url: '/auth/login',
          body: {
            email,
            password,
          },
        };
      },
      transformResponse: (response: any) => {
        return response.data;
      },
    }),
    signup: build.mutation<
      any,
      {
        email: string;
        password: string;
      }
    >({
      query({ email, password }) {
        return {
          method: 'POST',
          url: '/auth/signup',
          body: {
            email,
            password,
          },
        };
      },
      transformResponse: (response: any) => {
        return response.data;
      },
    }),
    logout: build.query<any, void>({
      query() {
        return {
          method: 'GET',
          url: '/auth/logout',
        };
      },
      transformResponse: (response: any) => {
        return response.data;
      },
    }),
  }),
});

export const { useLoginMutation, useSignupMutation, useLogoutQuery } = authApi;
