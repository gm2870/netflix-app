const API_URL = 'http://localhost:8001/api/v1';
import axios from 'axios';
import { uiActions } from '../store/redux/ui/ui.mjs';

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
    if (!originalConfig.url.includes('/login') && !originalConfig.retry) {
      originalConfig.retry = true;
      try {
        // const rs = await instance.post('/users/refreshtoken', {
        //   refreshToken: TokenService.getLocalRefreshToken(),
        // });

        // const { accessToken } = rs.data;
        // TokenService.updateLocalAccessToken(accessToken);

        return instance(originalConfig);
      } catch (_error) {
        return Promise.reject(_error);
      }
    }
    return Promise.reject(err);
  }
);

export const sendRequest = async (
  requestConfig,
  dispatch,
  handleSuccess,
  handleError
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
    });
    if (res.data.status === 'success') {
      handleSuccess(res.data.data);
    }
  } catch (error) {
    console.log(error);
    const err = error.response?.data?.message || error.message || error;
    handleError(err);
  }
  dispatch(uiActions.toggleLoader());
};
