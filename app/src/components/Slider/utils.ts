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
  const allIndexes = Array.from(Array(itemsLength).keys());
  let itemsIndexes = [...allIndexes];
  const currMidFirstIndex = currentItems.middle[0];

  const middleItems = () => {
    if (!moved) {
      return itemsIndexes.slice(0, rowItems + 1);
    }

    // on last index we need first item to be added
    if (activeIndex === Math.ceil(itemsLength / rowItems - 1)) {
      return [...itemsIndexes.slice(-(rowItems + 1)), itemsIndexes[0]];
    }

    // on first index we need last item to be added
    if (activeIndex === 0) {
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
    let midItemsLastIndex = middle[middle.length - 1];

    if (midItemsLastIndex === itemsLength - 1) {
      midItemsLastIndex = 1;
    }

    let rightItems = itemsIndexes
      .filter((x) => x > midItemsLastIndex)
      .slice(0, rowItems);

    // important...
    //if it's on index before the last one add first item to right's last item
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
// translate value for x has two steps
// 1. first animating starts
// based on how many items we have on the right side we translate to right
// same for left
// 2.when animating is done we need to go to right based on how many items we have
// on the left side plus one

export const calculateTranslateX = (
  translateX: number,
  direction: 'left' | 'right',
  items: SliderRow,
  itemWidth: number,
  moved: boolean,
  animating: boolean
) => {
  const leftLength = items.left.length;
  const rightLength = items.right.length;
  if (!moved) {
    return rightLength * itemWidth;
  }
  if (direction === 'left') {
    if (animating) {
      return translateX - leftLength * itemWidth;
    } else {
      return (leftLength + 1) * itemWidth;
    }
  }

  if (animating) {
    return translateX + rightLength * itemWidth;
  } else {
    return (leftLength + 1) * itemWidth;
  }
};
