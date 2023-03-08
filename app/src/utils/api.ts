export const API_URL = 'http://localhost:8001/api/v1';
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { uiActions } from '../store/redux/ui/ui';
import { RootState, AppDispatch } from '../store/redux';
type RequestConfig = {
  url: string;
  method: string;
  headers?: any;
  data?: any;
  params?: any;
};
const createAppAsyncThunk = createAsyncThunk.withTypes<{
  state: RootState;
  dispatch: AppDispatch;
  rejectValue: string;
  extra: { s: string; n: number };
}>();

const instance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

instance.interceptors.response.use(
  (res) => {
    return res;
  },
  async (err) => {
    const originalConfig = err.config;
    if (!originalConfig.url.includes('/currentUser') && !originalConfig.retry) {
      if (err.response.status === 401 && !originalConfig.retry) {
        originalConfig.retry = true;
        try {
          await instance({
            url: API_URL + '/auth/refreshtoken',
            method: 'GET',
          });
          return instance(originalConfig);
        } catch (_error) {
          return Promise.reject(_error);
        }
      }
    }
    return Promise.reject(err);
  }
);

export const sendRequest = createAppAsyncThunk(
  'axiosRequest',
  async (requestConfig: RequestConfig, thunkApi) => {
    thunkApi.dispatch(uiActions.toggleLoader());
    try {
      const res = await instance({
        url: API_URL + requestConfig.url,
        method: requestConfig.method || 'GET',
        headers: requestConfig.headers,
        params: requestConfig.params,
        data: requestConfig.data,
        withCredentials: true,
      });
      if (res.data.status === 'success') {
        return res.data.data;
      }
    } catch (error: any) {
      const err = error.response?.data?.message || error.message || error;
      return err;
    }
  }
);
