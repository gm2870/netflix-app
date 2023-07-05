import { useRouter } from 'next/router';
import Head from 'next/head';
import Header from '../../../../src/components/Header/Header';
import SliderLoader from '../../../../src/components/loader/SliderLoader';
import { NoSsr } from '@mui/material';
import Billboard from '../../../../src/components/Billboard/Billboard';
import { useGetTitlesWithGenreQuery } from '@/src/services/query/media';
import classes from './index.module.scss';
import MediaItem from '@/src/components/MediaItem/MediaItem';
import GridList from '@/src/components/GridList/GridList';
import { GenreWithMedia, Media } from '@/src/store/redux/media/model';
import { useEffect, useState } from 'react';
import SlidersContainer from '@/src/components/Slider/SlidersContainer';
import Genres from '@/src/components/Header/Genres/Genres';
import useSliderConfig from '@/src/hooks/use-slider-config';
import { useAppDispatch, useAppSelector } from '@/src/hooks';
import { mediaActions } from '@/src/store/redux/media/media';
import TitleDetail from '@/src/components/TitleDetail/TitleDetail';
import ModalContainer from '@/src/components/ModalContainer/ModalContainer';
import { uiActions } from '@/src/store/redux/ui/ui';

const Titles = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const type = (router.query.type_id as string) || '1';
  const genreId = router.query.g as string;
  const [genresWithTitles, setGenresWithTitles] = useState<GenreWithMedia[]>(
    []
  );

  const detailPreviewItem = useAppSelector(
    (state) => state.media.detailPreviewItem
  );

  const [loading, setLoading] = useState(false);
  const { data, isLoading, isFetching } = useGetTitlesWithGenreQuery({
    type,
    genreId,
  });
  const headerGenres = genresWithTitles.map((g) => ({
    title: g.name,
    id: g.id,
  }));
  useEffect(() => {
    if (data) {
      setGenresWithTitles(data);
    }
  }, [data]);
  useEffect(() => {
    const l = isLoading || isFetching;
    setLoading(l);
  }, [isLoading, isFetching]);

  const { rowItems } = useSliderConfig();

  const closeDetailModalHandler = () => {
    dispatch(mediaActions.setDetailPreviewItem(null));
    dispatch(uiActions.toggleShowDetailModal());
  };

  return (
    <section>
      <Head>
        {type !== '2' ? (
          <title>Netflix - TV Shows</title>
        ) : (
          <title>Netflix - Movies</title>
        )}
      </Head>
      <Header />
      {!isLoading && (
        <div className={classes.subHeader}>
          <Genres genres={headerGenres} />
        </div>
      )}
      <Billboard />

      {!genreId && genresWithTitles && (
        <SlidersContainer genresWithTitles={genresWithTitles} />
      )}
      {!loading &&
        genreId &&
        (genresWithTitles.length ? (
          <GridList>
            {genresWithTitles[0].titles.map((t: Media, i: number) => (
              <MediaItem
                isFirst={i % rowItems === 0}
                isLast={(i + 1) % rowItems === 0}
                key={i}
                item={t}
              />
            ))}
          </GridList>
        ) : (
          <div style={{ textAlign: 'center', color: 'gray', fontSize: 18 }}>
            No matching results found.
          </div>
        ))}
      <NoSsr>{loading && <SliderLoader />}</NoSsr>
      {detailPreviewItem && (
        <ModalContainer
          onClose={closeDetailModalHandler}
          open={!!detailPreviewItem}
        >
          {detailPreviewItem && (
            <TitleDetail
              allItems={genresWithTitles}
              genres={headerGenres}
              closeModal={closeDetailModalHandler}
              item={detailPreviewItem}
            />
          )}
        </ModalContainer>
      )}
    </section>
  );
};

export default Titles;
