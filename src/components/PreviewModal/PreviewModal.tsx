import classes from './PreviewModal.module.scss';
import { useState } from 'react';
import { useRef } from 'react';
import { Fade } from '@mui/material';
import { Media } from '../../store/redux/media/model';
import MiniInfo from './MiniInfo/MiniInfo';
import Player from '../Player/Player';
import SoundButton from '../SoundButton/SoundButton';
import { useAppDispatch, useAppSelector } from '@/src/hooks';
import { mediaActions } from '@/src/store/redux/media/media';
import { uiActions } from '@/src/store/redux/ui/ui';
import { useAddTitleToMyListMutation } from '@/src/services/query/media';

type PreviewProps = {
  item: Media;
  hideModal: () => void;
  show: boolean;
  isMini?: boolean;
};

const PreviewModal = (props: PreviewProps) => {
  const [soundOn, setSoundOn] = useState(false);
  const dispatch = useAppDispatch();
  const cardRef = useRef<HTMLDivElement>(null);
  const myList = useAppSelector((state) => state.media.myListItems);
  const onHideModal = props.hideModal;
  const [addTitleToMyList, { data, isLoading, isSuccess, isError }] =
    useAddTitleToMyListMutation();
  const [playing, setPlaying] = useState(false);
  const toggleSoundHandler = () =>
    setSoundOn((soundIsOn: boolean) => !soundIsOn);
  const playStartHandler = (isPlaying: boolean) => setPlaying(isPlaying);

  const showDetailsPreviewHandler = () => {
    dispatch(uiActions.setBillnoardPlaying(false));
    dispatch(mediaActions.setDetailPreviewItem(props.item));
  };

  const addToMyListHandler = () => {
    addTitleToMyList({ id: props.item.id });
  };

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
          <div className={classes.soundBtn}>
            <SoundButton soundOn={soundOn} onToggle={toggleSoundHandler} />
          </div>
        )}
        <MiniInfo
          showDetailsPreviewHandler={showDetailsPreviewHandler}
          mediaType={props.item.media_type}
          id={props.item.id}
          addToMyList={addToMyListHandler}
          isInMyList={myList.includes(props.item.id)}
        />
      </div>
    </Fade>
  );
};
export default PreviewModal;
