import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    loading: false,
    billboardPlaying: true,
  },
  reducers: {
    toggleLoader: (state) => {
      state.loading = !state.loading;
    },
    toggleBillnoardPlaying: (state) => {
      state.billboardPlaying = !state.billboardPlaying;
    },
  },
});
export const uiActions = uiSlice.actions;
export default uiSlice;
