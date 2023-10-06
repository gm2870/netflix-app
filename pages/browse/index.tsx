import classes from './index.module.scss';
import Head from 'next/head';
import Header from '../../src/components/Header/Header';
import SlidersContainer from '../../src/components/Slider/SlidersContainer';
import SliderLoader from '../../src/components/loader/SliderLoader';
import NoSsr from '@mui/base/NoSsr';
import Billboard from '../../src/components/Billboard/Billboard';
import { useGetTitlesWithGenreQuery } from '@/src/services/query/media';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAppSelector } from '@/src/hooks';

import DetailModal from '@/src/components/DetailModal/DetailModal';

const Browse = () => {
  const [loading, setLoading] = useState(true);
  const [titleId, setTitleId] = useState('');

  const router = useRouter();
  const detailPreviewItem = useAppSelector(
    (state) => state.media.detailPreviewItem
  );
  const showDetailPreviewModal = useAppSelector(
    (state) => state.ui.showDetailModal
  );

  useEffect(() => {
    if (router.isReady && router.query.titleId) {
      setTitleId(router.query.titleId.toString());
    }
  }, [router.isReady, router.query.titleId]);

  const {
    data: genresWithTitles,
    isLoading,
    isFetching,
  } = useGetTitlesWithGenreQuery({ type: '', genreId: '' });


  useEffect(() => {
    genresWithTitles;
    const loading = isLoading || isFetching;
    setLoading(loading);
  }, [isLoading, isFetching]);

  return (
    <section className={classes.browse}>
      <Head>
        <title>Netflix - Home</title>
      </Head>
      <Header />
      <div
        id="modalContainer"
        className={`${classes.modalWrapper} ${
          showDetailPreviewModal ? classes.detailModal : classes.miniModal
        }`}
      ></div>
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

      {detailPreviewItem && <DetailModal  genresWithTitles={genresWithTitles} />}
    </section>
  );
};

export default Browse;
