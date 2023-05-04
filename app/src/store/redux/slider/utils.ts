type SliderRow = {
  left: number[];
  middle: number[];
  right: number[];
};
export const filterItems = (
  currentItems: SliderRow,
  direction: string | null,
  activeIndex: number,
  rowItems: number,
  itemsLength: number,
  moved = true
) => {
  //   const indicatorItemsCount = !moved ? 1 : 2;
  //   const count = !moved ? rowItems * 2 + indicatorItemsCount : itemsLength;
  console.log(direction, activeIndex, Math.ceil(itemsLength / rowItems - 1));

  const allIndexes = Array.from(Array(itemsLength).keys());
  let itemsIndexes = [...allIndexes];
  const currMidFirstIndex = currentItems.middle[0];
  const middleItems = () => {
    if (!moved) {
      return itemsIndexes.slice(0, rowItems + 1);
    }
    // on last index we need first item to be added
    if (activeIndex === Math.ceil(itemsLength / rowItems - 1)) {
      return [
        ...itemsIndexes.slice(-(rowItems + 1)),
        ...itemsIndexes.slice(0, 1),
      ];
    }
    if (activeIndex === 0) {
      console.log([
        ...itemsIndexes.slice(-1),
        ...itemsIndexes.slice(0, rowItems + 1),
      ]);
      return [
        ...itemsIndexes.slice(-1),
        ...itemsIndexes.slice(0, rowItems + 1),
      ];
    }

    if (direction === 'left') {
      return itemsIndexes
        .slice(0, currMidFirstIndex + 2)
        .slice(-(rowItems + 2));
    }
    // on first index we need last item to be added
    return itemsIndexes
      .slice(activeIndex * rowItems - 1)
      .slice(0, rowItems + 2);
    // const lastItem = itemsIndexes.slice(-1);
    // return [...lastItem, ...itemsIndexes.slice(0, rowItems + 1)];
  };

  const leftItems = (middle: number[]) => {
    if (!moved) {
      return [];
    }
    let midItemsFirstIndex = middle[0];
    if (midItemsFirstIndex === 0) {
      midItemsFirstIndex = itemsLength;
    }
    let left = itemsIndexes
      .filter((x) => x < midItemsFirstIndex)
      .slice(-rowItems);

    return left;
  };

  const rightItems = (middle: number[]) => {
    let midItemsLastIndex = [...middle].pop() || 0;
    if (midItemsLastIndex === itemsLength - 1) {
      midItemsLastIndex = 0;
    }
    let rightItems = itemsIndexes
      .filter((x) => x >= midItemsLastIndex)
      .slice(0, rowItems);

    return rightItems;
  };
  const middle = middleItems();

  // itemsIndexes = allIndexes.filter((x) => !middle.includes(x));

  const right = rightItems(middle);
  // itemsIndexes = allIndexes.filter(
  //   (x) => !right.includes(x) && !middle.includes(x)
  // );
  const left = leftItems(middle);
  return {
    left,
    middle,
    right,
  };
};

export const calculateTranslateX = (
  translateX: number,
  direction: 'left' | 'right',
  items: SliderRow,
  rowItems: number,
  itemWidth: number,
  moved: boolean,
  animating: boolean
) => {
  let w = rowItems * itemWidth;
  let leftDiff = 0;
  let rightDiff = 0;
  let diff = 0;

  if (items.right.length < rowItems) {
    rightDiff = rowItems - items.right.length;
  }
  if (items.left.length < rowItems) {
    leftDiff = rowItems - items.left.length;
  }
  if (!moved) {
    return items.right.length * itemWidth;
  }
  //   diff = Math.abs(leftDiff - rightDiff);
  if (direction === 'left') {
    console.log(translateX);
    if (!leftDiff) {
      return translateX - items.left.length * itemWidth;
    }
    if (animating) {
      return translateX - (items.left.length + 1) * itemWidth;
    } else {
      return (items.left.length + 1) * itemWidth;
    }
  }
  // we need to use previous translateX because in prev state we could have had diff value
  // which means w + itemWidth would not be correct all the time
  if (animating) {
    if (!rightDiff) {
      return translateX + items.right.length * itemWidth;
    }
    return translateX + (items.right.length + 1) * itemWidth;
  } else {
    return (items.left.length + 1) * itemWidth;
  }
};
