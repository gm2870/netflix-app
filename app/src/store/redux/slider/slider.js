import { createSlice } from '@reduxjs/toolkit';

const sliderSlice = createSlice({
  name: 'slider',
  initialState: {
    moved: false,
    animating: false,
    activeIndex: 0,
    cardOpen: false,
    showNext: false,
    items: [],
    filteredItems: {
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
      if (!state.moved) state.moved = true;
      state.animating = !state.animating;
    },
    handleNext: (state, action) => {
      const { itemWidth, rowItems } = action.payload.sliderConfig;
      state.animating = false;

      if (state.activeIndex >= Math.ceil(state.items.length / rowItems) - 1) {
        state.activeIndex = 0;
      } else state.activeIndex += 1;
      state.filteredItems = filterItems(
        state.activeIndex,
        rowItems,
        state.items.length
      );
    },

    handlePrevious: (state, action) => {
      const { itemWidth, rowItems } = action.payload.sliderConfig;

      state.animating = false;

      if (state.activeIndex === 0) {
        state.activeIndex = Math.ceil(state.items.length / rowItems) - 1;
      } else state.activeIndex -= 1;
      state.filteredItems = filterItems(
        state.activeIndex,
        rowItems,
        state.items.length
      );
    },
    setfilteredItems: (state, action) => {
      console.log(state.activeIndex);
      let ai = state.activeIndex;
      if (ai > Math.ceil(state.items.length / action.payload.rowItems) - 1) {
        ai = Math.ceil(state.items.length / action.payload.rowItems) - 1;
      }
      state.filteredItems = filterItems(
        ai,
        action.payload.rowItems,
        state.items.length,
        state.moved
      );
      state.activeIndex = ai;
      if (state.moved) {
        const offsetVal = 100 + action.payload.itemWidth;
        // state.transformValue = `translate3d(-${offsetVal}%,0,0)`;
      }
    },
  },
});

const filterItems = (activeIndex, rowItems, itemsLength, moved = true) => {
  console.log(activeIndex);
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
      // if (activeIndex === Math.ceil(itemsLength / rowItems - 1)) {
      //   return itemsIndexes
      //     .slice((activeIndex - 1) * rowItems - 2)
      //     .slice(0, rowItems);
      // }
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
        let visItems = [
          ...itemsIndexes
            .slice(activeIndex * rowItems - 1)
            .slice(0, rowItems + 1),
          ...itemsIndexes.slice(0, 1),
        ];
        return visItems;
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
      return itemsIndexes.slice(1, rowItems + 1);
    }
    let rightItems = itemsIndexes
      .slice((activeIndex + 1) * rowItems + 1)
      .slice(0, rowItems);

    return rightItems;
  };

  return {
    left: leftItems(),
    visible: middleItems(),
    right: rightItems(),
  };
};

export const sliderActions = sliderSlice.actions;
export default sliderSlice;
