import classes from './slider.module.scss';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { useEffect, useRef, useState } from 'react';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import MediaItem from '../MediaItem/MediaItem';
const Slider = (props) => {
  const [showNext, setShowNext] = useState(false);
  const theme = useTheme();
  const min600 = useMediaQuery(theme.breakpoints.up('sm'));
  const min900 = useMediaQuery(theme.breakpoints.up('md'));
  const min1200 = useMediaQuery(theme.breakpoints.up('lg'));
  const min1400 = useMediaQuery('(min-width:1400px)');

  const sliderItemsCount = () => {
    if (min1400) return 7;
    if (min1200) return 5;
    if (min900) return 4;
    if (min600) return 3;
    return 2;
  };
  const sliderHiddenItemsCount = () => {
    if (min1400) return 6;
    if (min1200) return 5;
    if (min900) return 4;
    if (min600) return 3;
    return 2;
  };
  const sliderMouseIn = () => setShowNext(true);
  const sliderMouseOut = () => setShowNext(false);

  const visibleItems = () =>
    new Array(sliderItemsCount()).fill(0).map((item, i) => (
      <div key={i} className={`${classes.slider__item} slider__item--${i}`}>
        <MediaItem index={i} />
      </div>
    ));

  const hiddenItems = () =>
    new Array(sliderHiddenItemsCount()).fill(0).map((item, i) => (
      <div key={i} className={`${classes.slider__item} slider__item--`}>
        <MediaItem index={i} />
      </div>
    ));
  return (
    <div className={classes.rowContent}>
      <div className={classes.slider}>
        <span className={classes.slider__next}>
          <ArrowForwardIosIcon className={classes.slider__indicatorIcon} />
        </span>
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
          <div className={classes.slider__content}>
            {visibleItems()}
            {hiddenItems()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Slider;
