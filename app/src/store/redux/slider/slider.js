import { createSlice, current } from '@reduxjs/toolkit';

const sliderSlice = createSlice({
  name: 'slider',
  initialState: {
    moved: false,
    animating: false,
    activeIndex: 0,
    cardOpen: false,
    showNext: false,
    translateX: null,
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
      state.animating = !state.animating;
      state.translateX = calculateTranslateX(
        current(state).translateX,
        action.payload.direction,
        state.filteredItems,
        action.payload.rowItems,
        action.payload.itemWidth,
        state.moved,
        state.animating
      );
      if (!state.moved) state.moved = true;
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
      state.translateX = calculateTranslateX(
        current(state).translateX,
        'right',
        state.filteredItems,
        rowItems,
        itemWidth,
        state.moved,
        state.animating
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
      state.translateX = calculateTranslateX(
        current(state).translateX,
        'left',
        state.filteredItems,
        rowItems,
        itemWidth,
        state.moved,
        state.animating
      );
    },
    setfilteredItems: (state, action) => {
      let ai = state.activeIndex;
      if (ai > Math.ceil(state.items.length / action.payload.rowItems) - 1) {
        ai = Math.ceil(state.items.length / action.payload.rowItems) - 1;
      }
      state.filteredItems = filterItems(
        current(state).filteredItems,
        null,
        ai,
        action.payload.rowItems,
        state.items.length,
        state.moved
      );
      state.activeIndex = ai;
      if (state.moved) {
        state.translateX = calculateTranslateX(
          current(state).translateX,
          'right',
          state.filteredItems,
          action.payload.rowItems,
          action.payload.itemWidth,
          state.moved,
          false
        );
      }
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
    // this is for the case when browser size changes without having direction
    if (!direction) {
      return itemsIndexes
        .slice(activeIndex * rowItems - 1)
        .slice(0, rowItems + 2);
    }

    if (direction === 'right') {
      if (prevMidLastIndex === 0) {
        return itemsIndexes.slice(-(rowItems + 2));
      }
      if (prevMidLastIndex === Math.ceil(itemsLength / rowItems - 1)) {
        return itemsIndexes.slice(0, rowItems + 2);
      }
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
    const midItemsFirstIndex = middleItems()[0];
    let left = [...itemsIndexes.slice(0, midItemsFirstIndex).slice(-rowItems)];
    if (activeIndex === 0) {
      left = [...itemsIndexes.slice(-(rowItems + 1))].slice(0, -1);
    }
    if (left.length < rowItems) {
      left.unshift(...itemsIndexes.slice(-1));
    }
    return left;
  };

  const rightItems = () => {
    const midItemsLastIndex = [...middleItems()].pop();
    let rightItems = itemsIndexes
      .slice(midItemsLastIndex + 1)
      .slice(0, rowItems);

    return rightItems;
  };
  const left = leftItems();
  const middle = middleItems();
  const right = rightItems();
  return {
    left,
    middle,
    right,
  };
};
const calculateTranslateX = (
  translateX,
  direction,
  items,
  rowItems,
  itemWidth,
  moved,
  animating
) => {
  let w = rowItems * itemWidth;

  if (direction === 'left') {
    let diff = 0;
    if (items.left.length < rowItems) {
      diff = rowItems - items.left.length;
    }
    if (animating) {
      return itemWidth;
    } else {
      return w + itemWidth - diff * itemWidth;
    }
  }
  let diff = 0;
  if (items.right.length < rowItems) {
    diff = rowItems - items.right.length - 1;
  }
  // we need to use previous translateX because in prev state we could have had diff value
  // which means w + itemWidth would not be correct all the time
  if (animating) {
    return !moved ? w : translateX + w - diff * itemWidth;
  } else {
    return w + itemWidth;
  }
};

export const sliderActions = sliderSlice.actions;
export default sliderSlice;
