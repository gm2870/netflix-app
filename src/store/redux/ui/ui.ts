import { createSlice } from '@reduxjs/toolkit';

type UiState = {
  loading: boolean;
  billboardPlaying: boolean;
  showDetailModal: boolean;
};

const initialState: UiState = {
  loading: false,
  billboardPlaying: true,
  showDetailModal: false,
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
    toggleShowDetailModal: (state) => {
      state.showDetailModal = !state.showDetailModal;
    },
  },
});
export const uiActions = uiSlice.actions;
export default uiSlice;
