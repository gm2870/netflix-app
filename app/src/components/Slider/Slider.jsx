import classes from './slider.module.scss';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import MediaItem from '../MediaItem/MediaItem';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { sliderActions } from '../../store/redux/slider/slider';
import { useRef } from 'react';

const Slider = () => {
  const sliderStates = useSelector((state) => state.slider);
  const dispatch = useDispatch();
  const sliderRow = useRef();
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

  useEffect(() => {
    dispatch(
      sliderActions.setfilteredItems({
        rowItems: sliderConfig().rowItems,
        itemWidth: sliderConfig().itemWidth,
      })
    );
    if (sliderStates.moved) {
      let { rowItems, itemWidth } = sliderConfig();
      let translateX = rowItems * itemWidth + itemWidth;

      sliderRow.current.style.transform = `translate3d(-${translateX}%,0,0)`;
    }
  }, [min600, min900, min1200, min1400]);
  const updateTransformValues = () => {
    let { rowItems, itemWidth } = sliderConfig();
    let w = rowItems * itemWidth;
    let diff = 0;
    if (sliderStates.filteredItems.right.length < rowItems) {
      diff = rowItems - sliderStates.filteredItems.right.length - 1;
    }
    let translateX = !sliderStates.moved
      ? w
      : w * 2 + itemWidth - diff * itemWidth;

    sliderRow.current.style.transform = `translate3d(-${translateX}%,0,0)`;
  };
  const handleNextSlide = () => {
    let { rowItems, itemWidth } = sliderConfig();

    dispatch(
      sliderActions.toggleAnimating({
        direction: 'right',
        itemWidth,
      })
    );
    updateTransformValues();
    setTimeout(() => {
      dispatch(
        sliderActions.handleNext({
          sliderConfig: sliderConfig(),
        })
      );
      let w = rowItems * itemWidth;
      const translateX = w + itemWidth;
      sliderRow.current.style.transform = `translate3d(-${translateX}%,0,0)`;
    }, 750);
  };

  const handlePrevSlide = () => {
    let { rowItems, itemWidth } = sliderConfig();
    let w = rowItems * itemWidth;
    let translateX = itemWidth;

    dispatch(
      sliderActions.toggleAnimating({
        direction: 'left',
        itemWidth: itemWidth,
      })
    );
    sliderRow.current.style.transform = `translate3d(-${translateX}%,0,0)`;

    setTimeout(() => {
      dispatch(
        sliderActions.handlePrevious({
          sliderConfig: sliderConfig(),
        })
      );
      sliderRow.current.style.transform = `translate3d(-${w + itemWidth}%,0,0)`;
    }, 750);
  };
  // const isFirst = (index) =>
  //   (index === 0 && !filteredItems.left.length) ||
  //   (index === 1 && filteredItems.left.length);
  // const isLast = (index) => index === filteredItems.visible.length - 2;

  // const middleItem = (itemIndex) => middleItems().includes(itemIndex);
  // const leftItem = (itemIndex) => leftItems().includes(itemIndex);
  console.log(sliderStates.filteredItems);
  const leftItems = sliderStates.filteredItems.left.map((itemIndex) => (
    <div
      key={sliderStates.items[itemIndex].id}
      className={`${classes.slider__item} slider__item--`}
    >
      <MediaItem item={sliderStates.items[itemIndex]} />
    </div>
  ));
  const visibleItems = sliderStates.filteredItems.visible.map(
    (itemIndex, i) => {
      const key =
        itemIndex !== -1 ? sliderStates.items[itemIndex].id : Math.random();
      const item = itemIndex !== -1 ? sliderStates.items[itemIndex] : null; // itemIndex can be 0 which means mediaItem should be empty;
      return (
        <div key={key} className={`${classes.slider__item} slider__item--${i}`}>
          <MediaItem item={item} />
        </div>
      );
    }
  );
  const rightItems = sliderStates.filteredItems.right.map((itemIndex, i) => {
    const key = sliderStates.items[itemIndex].id;
    const item = sliderStates.items[itemIndex];
    return (
      <div key={key} className={`${classes.slider__item} slider__item--`}>
        <MediaItem item={item} />
      </div>
    );
  });

  const result = [...leftItems, ...visibleItems, ...rightItems];

  return (
    <div className={classes.rowContent}>
      <div className={classes.slider}>
        <span onClick={handleNextSlide} className={classes.slider__next}>
          <ArrowForwardIosIcon className={classes.slider__indicatorIcon} />
        </span>

        <ul className={classes.slider__pagination}>
          {new Array(
            Math.ceil(sliderStates.items.length / sliderConfig().rowItems)
          )
            .fill(0)
            .map((x, i) => (
              <li
                key={i}
                className={i === sliderStates.activeIndex ? classes.active : ''}
              ></li>
            ))}
        </ul>
        {sliderStates.items.length && (
          <div className={classes.slider__mask}>
            <div
              ref={sliderRow}
              className={`${classes.slider__content} ${
                sliderStates.animating ? classes.animating : ''
              }`}
            >
              {result}
            </div>
          </div>
        )}
        {sliderStates.moved ? (
          <span onClick={handlePrevSlide} className={classes.slider__prev}>
            <ArrowBackIosIcon className={classes.slider__indicatorIcon} />
          </span>
        ) : null}
      </div>
    </div>
  );
};

export default Slider;
