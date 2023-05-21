import classes from './index.module.scss';
import Head from 'next/head';
import Header from '../../src/components/Header/Header';
import SlidersContainer from '../../src/components/Slider/SlidersContainer';
import SliderLoader from '../../src/components/loader/SliderLoader';
import NoSsr from '@mui/base/NoSsr';
import Billboard from '../../src/components/Billboard/Billboard';
import { useGetTitlesWithGenreQuery } from '@/src/services/query/media';

const Browse = () => {
  const {
    data: genresWithTitles,
    isLoading,
    isError,
  } = useGetTitlesWithGenreQuery({ type: '', genreId: '' });

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
        <NoSsr>{isLoading && <SliderLoader />}</NoSsr>
      </div>
    </section>
  );
};
export default Browse;
