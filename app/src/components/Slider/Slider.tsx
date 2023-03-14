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
import { Link } from '@mui/material';

const Slider = () => {
  const sliderStates = useAppSelector((state) => state.slider);
  const dispatch = useDispatch();
  const sliderRow = useRef();
  const theme = useTheme();
  const min600 = useMediaQuery(theme.breakpoints.up('sm'));
  const min900 = useMediaQuery(theme.breakpoints.up('md'));
  const min1200 = useMediaQuery(theme.breakpoints.up('lg'));
  const min1400 = useMediaQuery('(min-width:1400px)');

  if (sliderStates.translateX) {
    sliderRow.current.style.transform = `translate3d(-${sliderStates.translateX}%,0,0)`;
  }

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
    const { rowItems, itemWidth } = sliderConfig();
    dispatch(
      sliderActions.setfilteredItems({
        rowItems,
        itemWidth,
      })
    );
    if (sliderStates.moved) {
      const { rowItems, itemWidth } = sliderConfig();
      let translateX = rowItems * itemWidth + itemWidth;

      sliderRow.current.style.transform = `translate3d(-${translateX}%,0,0)`;
    }
  }, [min600, min900, min1200, min1400]);

  const handleNextSlide = () => {
    let { rowItems, itemWidth } = sliderConfig();
    dispatch(
      sliderActions.toggleAnimating({
        direction: 'right',
        rowItems,
        itemWidth,
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
    let { itemWidth } = sliderConfig();
    dispatch(
      sliderActions.toggleAnimating({
        direction: 'left',
        itemWidth: itemWidth,
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
  const leftItems = sliderStates.filteredItems.left.map((itemIndex) => (
    <div
      key={sliderStates.items[itemIndex].id}
      className={`${classes.slider__item} slider__item--`}
    >
      <MediaItem item={sliderStates.items[itemIndex]} />
    </div>
  ));
  const visibleItems = sliderStates.filteredItems.middle.map((itemIndex, i) => {
    const key =
      itemIndex !== -1 ? sliderStates.items[itemIndex].id : Math.random();
    const item = itemIndex !== -1 ? sliderStates.items[itemIndex] : null; // itemIndex can be 0 which means mediaItem should be empty;
    return (
      <div key={key} className={`${classes.slider__item} slider__item--${i}`}>
        <MediaItem
          isFirst={
            (sliderStates.moved && i === 1) || (!sliderStates.moved && i === 0)
          }
          isLast={i === sliderStates.filteredItems.middle.length - 2}
          underIndicator={
            (i === 0 && sliderStates.filteredItems.left.length) ||
            i === sliderStates.filteredItems.middle.length - 1
          }
          item={item}
        />
      </div>
    );
  });
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
  const classNames = sliderStates.animating
    ? `${classes.slider__content} ${classes.animating}`
    : `${classes.slider__content}`;
  return (
    <section className={classes.sliderContainer}>
      <Link href="/" className={classes.title}>
        <h2 className={classes.title__header}>
          Suspenseful European TV Thrillers
        </h2>
      </Link>
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
                  className={
                    i === sliderStates.activeIndex ? classes.active : ''
                  }
                ></li>
              ))}
          </ul>
          {sliderStates.items.length ? (
            <div className={classes.slider__mask}>
              <div ref={sliderRow} className={classNames}>
                {result}
              </div>
            </div>
          ) : (
            <div></div>
          )}
          {sliderStates.moved ? (
            <span onClick={handlePrevSlide} className={classes.slider__prev}>
              <ArrowBackIosIcon className={classes.slider__indicatorIcon} />
            </span>
          ) : null}
        </div>
      </div>
    </section>
  );
};

export default Slider;
