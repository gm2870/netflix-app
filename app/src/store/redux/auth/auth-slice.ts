import { createSlice } from '@reduxjs/toolkit';

interface AuthState {
  user: any;
  isLoggedIn: boolean;
  invalidMessage: string;
  email: string;
  error: any;
}

let user;
if (typeof window !== 'undefined') {
  user = JSON.parse(JSON.stringify(localStorage.getItem('user')));
}

const initialState: AuthState = {
  user: user,
  isLoggedIn: false,
  email: '',
  error: null,
  invalidMessage: '',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setEmail(state, action) {
      state.email = action.payload;
    },
    authenticate: (state, action) => {
      state.isLoggedIn = true;
      state.user = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
    setMessage: (state, action) => {
      state.invalidMessage = action.payload;
    },

    logoutUser: (state, action) => {
      state.user = null;
      state.isLoggedIn = false;
    },
  },
});

export const authActions = authSlice.actions;
export default authSlice;
