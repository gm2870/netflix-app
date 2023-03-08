import { BaseQueryFn, createApi } from '@reduxjs/toolkit/query/react';
import { Mutex } from 'async-mutex';
import axios from 'axios';
import type { AxiosRequestConfig, AxiosError } from 'axios';

const mutex = new Mutex();
export const API_URL = 'http://localhost:8001/api/v1';

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

const axiosBaseQuery =
  (
    { baseUrl }: { baseUrl: string } = { baseUrl: '' }
  ): BaseQueryFn<
    {
      url: string;
      method: AxiosRequestConfig['method'];
      data?: AxiosRequestConfig['data'];
      params?: AxiosRequestConfig['params'];
    },
    unknown,
    unknown
  > =>
  async ({ url, method, data, params }) => {
    // console.log(data);
    await mutex.waitForUnlock();

    try {
      let result = await axiosInstance({
        url: API_URL + url,
        method,
        data,
        params,
      });
      console.log(result.data.data);
      return {
        data: result.data.data,
      };
    } catch (axiosError) {
      let err = axiosError as AxiosError;
      if (
        !err.config?.url?.includes('login') &&
        err.response?.status === 401 &&
        !err.config?.url?.includes('currentUser')
      ) {
        if (!mutex.isLocked()) {
          const release = await mutex.acquire();
          try {
            await axiosInstance({
              url: API_URL + '/auth/refreshtoken',
              method: 'GET',
            });

            return axiosInstance(err.config);
          } catch (_error) {
            return {
              error: _error,
            };
          } finally {
            release();
          }
        } else {
          // wait until the mutex is available without locking it
          await mutex.waitForUnlock();
          await axiosInstance({ url: baseUrl + url, method, data, params });
        }
      }

      return {
        error: err.response?.data,
      };
    }
  };

export const api = createApi({
  baseQuery: axiosBaseQuery({
    baseUrl: API_URL,
  }),
  endpoints: () => ({}),
});
