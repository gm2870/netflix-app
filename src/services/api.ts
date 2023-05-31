import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  fetchBaseQuery,
} from '@reduxjs/toolkit/query/react';
import { Mutex } from 'async-mutex';
import { authActions } from '../store/redux/auth/auth-slice';

export const API_URL = process.env.NEXT_PUBLIC_API_URL;
const mutex = new Mutex();
const baseQuery = fetchBaseQuery({ baseUrl: API_URL, credentials: 'include' });
export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  // wait until the mutex is available without locking it
  await mutex.waitForUnlock();
  let result = await baseQuery(args, api, extraOptions);
  if (
    !result.meta?.request.url.includes('login') &&
    result.error &&
    result.error.status === 401
  ) {
    // checking whether the mutex is locked
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();
      try {
        const refreshResult = await baseQuery(
          '/auth/refresh-token',
          api,
          extraOptions
        );
        if (refreshResult.data) {
          // retry the initial query
          result = await baseQuery(args, api, extraOptions);
        } else {
          api.dispatch(authActions.logoutUser());
        }
      } finally {
        // release must be called once the mutex should be released again.
        release();
      }
    } else {
      // wait until the mutex is available without locking it
      await mutex.waitForUnlock();
      result = await baseQuery(args, api, extraOptions);
    }
  }
  return result;
};
