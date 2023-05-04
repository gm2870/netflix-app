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
    if (activeIndex === 1) {
      left.unshift(...itemsIndexes.slice(-1));
    }
    return left;
  };

  const rightItems = (middle: number[]) => {
    let midItemsLastIndex = [...middle].pop() || 0;
    if (midItemsLastIndex === itemsLength - 1) {
      midItemsLastIndex = 1;
    }
    let rightItems = itemsIndexes
      .filter((x) => x > midItemsLastIndex)
      .slice(0, rowItems);
    if (activeIndex === Math.ceil(itemsLength / rowItems - 1) - 1) {
      rightItems.push(itemsIndexes[0]);
    }
    return rightItems;
  };
  const middle = middleItems();
  const right = rightItems(middle);
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
  if (!moved) {
    return items.right.length * itemWidth;
  }
  if (direction === 'left') {
    if (animating) {
      return translateX - items.left.length * itemWidth;
    } else {
      return (items.left.length + 1) * itemWidth;
    }
  }

  if (animating) {
    return translateX + items.right.length * itemWidth;
  } else {
    return (items.left.length + 1) * itemWidth;
  }
};
