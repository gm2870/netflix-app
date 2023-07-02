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
import PreviewModal from '@/src/components/PreviewModal/PreviewModal';
import { Media } from '@/src/store/redux/media/model';

const Browse = () => {
  const [loading, setLoading] = useState(true);
  const [titleId, setTitleId] = useState('');
  const [item, setItem] = useState<Media>();
  const router = useRouter();

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
  const moreInfoClickHandler = (item: Media) => setItem(item);
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
      {item && (
        <PreviewModal
          item={item}
          show={true}
          hideModal={() => setItem(undefined)}
        />
      )}
    </section>
  );
};
export default Browse;
