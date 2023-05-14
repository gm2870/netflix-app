import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../src/hooks';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Header from '../../../../src/components/Header/Header';
import {
  getMovieBillboard,
  getMovieTitles,
  getTVBillboard,
  getTVTitles,
} from '../../../../src/store/redux/media/media-actions';
import SlidersContainer from '../../../../src/components/Slider/SlidersContainer';
import SliderLoader from '../../../../src/components/loader/SliderLoader';
import { NoSsr } from '@mui/material';
import Billboard from '../../../../src/components/Billboard/Billboard';

const Titles = () => {
  const dispatch = useAppDispatch();
  const media = useAppSelector((state) => state.media);
  const genresWithMedia = media.mediaItems;
  const item = media.billboardMedia;
  const router = useRouter();
  const typeId = router.query.type_id;
  const type = typeId === '1' ? 'TVShows' : 'Movies';

  useEffect(() => {
    if (typeId === '1') {
      dispatch(getTVBillboard());
      dispatch(getTVTitles());
    } else {
      dispatch(getMovieBillboard());
      dispatch(getMovieTitles());
    }
  }, [dispatch, typeId]);

  return (
    <section>
      <Head>
        <title>Netflix - TV</title>
      </Head>
      <Header />
      {item && <Billboard item={item} />}
      {genresWithMedia.length && (
        <SlidersContainer genresWithTitles={genresWithMedia} />
      )}
      <NoSsr>{(!genresWithMedia.length || !item) && <SliderLoader />}</NoSsr>
    </section>
  );
};

export default Titles;
