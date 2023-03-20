import Router from 'next/router';
import { authActions } from './auth-slice';
import { AppDispatch } from '../../redux/index';
import { sendRequest } from '../../../services/api';
type Credentials = {
  email: string;
  password: string;
};

// export const getCurrentUser = async () => {
//   const config = {
//     url: '/users/currentUser',
//     method: 'GET',
//   };
//   const result = await dispatch(sendRequest(config));
//   if (result.fulfil) {
//   }
//   const handleSuccess = (user) => authActions.authenticate(user);

//   const handleErr = () => authActions.logoutUser();
// };

export const loginUser = (data: Credentials) => (dispatch: AppDispatch) => {
  const handleSuccess = () => {
    authenticateAndRedirect('/browse');
  };
  const handleErr = (errMsg: string) =>
    dispatch(authActions.setMessage(errMsg));

  const config = {
    url: '/auth/login',
    method: 'POST',
    data,
  };
  sendRequest(config, dispatch, handleSuccess, handleErr);
};

export const checkEmail = (email: string) => async (dispatch: AppDispatch) => {
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

export const signupUser = (data: Credentials) => (dispatch: AppDispatch) => {
  const config = {
    url: '/auth/signup',
    method: 'POST',
    data,
  };
  const handleSuccess = () => authenticateAndRedirect('/browse');
  const handleErr = (msg: string) => dispatch(authActions.setError(msg));

  sendRequest(config, dispatch, handleSuccess, handleErr);
};

export const authenticateAndRedirect = (path: string) => {
  authActions.authenticate();
  Router.push(path);
};

export const logout = () => {
  authActions.logoutUser();
};
