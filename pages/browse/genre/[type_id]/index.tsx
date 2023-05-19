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
const Titles = () => {
  const router = useRouter();
  const type = router.query.type_id as string;
  const genreId = router.query.g as string;
  const [genresWithTitles, setGenresWithTitles] = useState<GenreWithMedia[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const { data, isLoading, isFetching, isError } = useGetTitlesWithGenreQuery({
    type,
    genreId,
  });
  const headerGenres = genresWithTitles.map((g) => ({
    name: g.name,
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

  return (
    <section>
      <Head>
        <title>Netflix - TV</title>
      </Head>
      <Header genres={headerGenres} />
      <Billboard />

      {!genreId && genresWithTitles && (
        <SlidersContainer genresWithTitles={genresWithTitles} />
      )}
      {!loading &&
        genreId &&
        (genresWithTitles.length ? (
          <GridList>
            {genresWithTitles[0].titles.map((t: Media, i: number) => (
              <MediaItem key={i} item={t} />
            ))}
          </GridList>
        ) : (
          <div style={{ textAlign: 'center', color: 'gray', fontSize: 18 }}>
            No matching results found.
          </div>
        ))}
      <NoSsr>{loading && <SliderLoader />}</NoSsr>
    </section>
  );
};

export default Titles;
