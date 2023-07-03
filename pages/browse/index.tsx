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
import { Media } from '@/src/store/redux/media/model';
import { Modal } from '@mui/material';
import Box from '@mui/material/Box';

import TitleDetail from '@/src/components/TitleDetail/TitleDetail';
import { useAppDispatch } from '@/src/hooks';
import { uiActions } from '@/src/store/redux/ui/ui';
const detailModalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 850,
  height: 850,
  bgcolor: 'transparent',
  boxShadow: 24,
  borderRadius:2,
  overflow:'hidden'
}
const Browse = () => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);
  const [titleId, setTitleId] = useState('');
  const [item, setItem] = useState<Media>();
  const router = useRouter();
  const [showMoreInfo,setShowMoreInfo] = useState(false);

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
    const loading = isLoading || isFetching;
    setLoading(loading);
  }, [isLoading, isFetching]);
  const moreInfoClickHandler = (item: Media) => {
    setItem(item);
    setShowMoreInfo(true);
    dispatch(uiActions.setBillnoardPlaying(false))
  };
  const closeDetailModalHandler = () => {
    setShowMoreInfo(false);
    console.log(uiActions)
    dispatch(uiActions.setBillnoardPlaying(true))
  }
  return (
    <section className={classes.browse}>
      <Head>
        <title>Netflix - Home</title>
      </Head>
      <Header />
      <div id="modalContainer" className={classes.modalWrapper}></div>
      <div className={classes.content}>
        <Billboard onMoreInfoClick={moreInfoClickHandler} />
        {genresWithTitles && (
          <SlidersContainer genresWithTitles={genresWithTitles} />
        )}
        {loading && (
          <NoSsr>
            <SliderLoader />
          </NoSsr>
        )}
      </div>
      {(showMoreInfo && item) && (
        <Modal onClose={closeDetailModalHandler} open={showMoreInfo}>
          <Box sx={detailModalStyle}>
            <TitleDetail item={item} />
          </Box>
        </Modal>
        )}
    </section>
  );
};
export default Browse;
