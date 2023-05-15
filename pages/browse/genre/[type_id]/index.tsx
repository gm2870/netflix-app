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

const Titles = () => {
  const media = useAppSelector((state) => state.media);
  const genresWithMedia = media.mediaItems;

  return (
    <section>
      <Head>
        <title>Netflix - TV</title>
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

export default Titles;
