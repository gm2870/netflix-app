import classes from './index.module.scss';
import Head from 'next/head';
import Header from '../../src/components/Header/Header';
import SlidersContainer from '../../src/components/Slider/SlidersContainer';
import SliderLoader from '../../src/components/loader/SliderLoader';
import NoSsr from '@mui/base/NoSsr';
import Billboard from '../../src/components/Billboard/Billboard';
import { useGetTitlesWithGenreQuery } from '@/src/services/query/media';
import { useEffect, useState } from 'react';
import { useAppSelector } from '@/src/hooks';

import DetailModal from '@/src/components/DetailModal/DetailModal';

const Browse = () => {
  const [loading, setLoading] = useState(true);

  const detailPreviewItem = useAppSelector(
    (state) => state.media.detailPreviewItem
  );
  const showDetailPreviewModal = useAppSelector(
    (state) => state.ui.showDetailModal
  );

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
    <section>
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
      <div>
        <Billboard />
        {genresWithTitles && (
          <SlidersContainer genresWithTitles={genresWithTitles} />
        )}
        {loading && (
          <div className="mt-10">
            <NoSsr>
              <SliderLoader />
            </NoSsr>
          </div>
        )}
      </div>

      {detailPreviewItem && <DetailModal genresWithTitles={genresWithTitles} />}
    </section>
  );
};

export default Browse;
