import { createSlice } from '@reduxjs/toolkit';

const sliderSlice = createSlice({
  name: 'slider',
  initialState: {
    moved: false,
    animating: false,
    activeIndex: 0,
    cardOpen: false,
    showNext: false,
    transformValue: 'none',
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
    toggleAnimating: (state, action) => {
      if (!state.moved) state.moved = true;
      state.animating = !state.animating;
    },
    handleNext: (state, action) => {
      state.animating = false;
      state.transformValue = `translate3d(-${
        100 + action.payload.sliderWidth
      }%,0,0)`;
      if (
        state.activeIndex >=
        Math.ceil(
          action.payload.totalItemsLength / action.payload.visibleItemsCount
        ) -
          1
      ) {
        state.activeIndex = 0;
      } else state.activeIndex += 1;
    },
    setTransFormValue: (state, action) => {
      const offsetVal =
        !state.moved && state.activeIndex === 0
          ? 100
          : 200 + action.payload.sliderWidth;
      state.transformValue = `translate3d(-${offsetVal}%,0,0)`;
    },
    handlePrevious: (state, action) => {},
  },
});

export const sliderActions = sliderSlice.actions;
export default sliderSlice;
