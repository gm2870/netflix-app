import { createSlice } from '@reduxjs/toolkit';

const sliderSlice = createSlice({
  name: 'slider',
  initialState: {
    items: {
      left: [],
      visible: [],
      right: [],
    },
    cardOpen: false,
    showNext: false,
  },
  reducers: {
    showCard: (state, action) => {
      state.cardOpen = action.payload;
    },
    setShowNext: (state, action) => {
      state.showNext = action.payload;
    },
    setItems: (state, action) => {
      state.items = action.payload;
    },
  },
});
export const sliderActions = sliderSlice.actions;
export default sliderSlice;
