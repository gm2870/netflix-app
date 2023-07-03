import classes from './PreviewModal.module.scss';
import { useState } from 'react';
import { useRef } from 'react';
import { Fade } from '@mui/material';
import { Media } from '../../store/redux/media/model';
import MiniInfo from './MiniInfo/MiniInfo';
import TitleDetail from '../TitleDetail/TitleDetail';
import Player from '../Player/Player';
import SoundButton from '../SoundButton/SoundButton';

type PreviewProps = {
  item: Media;
  hideModal: () => void;
  show: boolean;
  isMini?:boolean
};
const PreviewModal = (props: PreviewProps) => {
  const [soundOn, setSoundOn] = useState(false);

  const cardRef = useRef<HTMLDivElement>(null);

  const onHideModal = props.hideModal;

  const [playing, setPlaying] = useState(false);
  const toggleSoundHandler = () =>
    setSoundOn((soundIsOn: boolean) => !soundIsOn);
  const playStartHandler = (isPlaying: boolean) => setPlaying(isPlaying)
  return (
    <Fade
      in={props.show}
      style={{ transitionDelay: props.show ? '500ms' : '0ms' }}
    >
      <div ref={cardRef} onMouseLeave={onHideModal} className={classes.card}>
        <Player
          backdrop_path={props.item.backdrop_path}
          video_src={props.item.video_src}
          id={props.item.id}
          soundOn={soundOn}
          media_type={props.item.media_type}
          playing={playStartHandler}
        />
        {playing && (
            <SoundButton soundOn={soundOn} onToggle={toggleSoundHandler}  />
        )}
        <MiniInfo mediaType={props.item.media_type} id={props.item.id} />
      </div>
    </Fade>
  );
};
export default PreviewModal;
