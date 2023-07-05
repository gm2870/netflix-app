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
import TitleDetail from '@/src/components/TitleDetail/TitleDetail';
import { useAppDispatch, useAppSelector } from '@/src/hooks';
import { mediaActions } from '@/src/store/redux/media/media';
import ModalContainer from '../../src/components/ModalContainer/ModalContainer';
import { uiActions } from '@/src/store/redux/ui/ui';
import { GenreWithMedia } from '@/src/store/redux/media/model';
import { Genre } from '@/src/models/genre.model';

const Browse = () => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);
  const [titleId, setTitleId] = useState('');
  const [genres, setGenres] = useState<Genre[]>([]);

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
    if (genresWithTitles) {
      const genres = genresWithTitles.map((g) => ({
        title: g.name,
        id: g.id,
      }));
      setGenres(genres);
    }
  }, [genresWithTitles]);

  useEffect(() => {
    genresWithTitles;
    const loading = isLoading || isFetching;
    setLoading(loading);
  }, [isLoading, isFetching]);

  const closeDetailModalHandler = () => {
    dispatch(mediaActions.setDetailPreviewItem(null));
    dispatch(uiActions.toggleShowDetailModal());
  };

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

      {detailPreviewItem && (
        <ModalContainer
          onClose={closeDetailModalHandler}
          open={!!detailPreviewItem}
        >
          {detailPreviewItem && (
            <TitleDetail
              allItems={genresWithTitles || []}
              genres={genres}
              closeModal={closeDetailModalHandler}
              item={detailPreviewItem}
            />
          )}
        </ModalContainer>
      )}
    </section>
  );
};

export default Browse;
