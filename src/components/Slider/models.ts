export type SliderRow = {
  left: number[];
  middle: number[];
  right: number[];
};
export type Direction = 'INITIAL' | 'LEFT' | 'RIGHT';

export type SliderState = {
  moved: boolean;
  animating: boolean;
  activeIndex: number;
  cardOpen: boolean;
  showNext: boolean;
  translateX: number;
  itemsLength: number;
  filteredRow: SliderRow;
};
