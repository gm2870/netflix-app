import classes from './PreviewModal.module.scss';
import { useState } from 'react';
import { useRef } from 'react';
import { Fade } from '@mui/material';
import { Media } from '../../store/redux/media/model';
import { useGetCropSizeQuery } from '@/src/services/query/media';
import MiniInfo from './MiniInfo/MiniInfo';
import DetailInfo from './DetailInfo/DetailInfo';
import Player from '../Player/Player';
import CircleButton from '../CircleButton/CircleButton';

type PreviewProps = {
  item: Media;
  hideModal: () => void;
  show: boolean;
};
const PreviewModal = (props: PreviewProps) => {
  const [soundOn, setSoundOn] = useState(false);

  const cardRef = useRef<HTMLDivElement>(null);

  const { data: cropSize } = useGetCropSizeQuery({
    type: props.item.media_type,
    id: props.item.id,
  });

  const onHideModal = props.hideModal;

  // const onTrailerStartPlaying = () => {
  //   const ref = playerRef.current!;
  //   ref.muted(false);
  // };

  const toggleSoundHandler = () =>
    setSoundOn((soundIsOn: boolean) => !soundIsOn);
  return (
    <Fade
      in={props.show}
      style={{ transitionDelay: props.show ? '500ms' : '0ms' }}
    >
      <div ref={cardRef} onMouseLeave={onHideModal} className={classes.card}>
        <Player
          backdrop_path={props.item.backdrop_path}
          video_src={props.item.video_src}
          cropSize={cropSize || 0}
          soundOn={soundOn}
        />
        {cropSize && (
          <div className={classes.soundBtn}>
            <CircleButton onClick={toggleSoundHandler}>
              {!soundOn ? (
                <img src="/images/volume-off.png" />
              ) : (
                <img src="/images/volume-on.png" />
              )}
            </CircleButton>
          </div>
        )}
        <MiniInfo mediaType={props.item.media_type} id={props.item.id} />
        <DetailInfo id={props.item.id} />
      </div>
    </Fade>
  );
};
export default PreviewModal;
