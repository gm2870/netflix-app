import classes from './slider.module.scss';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import MediaItem from '../MediaItem/MediaItem';
import { useEffect, useReducer } from 'react';
import { sliderActions } from '../../store/redux/slider/slider';
import { useRef } from 'react';
import { Link } from '@mui/material';
import { useAppSelector, useAppDispatch } from '../../hooks';
import LoadingTitle from '../loader/Loading-title/Loading-title';
import { Media } from '../../store/redux/media/model';
import {
  calculateTranslateX,
  filterItems,
} from '../../store/redux/slider/utils';

type SliderRow = {
  left: number[];
  middle: number[];
  right: number[];
};
type Direction = 'INITIAL' | 'LEFT' | 'RIGHT';

type SliderState = {
  moved: boolean;
  animating: boolean;
  activeIndex: number;
  cardOpen: boolean;
  showNext: boolean;
  translateX: number;
  itemsLength: number;
  filteredRow: SliderRow;
};

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

const SliderTemp = (props: any) => {
  // const dispatch = useAppDispatch();
  const sliderRow = useRef<HTMLDivElement>(null);
  const theme = useTheme();
  const min600 = useMediaQuery(theme.breakpoints.up('sm'));
  const min900 = useMediaQuery(theme.breakpoints.up('md'));
  const min1200 = useMediaQuery(theme.breakpoints.up('lg'));
  const min1400 = useMediaQuery('(min-width:1400px)');
  const sliderConfig = () => {
    if (min1400) {
      return {
        rowItems: 6,
        itemWidth: 16.66666666666667,
      };
    }
    if (min1200)
      return {
        rowItems: 5,
        itemWidth: 20,
      };
    if (min900)
      return {
        rowItems: 4,
        itemWidth: 25,
      };
    if (min600)
      return {
        rowItems: 3,
        itemWidth: 33.333333,
      };
    return {
      rowItems: 2,
      itemWidth: 50,
    };
  };
  const { rowItems, itemWidth } = sliderConfig();

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
          props.items.length,
          false
        );

        if (newState.moved) {
          newState.translateX = calculateTranslateX(
            newState.translateX,
            'right',
            newState.filteredRow,
            rowItems,
            itemWidth,
            newState.moved,
            false
          );
        }

        break;

      case 'RIGHT':
        newState.animating = action.animating;

        if (!newState.animating) {
          if (
            newState.activeIndex >=
            Math.ceil(props.items.length / rowItems) - 1
          ) {
            newState.activeIndex = 0;
          } else newState.activeIndex += 1;
          newState.filteredRow = filterItems(
            newState.filteredRow,
            'right',
            newState.activeIndex,
            rowItems,
            props.items.length,
            newState.moved
          );
        }

        newState.translateX = calculateTranslateX(
          newState.translateX,
          'right',
          newState.filteredRow,
          rowItems,
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
            newState.activeIndex = Math.ceil(props.items.length / rowItems) - 1;
          } else newState.activeIndex -= 1;
          newState.filteredRow = filterItems(
            newState.filteredRow,
            'left',
            newState.activeIndex,
            rowItems,
            props.items.length,
            newState.moved
          );
        }

        newState.translateX = calculateTranslateX(
          newState.translateX,
          'left',
          newState.filteredRow,
          rowItems,
          itemWidth,
          newState.moved,
          newState.animating
        );
        break;
      default:
        break;
    }
    return newState;
  };
  const [sliderState, dispatch] = useReducer(reducer, initialState);
  const sliderItems = props.items;
  if (sliderRow?.current) {
    sliderRow.current.style.transform = `translate3d(-${sliderState.translateX}%,0,0)`;
  }
  useEffect(() => {
    dispatch({ type: 'INITIAL', animating: false });
  }, [props.items]);
  useEffect(() => {
    if (sliderState.moved) {
      dispatch({ type: 'RIGHT', animating: false });
    }
  }, [min600, min900, min1200, min1400]);

  const handleNextSlide = () => {
    dispatch({ type: 'RIGHT', animating: true });
    setTimeout(() => {
      dispatch({ type: 'RIGHT', animating: false });
    }, 750);
  };

  const handlePrevSlide = () => {
    dispatch({ type: 'LEFT', animating: true });
    setTimeout(() => {
      dispatch({ type: 'LEFT', animating: false });
    }, 750);
  };
  let leftItems: JSX.Element[] = [];
  let middleItems: JSX.Element[] = [];
  let rightItems: JSX.Element[] = [];
  if (sliderItems.length) {
    console.log(sliderState.filteredRow);
    leftItems = sliderState.filteredRow.left.map((itemIndex) => (
      <div
        key={Math.random()}
        className={`${classes.slider__item} slider__item--`}
      >
        <MediaItem
          underIndicator={false}
          isFirst={false}
          isLast={false}
          item={sliderItems[itemIndex]}
        />
      </div>
    ));
    middleItems = sliderState.filteredRow.middle.map((itemIndex, i) => {
      if (!sliderItems[itemIndex]) {
        return <div key={i}></div>;
      }
      const key = sliderItems[itemIndex].id;
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
      const key = sliderItems[itemIndex].id;
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
  }
  const result = [...leftItems, ...middleItems, ...rightItems];

  const emptyBoxes = new Array(sliderConfig().rowItems + 1)
    .fill(0)
    .map((_, i) => {
      const animationDelay = i * 0.2 + 's';

      return (
        <LoadingTitle key={i} animationDelay={animationDelay}></LoadingTitle>
      );
    });

  const classNames = sliderState.animating
    ? `${classes.slider__content} ${classes.animating}`
    : `${classes.slider__content}`;
  return (
    <section className={classes.sliderContainer}>
      <Link href="/" className={classes.title}>
        <h2 className={classes.title__header}>{props.title}</h2>
      </Link>
      <div className={classes.rowContent}>
        <div className={classes.slider}>
          {sliderItems.length ? (
            <span onClick={handleNextSlide} className={classes.slider__next}>
              <ArrowForwardIosIcon className={classes.slider__indicatorIcon} />
            </span>
          ) : null}
          {sliderItems.length ? (
            <ul className={classes.slider__pagination}>
              {new Array(
                Math.ceil(sliderItems.length / sliderConfig().rowItems)
              )
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
            <div className={classes.slider__content}>{emptyBoxes}</div>
          )}
          {sliderState.moved ? (
            <span onClick={handlePrevSlide} className={classes.slider__prev}>
              <ArrowBackIosIcon className={classes.slider__indicatorIcon} />
            </span>
          ) : null}
        </div>
      </div>
    </section>
  );
};

export default SliderTemp;
