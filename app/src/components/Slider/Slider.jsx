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

const Slider = ({ items }) => {
  const [sliderItems, setSliderItems] = useState([]);
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

  const totalItems = () => {
    const indicatorItemsCount = !sliderStates.moved ? 1 : 2;
    const count = !sliderStates.moved
      ? sliderConfig().rowItems * 2 + indicatorItemsCount
      : items.length;

    return Array.from(Array(count).keys());
  };

  useEffect(() => {
    console.log(sliderStates);
  }, [min1400, sliderStates.activeIndex]);

  // const sliderMouseIn = () => dispatch(sliderActions.setShowNext(true));
  // const sliderMouseOut = () => dispatch(sliderActions.setShowNext(false));
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
  const handleNextSlide = () => {
    dispatch(
      sliderActions.toggleAnimating({ sliderWidth: sliderConfig().itemWidth })
    );

    setTimeout(() => {
      dispatch(
        sliderActions.handleNext({
          totalItemsLength: totalItems().length,
          visibleItemsCount: sliderConfig().rowItems,
          sliderWidth: sliderConfig().itemWidth,
        })
      );
    }, 750);
  };

  const handlePrevSlide = () => {
    setSliderStates((prev) => ({
      ...sliderStates,
      animating: true,
    }));
    // setSliderMoved(true);
    sliderRow.current.style.transform = `translate3d(-${
      sliderConfig().itemWidth
    }%,0,0)`;

    setTimeout(() => {
      setSliderStates((prev) => {
        let index;
        if (prev.activeIndex === 0) {
          index = Math.ceil(totalItems().length / sliderConfig().rowItems) - 1;
        } else index = prev.activeIndex - 1;
        return { activeIndex: index, animating: false };
      });
      sliderRow.current.style.transform = `translate3d(-${
        100 + sliderConfig().itemWidth
      }%,0,0)`;
    }, 750);
  };
  const isFirst = (index) =>
    (index === 0 && !sliderItems.left.length) ||
    (index === 1 && sliderItems.left.length);
  const isLast = (index) => index === sliderItems.visible.length - 2;

  const middleItem = (itemIndex) => middleItems().includes(itemIndex);
  const leftItem = (itemIndex) => leftItems().includes(itemIndex);

  console.log(sliderItems);
  const visibleItems = sliderItems.map((itemIndex, i) => {
    if (leftItem(itemIndex)) {
      return (
        <div
          key={items[itemIndex].id}
          className={`${classes.slider__item} slider__item--`}
        >
          <MediaItem item={items[itemIndex]} />
        </div>
      );
    }
    if (middleItem(itemIndex)) {
      //
      const index = i - leftItems().length;
      return (
        <div
          key={items[itemIndex].id}
          className={`${classes.slider__item} slider__item--${index}`}
        >
          <MediaItem item={items[itemIndex]} />
        </div>
      );
    }
    return (
      <div
        key={items[itemIndex].id}
        className={`${classes.slider__item} slider__item--`}
      >
        <MediaItem item={items[itemIndex]} />
      </div>
    );
  });

  return (
    <div className={classes.rowContent}>
      <div className={classes.slider}>
        <span onClick={handleNextSlide} className={classes.slider__next}>
          <ArrowForwardIosIcon className={classes.slider__indicatorIcon} />
        </span>

        <ul className={classes.slider__pagination}>
          {new Array(Math.ceil(items.length / sliderConfig().rowItems))
            .fill(0)
            .map((x, i) => (
              <li
                key={i}
                className={i === sliderStates.activeIndex ? classes.active : ''}
              ></li>
            ))}
        </ul>
        {items?.length && (
          <div className={classes.slider__mask}>
            <div
              ref={sliderRow}
              className={`${classes.slider__content} ${
                sliderStates.animating ? classes.animating : ''
              }`}
              style={{ transform: sliderStates.transformValue }}
            >
              {visibleItems}
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
