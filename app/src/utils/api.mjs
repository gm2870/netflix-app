const API_URL = 'http://localhost:8001/api/v1';
import axios from 'axios';
import { uiActions } from '../store/redux/ui/ui.mjs';

export const sendRequest = async (
  requestConfig,
  dispatch,
  handleSuccess,
  handleError
) => {
  dispatch(uiActions.toggleLoader());
  try {
    const res = await axios({
      url: API_URL + requestConfig.url,
      method: requestConfig.method || 'GET',
      headers: requestConfig.headers,
      params: requestConfig.params,
      data: requestConfig.data,
    });
    if (res.data.status === 'success') {
      handleSuccess(res.data.data);
    }
  } catch (error) {
    const err = error.response?.data?.message || error.message || error;
    handleError(err);
  }
  dispatch(uiActions.toggleLoader());
};
