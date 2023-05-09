import classes from './index.module.scss';
import { Fragment, useEffect } from 'react';
import Head from 'next/head';
import Billboard from './Billboard/Billboard';
import Header from '../../src/components/Header/Header';
// import { getAllTitles } from '../../api/controllers/media/mediaController.mjs';
import SlidersContainer from '../../src/components/Slider/SlidersContainer';
import { useAppDispatch, useAppSelector } from '../../src/hooks';
import { getAllTitles } from '../../src/store/redux/media/media-actions';
import Genre from '../../api/models/genreModel.mjs';
const browse = (props: any) => {
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
      <Fragment>
        {/* {items.length && <Billboard item={items[19]} />} */}
        <SlidersContainer genresWithTitles={genresWithMedia} />
      </Fragment>
    </section>
  );
};
export default browse;

export async function getServerSideProps() {
  const genres = await Genre.find();

  return {
    props: {
      genres: JSON.stringify(genres),
    },
  };
}
