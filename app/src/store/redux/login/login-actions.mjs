import Router from 'next/router';
import { sendRequest } from '../../../utils/api.mjs';
import { loginActions } from './login.mjs';
const loginUser = (data) => {
  return (dispatch) => {
    const redirectUser = () => Router.push('/browse');
    const handleErr = (errMsg) => dispatch(loginActions.setMessage(errMsg));

    const config = {
      url: '/users/login',
      method: 'POST',
      data,
    };
    sendRequest(config, dispatch, redirectUser, handleErr);
  };
};
export default loginUser;
