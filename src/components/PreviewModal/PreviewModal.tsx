import classes from './PreviewModal.module.scss';
import { useEffect, useState } from 'react';
import { useRef } from 'react';
import { Fade } from '@mui/material';
import { Media } from '../../store/redux/media/model';
import MiniInfo from './MiniInfo/MiniInfo';
import Player from '../Player/Player';
import SoundButton from '../SoundButton/SoundButton';
import { useAppDispatch, useAppSelector } from '@/src/hooks';
import { mediaActions } from '@/src/store/redux/media/media';
import { uiActions } from '@/src/store/redux/ui/ui';
import {
  useAddTitleToMyListMutation,
  useRemoveTitleFromMyListMutation,
} from '@/src/services/query/media';
import { setMyListToStorage } from '@/src/services/storage/storage';

type PreviewProps = {
  item: Media;
  hideModal: () => void;
  show: boolean;
  isMini?: boolean;
};

const PreviewModal = (props: PreviewProps) => {
  const [soundOn, setSoundOn] = useState(false);
  const [isInMyList, setIsInMyList] = useState(false);
  const [playing, setPlaying] = useState(false);

  const dispatch = useAppDispatch();
  const cardRef = useRef<HTMLDivElement>(null);

  const myListItems: number[] = useAppSelector(
    (state) => state.media.myListItems
  );
  const onHideModal = props.hideModal;
  const [addTitleToMyList, { data: myListIds, isSuccess: addedToMyList }] =
    useAddTitleToMyListMutation();

  const [
    removeTitleFromMyList,
    { data: updatedListIds, isSuccess: successDeleteFromMyList },
  ] = useRemoveTitleFromMyListMutation();
  const toggleSoundHandler = () =>
    setSoundOn((soundIsOn: boolean) => !soundIsOn);
  const playStartHandler = (isPlaying: boolean) => setPlaying(isPlaying);

  const showDetailsPreviewHandler = () => {
    dispatch(uiActions.setBillnoardPlaying(false));
    dispatch(mediaActions.setDetailPreviewItem(props.item));
  };

  const toggleAddToMyListHandler = () => {
    const isInList = myListItems.includes(props.item.id);
    if (isInList) {
      removeTitleFromMyList({ id: props.item.id });
    } else {
      addTitleToMyList({ id: props.item.id });
    }
  };
  useEffect(() => {
    setIsInMyList(myListItems.includes(props.item.id));
  }, [myListItems, setIsInMyList, props.item.id]);
  useEffect(() => {
    if (myListIds) {
      dispatch(mediaActions.setMyListItems(myListIds));
      setMyListToStorage(myListIds);
    }
  }, [dispatch, myListIds, addedToMyList]);

  useEffect(() => {
    if (updatedListIds) {
      dispatch(mediaActions.setMyListItems(updatedListIds));
      setMyListToStorage(updatedListIds);
    }
  }, [
    dispatch,
    myListItems,
    props.item.id,
    successDeleteFromMyList,
    updatedListIds,
  ]);

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
          toggleAddToMyList={toggleAddToMyListHandler}
          isInMyList={isInMyList}
        />
      </div>
    </Fade>
  );
};
export default PreviewModal;
