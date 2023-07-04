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
import { Dialog, DialogContent, styled } from '@mui/material';
import TitleDetail from '@/src/components/TitleDetail/TitleDetail';
import { useAppDispatch, useAppSelector } from '@/src/hooks';
import { mediaActions } from '@/src/store/redux/media/media';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: 0,
    backgroundColor:'transparent',
  },
}));

const Browse = () => {

  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);
  const [titleId, setTitleId] = useState('');

  const router = useRouter();
  const detailPreviewItem = useAppSelector(state => state.media.detailPreviewItem);
 
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

  const closeDetailModalHandler = () => {
    dispatch(mediaActions.setDetailPreviewItem(null))
  }

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
      {(detailPreviewItem) && (
        <BootstrapDialog   sx={{
          "& .MuiDialog-container": {
            "& .MuiPaper-root": {
              width: "100%",
              maxWidth: "850px",
            },
          },
        }} scroll='body' onClose={closeDetailModalHandler} open={!!detailPreviewItem}>
          <DialogContent>
            <TitleDetail closeModal={closeDetailModalHandler} item={detailPreviewItem} />
          </DialogContent>
        </BootstrapDialog>
        )}
    </section>
  );
};

export default Browse;
