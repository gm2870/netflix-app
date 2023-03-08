import { api } from './api';

type LoginResponse = {};
export const authApi = api.injectEndpoints({
  endpoints: (build) => ({
    loginUser: build.mutation<any, any>({
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
    }),
  }),
});

export const { useLoginUserMutation } = authApi;
