const leftItems = () => {
  if (sliderStates.moved) {
    if (sliderStates.activeIndex === 0) {
      // get the last 7 items but drop the last one
      return [
        ...totalItems()
          .slice(-(sliderConfig().rowItems + 1))
          .slice(0, sliderConfig().rowItems),
      ];
    }

    if (sliderStates.activeIndex === 1) {
      return [
        ...totalItems().slice(-1),
        ...totalItems().slice(
          sliderStates.activeIndex - 1,
          sliderConfig().rowItems - 1
        ),
      ];
    }
    return totalItems()
      .slice((sliderStates.activeIndex - 1) * sliderConfig().rowItems - 1)
      .slice(0, sliderConfig().rowItems);
  }
  return [];
};
const middleItems = () => {
  if (sliderStates.moved) {
    if (sliderStates.activeIndex === 0) {
      const lastItem = totalItems().slice(-1);
      return [
        ...lastItem,
        ...totalItems().slice(0, sliderConfig().rowItems + 1),
      ];
    }

    return [
      ...totalItems()
        .slice(sliderStates.activeIndex * sliderConfig().rowItems - 1)
        .slice(0, sliderConfig().rowItems + 2),
    ];
  }
  return totalItems().slice(0, sliderConfig().rowItems + 1);
};
const rightItems = () => {
  if (
    sliderStates.activeIndex ===
    Math.ceil(items.length / sliderConfig().rowItems - 1)
  ) {
    return totalItems().slice(0, sliderConfig().rowItems);
  }
  if (
    sliderStates.activeIndex ===
    Math.ceil(items.length / sliderConfig().rowItems) - 2
  ) {
    return [
      ...totalItems()
        .slice((sliderStates.activeIndex + 1) * sliderConfig().rowItems + 1)
        .slice(0, sliderConfig().rowItems),
      ...totalItems().slice(0, 1),
    ];
  }
  return totalItems()
    .slice((sliderStates.activeIndex + 1) * sliderConfig().rowItems + 1)
    .slice(0, sliderConfig().rowItems);
};
