import { createSlice } from '@reduxjs/toolkit';

interface AuthState {
  isLoggedIn: boolean;
  invalidMessage: string;
  email: string;
  error: string;
}

const initialState: AuthState = {
  isLoggedIn: false,
  email: '',
  error: '',
  invalidMessage: '',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setEmail(state, action) {
      state.email = action.payload;
    },
    authenticate: (state) => {
      state.isLoggedIn = true;
    },
    setError(state, action) {
      state.error = action.payload;
    },
    setMessage: (state, action) => {
      state.invalidMessage = action.payload;
    },

    logoutUser: (state) => {
      state.isLoggedIn = false;
      localStorage.removeItem('user');
    },
  },
});

export const authActions = authSlice.actions;
export default authSlice;
