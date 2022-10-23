import Router from 'next/router';
import { sendRequest } from '../../../utils/api.mjs';
import { authActions } from './auth-slice.js';

export const getCurrentUser = () => {
  return (dispatch) => {
    const handleSuccess = (data) => {
      console.log(data);
    };
    const handleErr = (errMsg) => console.log(errMsg);
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
      console.log(data);
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
  localStorage.setItem('user', JSON.stringify(user));
  authActions.authenticate(user);
  Router.push(path);
};

export const logout = () => {
  localStorage.removeItem('user');
};
