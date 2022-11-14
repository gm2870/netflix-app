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
    sliderItems: {
      left: [],
      visible: [],
      right: [],
    },
  },
  reducers: {
    showCard: (state, action) => {
      state.cardOpen = action.payload;
    },
    setShowNext: (state, action) => {
      state.showNext = action.payload;
    },
    getAllItems: (state, action) => {
      state.items = action.payload;
    },
    toggleAnimating: (state, action) => {
      const offsetVal =
        !state.moved && state.activeIndex === 0
          ? 100
          : action.payload.direction === 'right'
          ? 200 + action.payload.itemWidth
          : action.payload.itemWidth;
      state.transformValue = `translate3d(-${offsetVal}%,0,0)`;
      if (!state.moved) state.moved = true;
      state.animating = !state.animating;
    },
    handleNext: (state, action) => {
      state.animating = false;
      state.transformValue = `translate3d(-${
        100 + action.payload.sliderConfig.itemWidth
      }%,0,0)`;
      if (
        state.activeIndex >=
        Math.ceil(state.items.length / action.payload.sliderConfig.rowItems) - 1
      ) {
        state.activeIndex = 0;
      } else state.activeIndex += 1;
      state.sliderItems = calcItems(
        state.activeIndex,
        action.payload.sliderConfig.rowItems,
        state.items.length
      );
    },

    handlePrevious: (state, action) => {
      state.animating = false;
      state.transformValue = `translate3d(-${
        100 + action.payload.sliderConfig.itemWidth
      }%,0,0)`;
      if (state.activeIndex === 0) {
        state.activeIndex =
          Math.ceil(state.items.length / action.payload.sliderConfig.rowItems) -
          1;
      } else state.activeIndex -= 1;
      state.sliderItems = calcItems(
        state.activeIndex,
        action.payload.sliderConfig.rowItems,
        state.items.length
      );
    },
    setSliderItems: (state, action) => {
      state.sliderItems = calcItems(
        state.activeIndex,
        action.payload.rowItems,
        state.items.length,
        state.moved
      );
    },
  },
});
const calcItems = (activeIndex, rowItems, itemsLength, moved = true) => {
  const indicatorItemsCount = !moved ? 1 : 2;
  const count = !moved ? rowItems * 2 + indicatorItemsCount : itemsLength;
  const itemsIndexes = Array.from(Array(count).keys());
  const leftItems = () => {
    if (moved) {
      if (activeIndex === 0) {
        // get the last 7 items but drop the last one
        return [...itemsIndexes.slice(-(rowItems + 1)).slice(0, rowItems)];
      }

      if (activeIndex === 1) {
        return [
          ...itemsIndexes.slice(-1),
          ...itemsIndexes.slice(activeIndex - 1, rowItems - 1),
        ];
      }
      return itemsIndexes
        .slice((activeIndex - 1) * rowItems - 1)
        .slice(0, rowItems);
    }
    return [];
  };

  const middleItems = () => {
    if (moved) {
      if (activeIndex === 0) {
        const lastItem = itemsIndexes.slice(-1);
        return [...lastItem, ...itemsIndexes.slice(0, rowItems + 1)];
      }

      if (activeIndex === Math.ceil(itemsLength / rowItems - 1)) {
        return [
          ...itemsIndexes
            .slice(activeIndex * rowItems - 1)
            .slice(0, rowItems + 2),
          itemsIndexes.slice(0, 1),
        ];
      }
      return [
        ...itemsIndexes
          .slice(activeIndex * rowItems - 1)
          .slice(0, rowItems + 2),
      ];
    }
    return itemsIndexes.slice(0, rowItems + 1);
  };
  const rightItems = () => {
    if (activeIndex === Math.ceil(itemsLength / rowItems - 1)) {
      return itemsIndexes.slice(1, rowItems);
    }
    if (activeIndex === Math.ceil(itemsLength / rowItems) - 2) {
      return [
        ...itemsIndexes
          .slice((activeIndex + 1) * rowItems + 1)
          .slice(0, rowItems),
        ...itemsIndexes.slice(0, 1),
      ];
    }
    return itemsIndexes
      .slice((activeIndex + 1) * rowItems + 1)
      .slice(0, rowItems);
  };

  return {
    left: leftItems(),
    visible: middleItems(),
    right: rightItems(),
  };
};
export const sliderActions = sliderSlice.actions;
export default sliderSlice;
