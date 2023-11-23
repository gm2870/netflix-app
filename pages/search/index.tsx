import classes from './search.module.scss';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import MediaItem from '../../src/components/MediaItem/MediaItem';
import SliderLoader from '../../src/components/loader/SliderLoader';
import Header from '../../src/components/Header/Header';
import Head from 'next/head';
import GridList from '@/src/components/GridList/GridList';
import { Media } from '@/src/store/redux/media/model';
import useSliderConfig from '@/src/hooks/use-slider-config';
import { useSearchTitleQuery } from '@/src/services/query/media';

const Search = () => {
  const [name, setName] = useState('');
  const router = useRouter();
  const { data, isLoading, isFetching } = useSearchTitleQuery(name, {
    skip: !name,
  });

  useEffect(() => {
    if (router.isReady && router.query.q) {
      setName(router.query.q.toString());
    }
  }, [router.isReady, router.query.q]);

  const { rowItems } = useSliderConfig();
  return (
    <div className={classes.search}>
      <Head>
        <title>Netflix - Search</title>
      </Head>
      <Header />
      <div className={classes.search__gallery}>
        {data && !isLoading && !isFetching && (
          <GridList>
            {data.map((t: Media, i: number) => (
              <MediaItem
                isFirst={i % rowItems === 0}
                isLast={(i + 1) % rowItems === 0}
                key={i}
                item={t}
              />
            ))}
          </GridList>
        )}
        {(isLoading || isFetching) && <SliderLoader />}
        {!isLoading && !isFetching && !data?.length && (
          <div className={classes.search__noResult}>
            No matching titles found.
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
