import classes from './slider.module.scss';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import MediaItem from '../MediaItem/MediaItem';
import { useDispatch, useSelector } from 'react-redux';
import debounce from 'debounce';
import { useEffect, useLayoutEffect, useState } from 'react';
import { sliderActions } from '../../store/redux/slider/slider';

const Slider = ({ items }) => {
  const [activeIndex, setActiveIndex] = useState(0);
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

  items = [
    { name: 'red-notice' },
    { name: 'breaking-bad' },
    { name: 'lost1' },
    { name: 'lost2' },
    { name: 'lost3' },
    { name: 'lost4' },
    { name: 'lost5' },
    { name: 'lost6' },
    { name: 'lost7' },
    { name: 'lost8' },
  ];
  // const sliderItems = useSelector((state) => state.slider.items);
  const sliderItemsCount = () => {
    if (min1400) return 7;
    if (min1200) return 6;
    if (min900) return 5;
    if (min600) return 4;
    return 3;
  };
  const sliderMouseIn = () => dispatch(sliderActions.setShowNext(true));
  const sliderMouseOut = () => dispatch(sliderActions.setShowNext(false));
  useLayoutEffect(() => {
    const obj = {
      left: [],
      visible: items.slice(activeIndex, sliderItemsCount() - 1),
      right: items.slice(sliderItemsCount() - 1),
    };
    setSliderItems(obj);
  }, []);
  const handleNextSlide = () => {
    // setActiveIndex((prev) => prev++);
    // const obj = {
    //   left: [],
    //   visible: items.slice(activeIndex, sliderItemsCount() - 1),
    //   right: items.slice(sliderItemsCount() - 1),
    // };
    setSliderItems((prev) => {
      const obj = {
        left: [...prev.left, prev.visible[0]],
        visible: [
          ...prev.visible.slice(1, sliderItemsCount() - 1),
          prev.right[0],
        ],
        right: prev.right.slice(1),
      };
      return obj;
    });
  };
  const visibleItems = () => {
    console.log(sliderItems);

    const vis = sliderItems.visible.map((item, i) => (
      <div
        key={item.name}
        className={`${classes.slider__item} slider__item--${i}`}
      >
        <MediaItem
          item={item}
          index={i}
          isFirst={i === 0}
          isLast={i === sliderItemsCount() - 2}
        />
      </div>
    ));
    const leftHidden = sliderItems.left.map((item, i) => (
      <div key={item.name} className={`${classes.slider__item} slider__item--`}>
        <MediaItem item={item} underIndicator={i === 0} index={i} />
      </div>
    ));
    const rightHidden = sliderItems.right.map((item, i) => (
      <div key={item.name} className={`${classes.slider__item} slider__item--`}>
        <MediaItem item={item} underIndicator={i === 0} index={i} />
      </div>
    ));
    return [...leftHidden, ...vis, ...rightHidden];
  };

  return (
    <div
      onMouseEnter={sliderMouseIn}
      onMouseLeave={debounce(sliderMouseOut, 250)}
      className={classes.rowContent}
    >
      <div className={classes.slider}>
        {/* {showNext && ( */}
        <span onClick={handleNextSlide} className={classes.slider__next}>
          <ArrowForwardIosIcon className={classes.slider__indicatorIcon} />
        </span>
        {/* )} */}
        <ul className={classes.slider__pagination}>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
        </ul>
        <div className={classes.slider__mask}>
          <div className={classes.slider__content}>{visibleItems()}</div>
        </div>
      </div>
    </div>
  );
};

export default Slider;
