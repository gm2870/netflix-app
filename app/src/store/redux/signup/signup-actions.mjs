import Router from 'next/router';
import { signupActions } from '../signup/signup.mjs';
import { sendRequest } from '../../../utils/api.mjs';

export const checkEmail = (email) => {
  return async (dispatch) => {
    const config = {
      url: '/users/check-email',
      method: 'POST',
      data: { email },
    };
    const handleError = () => Router.push('/login');
    const redirectUser = () => {
      Router.push('/signup');
      dispatch(signupActions.setEmail(email));
    };
    sendRequest(config, dispatch, redirectUser, handleError);
  };
};

export const signupUser = (data) => {
  return (dispatch) => {
    const config = {
      url: '/user/signup',
      method: 'POST',
      data,
    };
    const redirectUser = () => Router.push('/browse');
    const handleErr = (msg) => dispatch(signupActions.setError(msg));

    sendRequest(config, dispatch, redirectUser, handleErr);
  };
};
