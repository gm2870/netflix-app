import { createSlice } from '@reduxjs/toolkit';
const signupSlice = createSlice({
  name: 'signup',
  initialState: {
    loading: false,
    email: '',
    password: '',
    error: null,
  },
  reducers: {
    setEmail(state, action) {
      state.email = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
  },
});
export const signupActions = signupSlice.actions;
export default signupSlice;
