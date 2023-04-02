import classes from './index.module.scss';

import { Fragment, useEffect, useState } from 'react';
import Slider from '../../src/components/Slider/Slider';

import { getMediaItems } from '../../src/store/redux/media/media-actions';

import Billboard from './Billboard/Billboard';
import { useAppDispatch, useAppSelector } from '../../src/hooks';
import { Media } from '../../src/store/redux/media/model';
import Header from '../../src/components/Header/Header';

const browse = () => {
  const dispatch = useAppDispatch();

  const items = useAppSelector((state) => state.slider.items);

  useEffect(() => {
    console.log('useEffect');

    if (!items.length) {
      dispatch(getMediaItems());
    }
  }, []);

  return (
    <section className={classes.browse}>
      <Header></Header>
      <Fragment>
        {items.length && <Billboard item={items[19]} />}
        <Slider />
      </Fragment>
    </section>
  );
};
export default browse;
