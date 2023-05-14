import classes from './search.module.scss';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../src/hooks';
import { searchTitle } from '../../src/store/redux/search/search-actions';

import MediaItem from '../../src/components/MediaItem/MediaItem';
import SliderLoader from '../../src/components/loader/SliderLoader';
import Slider from '../../src/components/Slider/Slider';
import Header from '../../src/components/Header/Header';
import Head from 'next/head';

const Search = () => {
  const loading = useAppSelector((state) => state.ui.loading);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const result = useAppSelector((state) => state.search.result);
  useEffect(() => {
    if (router.isReady && router.query.q) {
      dispatch(searchTitle(router.query.q.toString()));
    }
  }, [dispatch, router.isReady, router.query.q]);

  return (
    <div className={classes.search}>
      <Head>
        <title>Netflix - Search</title>
      </Head>
      <Header />
      <div className={classes.search__gallery}>
        <Slider titles={result} />
        {!result.length && loading && <SliderLoader />}
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
