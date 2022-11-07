import classes from './slider.module.scss';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import MediaItem from '../MediaItem/MediaItem';
import { useDispatch } from 'react-redux';
import debounce from 'debounce';
import { useEffect, useState } from 'react';
import { sliderActions } from '../../store/redux/slider/slider';
import { useRef } from 'react';

const Slider = ({ items }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [sliderMoved, setSliderMoved] = useState(false);
  const [offset, setOffset] = useState(null);
  const [opacity, setOpacity] = useState(0);
  const [sliderItems, setSliderItems] = useState({
    left: [],
    visible: [],
    right: [],
  });
  // const showNext = useSelector((state) => state.slider.showNext);
  const dispatch = useDispatch();
  const theme = useTheme();
  const min600 = useMediaQuery(theme.breakpoints.up('sm'));
  const min900 = useMediaQuery(theme.breakpoints.up('md'));
  const min1200 = useMediaQuery(theme.breakpoints.up('lg'));
  const min1400 = useMediaQuery('(min-width:1400px)');
  const sliderRow = useRef();
  const sliderItemsCount = () => {
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
  useEffect(() => {
    console.log(items);
    const obj = {
      left: leftItems(),
      visible: middleItems(),
      right: rightItems(),
    };
    setSliderItems(obj);
  }, [min600, min900, min1200, min1400, activeIndex]);

  const sliderMouseIn = () => dispatch(sliderActions.setShowNext(true));
  const sliderMouseOut = () => dispatch(sliderActions.setShowNext(false));
  const leftItems = () => {
    if (sliderMoved) {
      if (activeIndex === 0) {
        return [
          ...sliderItems.visible.slice(0, sliderItemsCount() - 2),
          ...items.slice(-2),
        ];
      }
      if (activeIndex === 1) {
        return [
          ...items.slice((activeIndex - 1) * sliderItemsCount()).slice(-1),
          ...sliderItems.visible.slice(0, sliderItemsCount() - 1),
        ];
      }
      return [
        ...sliderItems.visible.slice(0, sliderItemsCount() - 2),
        ...items.slice((activeIndex - 1) * sliderItemsCount()).slice(-2),
      ];
    }
    return [];
  };
  const middleItems = () => {
    if (sliderMoved) {
      if (activeIndex === 0) {
        const lastItem = items.slice(-1);
        return [
          ...lastItem,
          ...items
            .slice(activeIndex * sliderItemsCount())
            .slice(0, sliderItemsCount()),
        ];
      }
      return [
        ...items
          .slice(activeIndex * sliderItemsCount() - 1)
          .slice(0, sliderItemsCount() + 2),
      ];
    }
    return items.slice(0, sliderItemsCount() + 1);
  };
  const rightItems = () => {
    if (activeIndex === Math.ceil(items.length / (sliderItemsCount() - 1))) {
      return items.slice(0, sliderItemsCount());
    }
    if (activeIndex === 0 && sliderMoved) {
      return items
        .slice((activeIndex + 1) * sliderItemsCount())
        .slice(0, sliderItemsCount() - 1);
    }
    return items
      .slice((activeIndex + 1) * sliderItemsCount() + 1)
      .slice(0, sliderItemsCount());
  };
  const handleNextSlide = () => {
    setAnimating(true);
    setSliderMoved(true);
    const offsetVal =
      !sliderMoved && activeIndex === 0 ? 100 : 200 + sliderWidth();
    setOffset(offsetVal);
    sliderRow.current.style.transform = `translate3d(-${offsetVal}%,0,0)`;
    setTimeout(() => {
      setAnimating(false);
      setAnimating(false);
      sliderRow.current.style.transform = `translate3d(-${
        100 + sliderWidth()
      }%,0,0)`;
      // sliderRow.current.style.transition = 'transform 5s';
      setOffset(offsetVal);
      setActiveIndex((prevIndex) => {
        if (prevIndex >= Math.ceil(items.length / sliderItemsCount() - 1)) {
          return 0;
        }

        return prevIndex + 1;
      });
    }, 750);
  };

  const handlePrevSlide = () => {
    setAnimating(true);
    setSliderMoved(true);
    sliderRow.current.style.transform = `translate3d(-${sliderWidth()}%,0,0)`;
    setTimeout(() => {
      setAnimating(false);
      sliderRow.current.style.transform = `translate3d(-${
        100 + sliderWidth()
      }%,0,0)`;
      setActiveIndex((prevIndex) => {
        if (prevIndex === 0) {
          return Math.ceil(items.length / sliderItemsCount() - 1);
        }
        return prevIndex - 1;
      });
    }, 750);
  };
  const isFirst = (index) =>
    (index === 0 && !sliderItems.left.length) ||
    (index === 1 && sliderItems.left.length);
  const isLast = (index) => index === sliderItems.visible.length - 2;
  const visibleItems = () => {
    console.log(sliderItems);
    const vis = sliderItems.visible.map((item, i) => (
      <div
        key={Math.random()}
        className={`${classes.slider__item} slider__item--${i}`}
      >
        <MediaItem
          item={item}
          index={i}
          isFirst={isFirst(i)}
          isLast={isLast(i)}
        />
      </div>
    ));

    const leftHidden = sliderItems.left.map((item, i) => (
      <div
        key={Math.random()}
        className={`${classes.slider__item} slider__item--`}
      >
        <MediaItem item={item} index={i} />
      </div>
    ));
    const rightHidden = sliderItems.right.map((item, i) => (
      <div
        key={Math.random()}
        className={`${classes.slider__item} slider__item--`}
      >
        <MediaItem item={item} index={i} />
      </div>
    ));
    return [...leftHidden, ...vis, ...rightHidden];
  };

  const content = () => {
    return (
      <div
        ref={sliderRow}
        className={`${classes.slider__content} ${
          animating ? classes.animating : ''
        }`}
      >
        {visibleItems()}
      </div>
    );
  };
  return (
    <div
      onMouseEnter={sliderMouseIn}
      onMouseLeave={debounce(sliderMouseOut, 250)}
      className={classes.rowContent}
    >
      <div className={classes.slider}>
        <span onClick={handleNextSlide} className={classes.slider__next}>
          <ArrowForwardIosIcon className={classes.slider__indicatorIcon} />
        </span>

        <ul className={classes.slider__pagination}>
          {new Array(Math.ceil(items.length / sliderItemsCount()))
            .fill(0)
            .map((x, i) => (
              <li
                key={i}
                className={i === activeIndex ? classes.active : ''}
              ></li>
            ))}
        </ul>
        <div className={classes.slider__mask}>{content()}</div>
        {sliderItems.left.length ? (
          <span onClick={handlePrevSlide} className={classes.slider__prev}>
            <ArrowBackIosIcon className={classes.slider__indicatorIcon} />
          </span>
        ) : null}
      </div>
    </div>
  );
};

export default Slider;
