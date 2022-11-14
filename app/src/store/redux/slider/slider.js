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
    items: [],
    sliderItems: [],
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
      const offsetVal =
        !state.moved && state.activeIndex === 0
          ? 100
          : 200 + action.payload.sliderWidth;
      state.transformValue = `translate3d(-${offsetVal}%,0,0)`;
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
      state.sliderItems = setSliderItems(
        state.activeIndex,
        action.payload.visibleItemsCount
      );
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
const setSliderItems = (activeIndex, rowItems) => {
  const leftItems = () => {
    if (state.moved) {
      if (activeIndex === 0) {
        // get the last 7 items but drop the last one
        return [
          ...totalItems()
            .slice(-(rowItems + 1))
            .slice(0, rowItems),
        ];
      }

      if (activeIndex === 1) {
        return [
          ...totalItems().slice(-1),
          ...totalItems().slice(activeIndex - 1, rowItems - 1),
        ];
      }
      return totalItems()
        .slice((activeIndex - 1) * rowItems - 1)
        .slice(0, rowItems);
    }
    return [];
  };

  const middleItems = () => {
    if (state.moved) {
      if (activeIndex === 0) {
        const lastItem = totalItems().slice(-1);
        return [...lastItem, ...totalItems().slice(0, rowItems + 1)];
      }

      return [
        ...totalItems()
          .slice(activeIndex * rowItems - 1)
          .slice(0, rowItems + 2),
      ];
    }
    return totalItems().slice(0, rowItems + 1);
  };
  const rightItems = () => {
    if (activeIndex === Math.ceil(items.length / rowItems - 1)) {
      return totalItems().slice(0, rowItems);
    }
    if (activeIndex === Math.ceil(items.length / rowItems) - 2) {
      return [
        ...totalItems()
          .slice((activeIndex + 1) * rowItems + 1)
          .slice(0, rowItems),
        ...totalItems().slice(0, 1),
      ];
    }
    return totalItems()
      .slice((activeIndex + 1) * rowItems + 1)
      .slice(0, rowItems);
  };
  const obj = {
    left: leftItems(),
    visible: middleItems(),
    right: rightItems(),
  };
  return [...obj.left, ...obj.visible, ...obj.right];
};
export const sliderActions = sliderSlice.actions;
export default sliderSlice;
