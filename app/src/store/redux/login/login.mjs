import { createSlice } from '@reduxjs/toolkit';
const loginSlice = createSlice({
  name: 'login',
  initialState: {
    loading: false,
    email: '',
    password: '',
    invalidMessage: null,
  },
  reducers: {
    setMessage: (state, action) => {
      state.invalidMessage = action.payload;
    },
  },
});
export const loginActions = loginSlice.actions;
export default loginSlice;
