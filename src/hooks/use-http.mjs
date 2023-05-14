import { useCallback, useState } from 'react';
import axios from 'axios';
import { API_URL } from '../utils/api.mjs';
import { useDispatch } from 'react-redux';
import { uiActions } from '../store/redux/ui/ui.js';

const useHttp = () => {
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const sendRequest = useCallback(async (requestConfig, handleSucess) => {
    try {
      setError(null);
      dispatch(uiActions.toggleLoader());
      const res = await axios.request({
        url: API_URL + requestConfig.url,
        method: requestConfig.method || 'GET',
        headers: requestConfig.headers,
        body: JSON.stringify(requestConfig.body),
      });
      if (res.data.status === 'success') {
        handleSucess(res.data.data);
      }
    } catch (error) {
      setError(error.message);
    }
    dispatch(uiActions.toggleLoader());
  }, []);
  return {
    error,
    sendRequest,
  };
};

export default useHttp;
