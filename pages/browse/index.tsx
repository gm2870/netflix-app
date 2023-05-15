import classes from './index.module.scss';
import { useEffect } from 'react';
import Head from 'next/head';
import Header from '../../src/components/Header/Header';
import SlidersContainer from '../../src/components/Slider/SlidersContainer';
import { useAppDispatch, useAppSelector } from '../../src/hooks';
import { getAllTitles } from '../../src/store/redux/media/media-actions';
import SliderLoader from '../../src/components/loader/SliderLoader';
import NoSsr from '@mui/base/NoSsr';
import Billboard from '../../src/components/Billboard/Billboard';

const Browse = () => {
  const dispatch = useAppDispatch();
  const media = useAppSelector((state) => state.media);
  const genresWithMedia = media.mediaItems;
  console.log(media);
  useEffect(() => {
    dispatch(getAllTitles());
  }, [dispatch]);

  return (
    <section className={classes.browse}>
      <Head>
        <title>Netflix - Home</title>
      </Head>
      <Header />
      <Billboard />
      {genresWithMedia.length && (
        <SlidersContainer genresWithTitles={genresWithMedia} />
      )}
      <NoSsr>{!genresWithMedia.length && <SliderLoader />}</NoSsr>
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
