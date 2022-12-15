import { createSlice, current } from '@reduxjs/toolkit';

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
      middle: [],
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
        current(state.filteredItems),
        'right',
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
        current(state.filteredItems),
        'left',
        state.activeIndex,
        rowItems,
        state.items.length
      );
    },
    setfilteredItems: (state, action) => {
      let ai = state.activeIndex;
      if (ai > Math.ceil(state.items.length / action.payload.rowItems) - 1) {
        ai = Math.ceil(state.items.length / action.payload.rowItems) - 1;
      }
      state.filteredItems = filterItems(
        current(state.filteredItems),
        null,
        ai,
        action.payload.rowItems,
        state.items.length,
        state.moved
      );
      state.activeIndex = ai;
    },
  },
});

const filterItems = (
  currentItems,
  direction,
  activeIndex,
  rowItems,
  itemsLength,
  moved = true
) => {
  const indicatorItemsCount = !moved ? 1 : 2;
  const count = !moved ? rowItems * 2 + indicatorItemsCount : itemsLength;
  const itemsIndexes = Array.from(Array(count).keys());
  const prevMidFirstIndex = currentItems.middle[0];
  const prevMidLastIndex = [...currentItems.middle].pop();
  const middleItems = () => {
    if (!moved) {
      return itemsIndexes.slice(0, rowItems + 1);
    }
    // on first index we need last item to be added
    if (activeIndex === 0) {
      const lastItem = itemsIndexes.slice(-1);
      return [...lastItem, ...itemsIndexes.slice(0, rowItems + 1)];
    }

    // on last index we need first item to be added
    if (activeIndex === Math.ceil(itemsLength / rowItems - 1)) {
      let visItems = [
        ...itemsIndexes.slice(-(rowItems + 1)),
        ...itemsIndexes.slice(0, 1),
      ];
      return visItems;
    }

    if (direction === 'right') {
      return itemsIndexes.slice(prevMidLastIndex - 1).slice(0, rowItems + 2);
    }

    if (direction === 'left') {
      return itemsIndexes
        .slice(0, prevMidFirstIndex + 2)
        .slice(-(rowItems + 2));
    }
  };

  const leftItems = () => {
    if (!moved) {
      return [];
    }
    if (!middleItems()) return;
    const midItemsFirstIndex = middleItems()[0];
    let left = [...itemsIndexes.slice(0, midItemsFirstIndex).slice(-rowItems)];
    if (activeIndex === 0) {
      left = [...itemsIndexes.slice(-(rowItems + 1))].slice(0, -1);
    }
    if (left.length < rowItems) {
      // left.unshift(...itemsIndexes.slice(-(rowItems - left.length)));
      left.unshift(...itemsIndexes.slice(-1));
    }
    return left;
  };

  const rightItems = () => {
    if (!middleItems()) return;
    const midItemsLastIndex = [...middleItems()].pop();
    let rightItems = itemsIndexes
      .slice(midItemsLastIndex + 1)
      .slice(0, rowItems);

    return rightItems;
  };

  return {
    left: leftItems(),
    middle: middleItems(),
    right: rightItems(),
  };
};

export const sliderActions = sliderSlice.actions;
export default sliderSlice;
