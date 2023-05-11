import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../src/hooks';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Header from '../../../../src/components/Header/Header';
import {
  getMovieTitles,
  getTVTitles,
} from '../../../../src/store/redux/media/media-actions';
import SlidersContainer from '../../../../src/components/Slider/SlidersContainer';
import SliderLoader from '../../../../src/components/loader/SliderLoader';
import { NoSsr } from '@mui/material';

const Titles = () => {
  const dispatch = useAppDispatch();
  const genresWithMedia = useAppSelector((state) => state.media.mediaItems);
  const router = useRouter();
  const typeId = router.query.type_id;
  const type = typeId === '1' ? 'TVShows' : 'Movies';

  useEffect(() => {
    if (typeId === '1') {
      dispatch(getTVTitles());
    } else {
      dispatch(getMovieTitles());
    }
  }, [typeId]);

  return (
    <section>
      <Head>
        <title>Netflix - TV</title>
      </Head>
      <Header />
      {/* {items.length && <Billboard item={items[19]} />} */}
      {genresWithMedia.length && (
        <SlidersContainer genresWithTitles={genresWithMedia} />
      )}
      <NoSsr>{!genresWithMedia.length && <SliderLoader />}</NoSsr>
    </section>
  );
};

export default Titles;
