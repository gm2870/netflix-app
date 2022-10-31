import classes from './slider.module.scss';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import MediaItem from '../MediaItem/MediaItem';
import { useDispatch, useSelector } from 'react-redux';
import { uiActions } from '../../store/redux/ui/ui.mjs';
import debounce from 'debounce';
import { useEffect, useState } from 'react';

const Slider = () => {
  const [sliderItems, setSliderItems] = useState([]);
  const showNext = useSelector((state) => state.ui.showNext);
  const dispatch = useDispatch();
  const theme = useTheme();
  const min600 = useMediaQuery(theme.breakpoints.up('sm'));
  const min900 = useMediaQuery(theme.breakpoints.up('md'));
  const min1200 = useMediaQuery(theme.breakpoints.up('lg'));
  const min1400 = useMediaQuery('(min-width:1400px)');
  const items = [
    { name: 'red-notice' },
    { name: 'breaking-bad' },
    { name: 'lost' },
    { name: 'lost' },
    { name: 'lost' },
    { name: 'lost' },
    { name: 'lost' },
    { name: 'lost' },
    { name: 'lost' },
    { name: 'lost' },
  ];

  const sliderItemsCount = () => {
    if (min1400) return 7;
    if (min1200) return 6;
    if (min900) return 5;
    if (min600) return 4;
    return 3;
  };
  const sliderMouseIn = () => dispatch(uiActions.setShowNext(true));
  const sliderMouseOut = () => dispatch(uiActions.setShowNext(false));

  const visibleItems = () => {
    const vis = items.slice(0, sliderItemsCount() - 1).map((item, i) => (
      <div key={i} className={`${classes.slider__item} slider__item--${i}`}>
        <MediaItem
          item={item}
          index={i}
          isFirst={i === 0}
          isLast={i === sliderItemsCount() - 2}
        />
      </div>
    ));
    const hid = items.slice(sliderItemsCount()).map((item, i) => (
      <div key={i} className={`${classes.slider__item} slider__item--`}>
        <MediaItem item={item} underIndicator={i === 0} index={i} />
      </div>
    ));
    return [...vis, ...hid];
  };

  return (
    <div
      onMouseEnter={sliderMouseIn}
      onMouseLeave={debounce(sliderMouseOut, 250)}
      className={classes.rowContent}
    >
      <div className={classes.slider}>
        {showNext && (
          <span className={classes.slider__next}>
            <ArrowForwardIosIcon className={classes.slider__indicatorIcon} />
          </span>
        )}
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
