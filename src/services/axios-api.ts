
import axios from 'axios';
import { AppDispatch } from '../store/redux/index';
import { uiActions } from '../store/redux/ui/ui';
import { RequestConfig } from './models';
import { API_URL } from './api';

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

export const sendRequest = async (
  requestConfig: RequestConfig,
  dispatch: AppDispatch,
  handleSuccess: (data: any) => void,
  handleError: (error: any) => void
) => {
  dispatch(uiActions.toggleLoader());
  try {
    const res = await instance({
      url: API_URL + requestConfig.url,
      method: requestConfig.method || 'GET',
      headers: requestConfig.headers,
      params: requestConfig.params,
      data: requestConfig.data,
      withCredentials: true,
      responseType: requestConfig.responeType || 'json',
    });
    if (res.data.status === 'success') {
      handleSuccess(res.data.data);
    }
  } catch (error: any) {
    const err = error.response?.data?.message || error.message || error;
    handleError(err);
  }
  dispatch(uiActions.toggleLoader());
};

export const sendReq = async (
  requestConfig: RequestConfig,
  handleSuccess: (data: any) => void,
  handleError: (error: any) => void
) => {
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
      handleSuccess(res.data.data);
    }
  } catch (error: any) {
    const err = error.response?.data?.message || error.message || error;
    handleError(err);
  }
};
