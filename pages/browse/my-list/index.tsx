import GridList from '@/src/components/GridList/GridList';
import Header from '@/src/components/Header/Header';
import MediaItem from '@/src/components/MediaItem/MediaItem';
import SliderLoader from '@/src/components/loader/SliderLoader';
import useSliderConfig from '@/src/hooks/use-slider-config';
import { useGetMyListQuery } from '@/src/services/query/media';
import { Media } from '@/src/store/redux/media/model';
import Head from 'next/head';
import classes from './index.module.scss';
import { useAppSelector } from '@/src/hooks';

const MyList = () => {
  const { rowItems } = useSliderConfig();
  const myList: number[] = useAppSelector(state => state.media.myListItems);
  
  const { data = [], isLoading, isFetching } = useGetMyListQuery(undefined,{refetchOnMountOrArgChange:true});
  const list = data.filter(x => myList.includes(x.id));

  return (
    <>
      <Head>
        <title>Netflix - My list</title>
      </Head>
      <Header />
      <div className={classes.title}>My List</div>
      <div className="mt-10">
        <GridList>
          {list.map((t: Media, i: number) => (
            <MediaItem
              isFirst={i % rowItems === 0}
              isLast={(i + 1) % rowItems === 0}
              key={i}
              item={t}
            />
          ))}
        </GridList>

        {(isLoading || isFetching) && <SliderLoader />}
      </div>
    </>
  );
};

export default MyList;
