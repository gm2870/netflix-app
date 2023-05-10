import classes from './search.module.scss';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../src/hooks';
import { searchTitle } from '../../src/store/redux/search/search-actions';

import MediaItem from '../../src/components/MediaItem/MediaItem';
import SliderLoader from '../../src/components/loader/SliderLoader';

const Search = () => {
  const loading = useAppSelector((state) => state.ui.loading);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const result = useAppSelector((state) => state.search.result);
  useEffect(() => {
    if (router.isReady && router.query.q) {
      dispatch(searchTitle(router.query.q.toString()));
    }
  }, [router.query.q]);

  const content = result?.map((item, i) => <MediaItem key={i} item={item} />);
  return (
    <div className={classes.search}>
      <div className={classes.search__gallery}>
        {content}
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
