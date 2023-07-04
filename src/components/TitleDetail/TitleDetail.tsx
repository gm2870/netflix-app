import { Media } from '@/src/store/redux/media/model';
import Player from '../Player/Player';
import TitleCard from '../TitleCard/TitleCard';
import { useState } from 'react';
import { useGetSeasonDetailsQuery, useGetTitleDetailsQuery } from '@/src/services/query/media';
import classes from './TitleDetail.module.scss';
import SoundButton from '../SoundButton/SoundButton';
import PlayButton from '../PlayButton/PlayButton';
import CircleButton from '../CircleButton/CircleButton';
import CloseIcon from '@mui/icons-material/Close';

type DetailInfoProps = {
  item: Media,
  closeModal: () => void
}
const TitleDetail = ({ item,closeModal }: DetailInfoProps) => {
  const [soundOn, setSoundOn] = useState(false);
  const [seasonNumber, setSeasonNumber] = useState(1);

  const {data: titleDetails, isLoading} = useGetTitleDetailsQuery({
    id:item.id,
    type:item.media_type
  });
  const {data: seasonDetails} = useGetSeasonDetailsQuery({
    id:item.id,
    seasonNumber
  },{
    skip: !item.id
  });
  console.log(seasonDetails)

  const soundToggleHandler = () => setSoundOn((prev) => !prev);

  const playStartHandler = () => {};

  return (
    <div className={classes.container}>
      <Player  backdrop_path={item.backdrop_path}
          video_src={item.video_src}
          id={item.id}
          soundOn={soundOn}
          media_type={item.media_type}
          playing={playStartHandler} />
       <button className={classes.closeBtn} onClick={closeModal}>
        <CloseIcon />
       </button>
        <div className={classes.action}>
          <div className={classes.action__buttons}>
            <PlayButton />
            <CircleButton>
              <img className={classes.preview__img} src="/images/add.png" />
            </CircleButton>

            <CircleButton>
              <img
                className={classes.preview__img}
                src="/images/like.png"
              />
            </CircleButton>
          </div>
          <div>
          <SoundButton soundOn={soundOn} onToggle={soundToggleHandler} />
          </div>
        </div>
        <div className={classes.gradient}></div>
      <div className={classes.info}>
        <div className={classes.info__header}>
          <div className={classes.overview}>
            <span >
              {item.vote_average.toFixed(1)}
            </span>
            <span> / 10</span>
          <p className={classes.overview__text}>{item.overview}</p>
          </div>
          <div>
          <div className={classes.cast}>
            <span className={classes.info__text}>Cast: </span>
            {seasonDetails?.episodes[0].guest_stars.slice(0,3).map(star => <span>{star.name}, </span>)}
            <span>more</span>
          </div>
          <div className={classes.genres}>
            <span className={classes.info__text}>Genres: </span>
            {/* {item.genres.map((genre) => <span key={genre.id}>{genre.name}</span>)} */}
          </div>
        </div>
        </div>

        <h2>Episodes</h2>
      {(!isLoading && seasonDetails) && seasonDetails.episodes.map((episode,i) => <TitleCard 
      key={episode.id}
      episodeNumber={i+1} 
      still_path={episode.still_path} 
      runtime={episode.runtime}
      name={episode.name}
      overview={episode.overview} />
      ) }
      </div>

    </div>
  );
};

export default TitleDetail;
