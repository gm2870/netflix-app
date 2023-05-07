import LoadingTitle from '../../src/components/loader/Loading-title/Loading-title';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import classes from './search.module.scss';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../src/hooks';
import { searchTitle } from '../../src/store/redux/search/search-actions';

import MediaItem from '../../src/components/MediaItem/MediaItem';

const Search = () => {
  const loading = useAppSelector((state) => state.ui.loading);

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

  const router = useRouter();
  const dispatch = useAppDispatch();
  const result = useAppSelector((state) => state.search.result);
  useEffect(() => {
    if (router.isReady && router.query.q) {
      dispatch(searchTitle(router.query.q.toString()));
    }
  }, [router.query.q]);

  const { rowItems, itemWidth } = sliderConfig();
  const loadingBoxes = new Array(rowItems).fill(0).map((_, i) => {
    const animationDelay = i * 0.2 + 's';

    return (
      <LoadingTitle key={i} animationDelay={animationDelay}></LoadingTitle>
    );
  });
  const content = result?.map((item, i) => <MediaItem key={i} item={item} />);
  return (
    <div className={classes.search}>
      <div className={classes.search__gallery}>
        {content}
        {!result.length && loading && (
          <div className={classes.search__loading}>{loadingBoxes}</div>
        )}
        {!loading && !result.length && (
          <div className={classes.search__noResult}>
            No matching titles found.
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
