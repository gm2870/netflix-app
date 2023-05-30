import { createSlice } from '@reduxjs/toolkit';

type UiState = {
  loading: boolean;
  billboardPlaying: boolean;
};

const initialState: UiState = {
  loading: false,
  billboardPlaying: true,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleLoader: (state) => {
      state.loading = !state.loading;
    },
    setBillnoardPlaying: (state, action) => {
      state.billboardPlaying = action.payload;
    },
  },
});
export const uiActions = uiSlice.actions;
export default uiSlice;
