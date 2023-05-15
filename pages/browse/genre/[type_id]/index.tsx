import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../src/hooks';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Header from '../../../../src/components/Header/Header';
import { getBillboardTitle } from '../../../../src/store/redux/media/media-actions';
import SlidersContainer from '../../../../src/components/Slider/SlidersContainer';
import SliderLoader from '../../../../src/components/loader/SliderLoader';
import { NoSsr } from '@mui/material';
import Billboard from '../../../../src/components/Billboard/Billboard';
import { useGetTitlesWithGenreQuery } from '@/src/services/query/media';

const Titles = () => {
  const router = useRouter();
  const type = router.query.type_id as string;

  const {
    data: genresWithTitles,
    isLoading,
    isError,
  } = useGetTitlesWithGenreQuery(type);

  return (
    <section>
      <Head>
        <title>Netflix - TV</title>
      </Head>
      <Header />
      <Billboard />
      {genresWithTitles && (
        <SlidersContainer genresWithTitles={genresWithTitles} />
      )}
      <NoSsr>{isLoading && <SliderLoader />}</NoSsr>
    </section>
  );
};

export default Titles;
