import classes from './index.module.scss';
import { Fragment, useEffect } from 'react';
import Head from 'next/head';
import Header from '../../src/components/Header/Header';
import SlidersContainer from '../../src/components/Slider/SlidersContainer';
import { useAppDispatch, useAppSelector } from '../../src/hooks';
import { getAllTitles } from '../../src/store/redux/media/media-actions';
import SliderLoader from '../../src/components/loader/SliderLoader';
import NoSsr from '@mui/base/NoSsr';

const browse = () => {
  const dispatch = useAppDispatch();
  const genresWithMedia = useAppSelector((state) => state.media.mediaItems);

  useEffect(() => {
    dispatch(getAllTitles());
  }, []);

  return (
    <section className={classes.browse}>
      <Head>
        <title>Netflix - Home</title>
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
export default browse;

// export async function getServerSideProps() {
//   const genres = await Genre.find();

//   return {
//     props: {
//       genres: JSON.stringify(genres),
//     },
//   };
// }
