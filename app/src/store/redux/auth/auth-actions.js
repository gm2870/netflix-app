import Router from 'next/router';
import { sendRequest } from '../../../utils/api.mjs';
import { authActions } from './auth-slice.ts';

export const getCurrentUser = () => {
  return (dispatch) => {
    const handleSuccess = (user) => {
      dispatch(authActions.authenticate(user));
    };
    const handleErr = (errMsg) => dispatch(authActions.logoutUser());
    const config = {
      url: '/users/currentUser',
      method: 'GET',
    };
    sendRequest(config, dispatch, handleSuccess, handleErr);
  };
};

export const loginUser = (data) => {
  return (dispatch) => {
    const handleSuccess = (data) => {
      authenticateAndRedirect(data.user, '/browse');
    };
    const handleErr = (errMsg) => dispatch(authActions.setMessage(errMsg));

    const config = {
      url: '/auth/login',
      method: 'POST',
      data,
    };
    sendRequest(config, dispatch, handleSuccess, handleErr);
  };
};

export const checkEmail = (email) => {
  return async (dispatch) => {
    const config = {
      url: '/auth/check-email',
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
      url: '/auth/signup',
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
  authActions.authenticate(user);
  Router.push(path);
};

export const logout = () => {
  authActions.logoutUser();
};
