import classes from './slider.module.scss';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import MediaItem from '../MediaItem/MediaItem';
import { useEffect, useReducer, useState } from 'react';
import { useRef } from 'react';
import { Link } from '@mui/material';
import { calculateTranslateX, filterItems } from './utils';
import { GenreWithMedia, Media } from '../../store/redux/media/model';
import useSliderConfig from '../../hooks/use-slider-config';
import { Direction, SliderState } from './models';

const initialState: SliderState = {
  moved: false,
  animating: false,
  activeIndex: 0,
  cardOpen: false,
  showNext: false,
  translateX: 0,
  itemsLength: 0,
  filteredRow: {
    left: [],
    middle: [],
    right: [],
  },
};

const Slider = ({ titles }: { titles: Media[] }) => {
  const sliderRow = useRef<HTMLDivElement>(null);
  const { rowItems, itemWidth } = useSliderConfig();
  const reducer = (
    state: SliderState,
    action: { type: Direction; animating: boolean }
  ) => {
    const newState = {
      ...state,
    };
    switch (action.type) {
      case 'INITIAL':
        newState.filteredRow = filterItems(
          newState.filteredRow,
          null,
          newState.activeIndex,
          rowItems,
          titles.length,
          false
        );

        if (newState.moved) {
          newState.translateX = calculateTranslateX(
            newState.translateX,
            'right',
            newState.filteredRow,
            itemWidth,
            newState.moved,
            false
          );
        }

        break;

      case 'RIGHT':
        newState.animating = action.animating;

        if (!newState.animating) {
          if (newState.activeIndex >= Math.ceil(titles.length / rowItems) - 1) {
            newState.activeIndex = 0;
          } else newState.activeIndex += 1;
          newState.filteredRow = filterItems(
            newState.filteredRow,
            'right',
            newState.activeIndex,
            rowItems,
            titles.length,
            newState.moved
          );
        }

        newState.translateX = calculateTranslateX(
          newState.translateX,
          'right',
          newState.filteredRow,
          itemWidth,
          newState.moved,
          newState.animating
        );
        newState.moved = true;
        break;

      case 'LEFT':
        newState.animating = action.animating;
        if (!newState.animating) {
          if (newState.activeIndex === 0) {
            newState.activeIndex = Math.ceil(titles.length / rowItems) - 1;
          } else newState.activeIndex -= 1;

          newState.filteredRow = filterItems(
            newState.filteredRow,
            'left',
            newState.activeIndex,
            rowItems,
            titles.length,
            newState.moved
          );
        }

        newState.translateX = calculateTranslateX(
          newState.translateX,
          'left',
          newState.filteredRow,
          itemWidth,
          newState.moved,
          newState.animating
        );
        break;
    }
    return newState;
  };

  const [sliderState, dispatch] = useReducer(reducer, initialState);
  const [showButtons, setShowButtons] = useState(false);
  const sliderItems = titles;

  if (sliderRow?.current) {
    sliderRow.current.style.transform = `translate3d(-${sliderState.translateX}%,0,0)`;
  }

  useEffect(() => {
    dispatch({ type: 'INITIAL', animating: false });
  }, [titles]);

  useEffect(() => {
    if (sliderState.moved) {
      dispatch({ type: 'RIGHT', animating: false });
    }
  }, [rowItems]);

  const handleNextSlide = () => {
    if (sliderState.animating) {
      return;
    }
    dispatch({ type: 'RIGHT', animating: true });
    setTimeout(() => {
      dispatch({ type: 'RIGHT', animating: false });
    }, 750);
  };

  const handlePrevSlide = () => {
    if (sliderState.animating) {
      return;
    }
    dispatch({ type: 'LEFT', animating: true });
    setTimeout(() => {
      dispatch({ type: 'LEFT', animating: false });
    }, 750);
  };
  const handleSliderHover = () => {
    setShowButtons(true);
  };
  const handleSliderMouseleave = () => {
    setShowButtons(false);
  };
  let leftItems: JSX.Element[] = [];
  let middleItems: JSX.Element[] = [];
  let rightItems: JSX.Element[] = [];

  leftItems = sliderState.filteredRow.left.map((itemIndex, i) => {
    const key = sliderItems[itemIndex].id * Math.random();
    return (
      <div key={key} className={`${classes.slider__item} slider__item--`}>
        <MediaItem
          underIndicator={false}
          isFirst={false}
          isLast={false}
          item={sliderItems[itemIndex]}
        />
      </div>
    );
  });

  middleItems = sliderState.filteredRow.middle.map((itemIndex, i) => {
    if (!sliderItems[itemIndex]) {
      return <div key={i}></div>;
    }
    const key = sliderItems[itemIndex].id * Math.random();
    const item = sliderItems[itemIndex];
    return (
      <div key={key} className={`${classes.slider__item} slider__item--${i}`}>
        <MediaItem
          isFirst={
            (sliderState.moved && i === 1) || (!sliderState.moved && i === 0)
          }
          isLast={i === sliderState.filteredRow.middle.length - 2}
          underIndicator={
            (i === 0 && sliderState.filteredRow.left.length > 0) ||
            i === sliderState.filteredRow.middle.length - 1
          }
          item={item}
        />
      </div>
    );
  });

  rightItems = sliderState.filteredRow.right.map((itemIndex, i) => {
    if (!sliderItems[itemIndex]) {
      return <div key={i}></div>;
    }
    const key = sliderItems[itemIndex].id * Math.random();
    const item = sliderItems[itemIndex];
    return (
      <div key={key} className={`${classes.slider__item} slider__item--`}>
        <MediaItem
          underIndicator={false}
          isFirst={false}
          isLast={false}
          item={item}
        />
      </div>
    );
  });

  const result = [...leftItems, ...middleItems, ...rightItems];

  const classNames = sliderState.animating
    ? `${classes.slider__content} ${classes.animating}`
    : `${classes.slider__content}`;
  return (
    <section className={classes.sliderContainer}>
      <div
        className={classes.rowContent}
        onMouseEnter={handleSliderHover}
        onMouseLeave={handleSliderMouseleave}
      >
        <div className={classes.slider}>
          {showButtons && (
            <span onClick={handleNextSlide} className={classes.slider__next}>
              <ArrowForwardIosIcon className={classes.slider__indicatorIcon} />
            </span>
          )}
          {sliderItems.length ? (
            <ul className={classes.slider__pagination}>
              {new Array(Math.ceil(sliderItems.length / rowItems))
                .fill(0)
                .map((x, i) => (
                  <li
                    key={i}
                    className={
                      i === sliderState.activeIndex ? classes.active : ''
                    }
                  ></li>
                ))}
            </ul>
          ) : null}
          {sliderItems.length ? (
            <div className={classes.slider__mask}>
              <div ref={sliderRow} className={classNames}>
                {result}
              </div>
            </div>
          ) : (
            <div className={classes.slider__content}>
              {/* <SliderLoader /> */}
            </div>
          )}
          {sliderState.moved && showButtons && (
            <span onClick={handlePrevSlide} className={classes.slider__prev}>
              <ArrowBackIosIcon className={classes.slider__indicatorIcon} />
            </span>
          )}
        </div>
      </div>
    </section>
  );
};

export default Slider;
