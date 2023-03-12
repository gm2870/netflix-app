import { api } from './query-api';

export const authApi = api.injectEndpoints({
  endpoints: (build) => ({
    signIn: build.mutation<any, any>({
      query({ email, password }) {
        return {
          method: 'POST',
          url: '/auth/login',
          data: {
            email,
            password,
          },
        };
      },
      transformErrorResponse: (response: any) => {
        return response.data;
      },
    }),
  }),
});

export const { useSignInMutation } = authApi;
