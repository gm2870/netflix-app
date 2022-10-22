import { createSlice } from '@reduxjs/toolkit';
let user;
if (typeof window !== 'undefined') {
  user = JSON.parse(localStorage.getItem('user'));
}

const initialState = {
  user: user || null,
  isLoggedIn: user || false,
  email: null,
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
      state.isLoggedIn = false;
    },
  },
});

export const authActions = authSlice.actions;
export default authSlice;
