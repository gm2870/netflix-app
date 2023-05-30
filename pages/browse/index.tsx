import classes from './index.module.scss';
import Head from 'next/head';
import Header from '../../src/components/Header/Header';
import SlidersContainer from '../../src/components/Slider/SlidersContainer';
import SliderLoader from '../../src/components/loader/SliderLoader';
import NoSsr from '@mui/base/NoSsr';
import Billboard from '../../src/components/Billboard/Billboard';
import { useGetTitlesWithGenreQuery } from '@/src/services/query/media';
import { useEffect, useState } from 'react';

const Browse = () => {
  const [loading, setLoading] = useState(true);
  const {
    data: genresWithTitles,
    isLoading,
    isFetching,
  } = useGetTitlesWithGenreQuery({ type: '', genreId: '' });
  useEffect(() => {
    const loading = isLoading || isFetching;
    setLoading(loading);
  }, [isLoading, isFetching]);
  return (
    <section className={classes.browse}>
      <Head>
        <title>Netflix - Home</title>
      </Head>
      <Header />
      <div id="modalContainer" className={classes.modalWrapper}></div>
      <div className={classes.content}>
        <Billboard />
        {genresWithTitles && (
          <SlidersContainer genresWithTitles={genresWithTitles} />
        )}
        {loading && (
          <NoSsr>
            <SliderLoader />
          </NoSsr>
        )}
      </div>
    </section>
  );
};
export default Browse;
