import classes from './index.module.scss';
import { useEffect } from 'react';
import Head from 'next/head';
import Header from '../../src/components/Header/Header';
import SlidersContainer from '../../src/components/Slider/SlidersContainer';
import { useAppDispatch, useAppSelector } from '../../src/hooks';
import {
  getAllTitles,
  getGenralBillboard,
} from '../../src/store/redux/media/media-actions';
import SliderLoader from '../../src/components/loader/SliderLoader';
import NoSsr from '@mui/base/NoSsr';
import Billboard from '../../src/components/Billboard/Billboard';

const Browse = () => {
  const dispatch = useAppDispatch();
  const media = useAppSelector((state) => state.media);
  const genresWithMedia = media.mediaItems;
  const item = media.billboardMedia;
  useEffect(() => {
    dispatch(getGenralBillboard());
    dispatch(getAllTitles());
  }, [dispatch]);

  return (
    <section className={classes.browse}>
      <Head>
        <title>Netflix - Home</title>
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
export default Browse;

// export async function getServerSideProps() {
//   const tv = await getGeneralBillboard();

//   return {
//     props: {
//       billboardItem: JSON.stringify(tv),
//     },
//   };
// }
