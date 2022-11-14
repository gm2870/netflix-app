import classes from './slider.module.scss';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import MediaItem from '../MediaItem/MediaItem';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
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
      sliderActions.setSliderItems({ rowItems: sliderConfig().rowItems })
    );
  }, [min1400]);

  const handleNextSlide = () => {
    dispatch(
      sliderActions.toggleAnimating({
        direction: 'right',
        itemWidth: sliderConfig().itemWidth,
      })
    );

    setTimeout(() => {
      dispatch(
        sliderActions.handleNext({
          sliderConfig: sliderConfig(),
        })
      );
    }, 750);
  };

  const handlePrevSlide = () => {
    dispatch(
      sliderActions.toggleAnimating({
        direction: 'left',
        itemWidth: sliderConfig().itemWidth,
      })
    );
    setTimeout(() => {
      dispatch(
        sliderActions.handlePrevious({
          sliderConfig: sliderConfig(),
        })
      );
    }, 750);
  };
  // const isFirst = (index) =>
  //   (index === 0 && !sliderItems.left.length) ||
  //   (index === 1 && sliderItems.left.length);
  // const isLast = (index) => index === sliderItems.visible.length - 2;

  // const middleItem = (itemIndex) => middleItems().includes(itemIndex);
  // const leftItem = (itemIndex) => leftItems().includes(itemIndex);

  const leftItems = sliderStates.sliderItems.left.map((itemIndex) => (
    <div
      key={sliderStates.items[itemIndex].id}
      className={`${classes.slider__item} slider__item--`}
    >
      <MediaItem item={sliderStates.items[itemIndex]} />
    </div>
  ));
  const visibleItems = sliderStates.sliderItems.visible.map((itemIndex, i) => (
    <div
      key={sliderStates.items[itemIndex].id}
      className={`${classes.slider__item} slider__item--${i}`}
    >
      <MediaItem item={sliderStates.items[itemIndex]} />
    </div>
  ));
  const rightItems = sliderStates.sliderItems.right.map((itemIndex, i) => (
    <div
      key={sliderStates.items[itemIndex].id}
      className={`${classes.slider__item} slider__item--`}
    >
      <MediaItem item={sliderStates.items[itemIndex]} />
    </div>
  ));

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
              style={{ transform: sliderStates.transformValue }}
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
