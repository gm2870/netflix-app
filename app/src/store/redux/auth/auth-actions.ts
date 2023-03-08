import Router from 'next/router';
import { authActions } from './auth-slice';
import { AppDispatch } from '../index';
import { useLoginUserMutation } from '../../../services/auth';
type LoginData = {
  username: string;
  email: string;
};
// export const getCurrentUser = async () => {
//   const config = {
//     url: '/users/currentUser',
//     method: 'GET',
//   };
//   const result = await AppDispatch(sendRequest(config));
//   if (result.fulfil) {
//   }
//   const handleSuccess = (user) => authActions.authenticate(user);

//   const handleErr = () => authActions.logoutUser();
// };

// export const loginUser = (data: LoginData) => {
//   const [loginUser] = useLoginUserMutation();
//   try {
//     const res = loginUser(data);
//     console.log(res);
//     // authenticateAndRedirect(res.user, '/browse');
//   } catch (error) {}
// };

// export const checkEmail = (email) => {
//   return async (AppDispatch) => {
//     const config = {
//       url: '/auth/check-email',
//       method: 'POST',
//       data: { email },
//     };
//     const handleError = () => {
//       Router.push('/login');
//     };
//     const redirectUser = () => {
//       AppDispatch(authActions.setEmail(email));
//       Router.push('/signup');
//     };
//     sendRequest(config, AppDispatch, redirectUser, handleError);
//   };
// };

// export const signupUser = (data) => {
//   return (AppDispatch) => {
//     const config = {
//       url: '/auth/signup',
//       method: 'POST',
//       data,
//     };
//     const handleSuccess = ({ user }) =>
//       authenticateAndRedirect(user, '/browse');
//     const handleErr = (msg) => AppDispatch(authActions.setError(msg));

//     sendRequest(config, AppDispatch, handleSuccess, handleErr);
//   };
// };

export const authenticateAndRedirect = (user, path) => {
  authActions.authenticate(user);
  Router.push(path);
};

export const logout = () => {
  authActions.logoutUser();
};
