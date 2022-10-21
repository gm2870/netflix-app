import Router from 'next/router';
import { sendRequest } from '../../../utils/api.mjs';
import { authActions } from './auth-slice.js';

export const loginUser = (data) => {
  return (dispatch) => {
    const handleSuccess = ({ user }) => {
      authenticateAndRedirect(user, '/browse');
    };
    const handleErr = (errMsg) => dispatch(authActions.setMessage(errMsg));

    const config = {
      url: '/users/login',
      method: 'POST',
      data,
    };
    sendRequest(config, dispatch, handleSuccess, handleErr);
  };
};

export const checkEmail = (email) => {
  return async (dispatch) => {
    const config = {
      url: '/users/check-email',
      method: 'POST',
      data: { email },
    };
    const handleError = () => {
      Router.push('/login');
    };
    const redirectUser = () => {
      dispatch(authActions.setEmail(email));
      Router.push('/signup');
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
    const handleSuccess = ({ user }) =>
      authenticateAndRedirect(user, '/browse');
    const handleErr = (msg) => dispatch(authActions.setError(msg));

    sendRequest(config, dispatch, handleSuccess, handleErr);
  };
};

const authenticateAndRedirect = (user, path) => {
  localStorage.setItem('user', JSON.stringify(user));
  authActions.authenticate(user);
  Router.push(path);
};
