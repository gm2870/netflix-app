import { Media } from '@/src/store/redux/media/model';
import Player from '../Player/Player';
import TitleCard from '../TitleCard/TitleCard';
import { useState } from 'react';
import { useGetTitleDetailsQuery } from '@/src/services/query/media';
import classes from './TitleDetail.module.scss';
import SoundButton from '../SoundButton/SoundButton';
import PlayButton from '../PlayButton/PlayButton';
import CircleButton from '../CircleButton/CircleButton';
import CloseIcon from '@mui/icons-material/Close';

type DetailInfoProps = {
  item: Media
}
const TitleDetail = ({ item }: DetailInfoProps) => {
  const [soundOn, setSoundOn] = useState(false);
  const {data: titleDetails, isLoading} = useGetTitleDetailsQuery({
    id:item.id,
    type:item.media_type
  });
  console.log(item);
  const soundToggleHandler = () => setSoundOn((prev) => !prev);

  const playStartHandler = () => {}
  return (
    <div className={classes.container}>
        detail of title
      <Player  backdrop_path={item.backdrop_path}
          video_src={item.video_src}
          id={item.id}
          soundOn={soundOn}
          media_type={item.media_type}
          playing={playStartHandler} />
       <button className={classes.closeBtn}>
        <CloseIcon />
       </button>
        <div className={classes.action}>
          <SoundButton soundOn={soundOn} onToggle={soundToggleHandler} />
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
        </div>

      {/* {(!isLoading && titleDetails) && <TitleCard {...titleDetails} /> } */}
    </div>
  );
};

export default TitleDetail;
