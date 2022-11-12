import classes from './slider.module.scss';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import MediaItem from '../MediaItem/MediaItem';
import { useDispatch, useSelector } from 'react-redux';
import debounce from 'debounce';
import { useEffect, useState } from 'react';
import { sliderActions } from '../../store/redux/slider/slider';
import { useRef } from 'react';

const Slider = ({ items }) => {
  const [sliderItems, setSliderItems] = useState([]);
  const sliderStates = useSelector((state) => state.slider);
  const dispatch = useDispatch();
  const theme = useTheme();
  const min600 = useMediaQuery(theme.breakpoints.up('sm'));
  const min900 = useMediaQuery(theme.breakpoints.up('md'));
  const min1200 = useMediaQuery(theme.breakpoints.up('lg'));
  const min1400 = useMediaQuery('(min-width:1400px)');
  const sliderRow = useRef();
  const visibleItemsCount = () => {
    if (min1400) return 6;
    if (min1200) return 5;
    if (min900) return 4;
    if (min600) return 3;
    return 2;
  };
  const sliderWidth = () => {
    if (min1400) return 16.66666666666667;
    if (min1200) return 20;
    if (min900) return 25;
    if (min600) return 33.333333;
    return 50;
  };
  const totalItems = () => {
    const indicatorItemsCount = !sliderStates.moved ? 1 : 2;
    const count = !sliderStates.moved
      ? visibleItemsCount() * 2 + indicatorItemsCount
      : items.length;

    return Array.from(Array(count).keys());
  };

  useEffect(() => {
    const obj = {
      left: leftItems(),
      visible: middleItems(),
      right: rightItems(),
    };
    console.log(obj);
    setSliderItems([...obj.left, ...obj.visible, ...obj.right]);
  }, [min600, min900, min1200, min1400, sliderStates.activeIndex]);

  // const sliderMouseIn = () => dispatch(sliderActions.setShowNext(true));
  // const sliderMouseOut = () => dispatch(sliderActions.setShowNext(false));
  const leftItems = () => {
    if (sliderStates.moved) {
      if (sliderStates.activeIndex === 0) {
        // get the last 7 items but drop the last one
        return [
          ...totalItems()
            .slice(-(visibleItemsCount() + 1))
            .slice(0, visibleItemsCount()),
        ];
      }

      if (sliderStates.activeIndex === 1) {
        return [
          ...totalItems().slice(-1),
          ...totalItems().slice(
            sliderStates.activeIndex - 1,
            visibleItemsCount() - 1
          ),
        ];
      }
      return totalItems()
        .slice((sliderStates.activeIndex - 1) * visibleItemsCount() - 1)
        .slice(0, visibleItemsCount());
    }
    return [];
  };
  const middleItems = () => {
    if (sliderStates.moved) {
      if (sliderStates.activeIndex === 0) {
        const lastItem = totalItems().slice(-1);
        return [...lastItem, ...totalItems().slice(0, visibleItemsCount() + 1)];
      }

      return [
        ...totalItems()
          .slice(sliderStates.activeIndex * visibleItemsCount() - 1)
          .slice(0, visibleItemsCount() + 2),
      ];
    }
    return totalItems().slice(0, visibleItemsCount() + 1);
  };
  const rightItems = () => {
    if (
      sliderStates.activeIndex ===
      Math.ceil(items.length / visibleItemsCount() - 1)
    ) {
      return totalItems().slice(0, visibleItemsCount());
    }
    if (
      sliderStates.activeIndex ===
      Math.ceil(items.length / visibleItemsCount()) - 2
    ) {
      return [
        ...totalItems()
          .slice((sliderStates.activeIndex + 1) * visibleItemsCount() + 1)
          .slice(0, visibleItemsCount()),
        ...totalItems().slice(0, 1),
      ];
    }
    return totalItems()
      .slice((sliderStates.activeIndex + 1) * visibleItemsCount() + 1)
      .slice(0, visibleItemsCount());
  };
  const handleNextSlide = () => {
    dispatch(sliderActions.toggleAnimating());
    dispatch(sliderActions.setTransFormValue({ sliderWidth: sliderWidth() }));

    setTimeout(() => {
      dispatch(
        sliderActions.handleNext({
          totalItemsLength: totalItems().length,
          visibleItemsCount: visibleItemsCount(),
          sliderWidth: sliderWidth(),
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
    sliderRow.current.style.transform = `translate3d(-${sliderWidth()}%,0,0)`;

    setTimeout(() => {
      setSliderStates((prev) => {
        let index;
        if (prev.activeIndex === 0) {
          index = Math.ceil(totalItems().length / visibleItemsCount()) - 1;
        } else index = prev.activeIndex - 1;
        return { activeIndex: index, animating: false };
      });
      sliderRow.current.style.transform = `translate3d(-${
        100 + sliderWidth()
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
          {new Array(Math.ceil(items.length / visibleItemsCount()))
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
