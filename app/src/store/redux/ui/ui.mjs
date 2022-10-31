import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    loading: false,
    cardOpen: false,
    showNext: false,
  },
  reducers: {
    toggleLoader: (state) => {
      state.loading = !state.loading;
    },
    showCard: (state, action) => {
      state.cardOpen = action.payload;
    },
    setShowNext: (state, action) => {
      state.showNext = action.payload;
    },
  },
});
export const uiActions = uiSlice.actions;
export default uiSlice;
