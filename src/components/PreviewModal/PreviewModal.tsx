import CircleButton from '../CircleButton/CircleButton';
import classes from './PreviewModal.module.scss';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { useEffect, useState } from 'react';
import { useRef } from 'react';
import { Fade } from '@mui/material';
import VideoJS from '../VideoJS/VideoJS';
import videojs from 'video.js';
import {
  getCropSize,
  resetCropSize,
} from '../../store/redux/media/media-actions';
import { uiActions } from '../../store/redux/ui/ui';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { Media } from '../../store/redux/media/model';
import { LightTooltip } from '../Tooltip/Tooltip';
import Image from 'next/image';

type PreviewProps = {
  item: Media;
  hideModal: () => void;
  show: boolean;
};
const PreviewModal = (props: PreviewProps) => {
  const dispatch = useAppDispatch();
  const playerRef = useRef<videojs.Player | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const videoContainer = useRef<HTMLDivElement>(null);

  const cropSize = useAppSelector((state) => state.media.cropSize);

  const [playing, setPlaying] = useState(false);

  const [imageOpacity, setImageOpacity] = useState(1);

  const [soundOn, setSoundOn] = useState(false);

  const videoJsOptions = {
    autoplay: true,
    muted: true,
    children: ['MediaLoader'],
    controls: false,
    componentName: 'card',
    sources: [
      {
        src: `http://localhost:8001/api/v1/media/video/${props.item.id}`,
        type: 'video/mp4',
      },
    ],
    cropSize,
  };

  useEffect(() => {
    // dispatch(getCropSize(props.item.id));
    return () => {
      // dispatch(resetCropSize());
      dispatch(uiActions.toggleBillnoardPlaying());
    };
  }, []);

  const toggleSound = () => {
    setSoundOn((prev) => {
      const ref = playerRef.current!;
      ref.muted(prev);
      return !prev;
    });
  };

  const handlePlayerReady = (player: videojs.Player) => {
    playerRef.current = player;
    player.on('play', () => {
      setImageOpacity(0);
      dispatch(uiActions.toggleBillnoardPlaying());
    });
    player.on('ended', () => setImageOpacity(1));
  };

  const onTrailerStart = () => {
    setPlaying(true);
  };

  const [showMiniModel, setShowMiniModal] = useState(false);
  const onLikeHover = () => setShowMiniModal(true);
  const onHideModal = props.hideModal;
  const onMiniModalMouseLeave = () => setShowMiniModal(false);
  const onTrailerStartPlaying = () => {
    const ref = playerRef.current!;
    ref.muted(false);
  };

  return (
    <Fade
      in={props.show}
      style={{ transitionDelay: props.show ? '500ms' : '0ms' }}
    >
      <div ref={cardRef} onMouseLeave={onHideModal} className={classes.card}>
        <div
          ref={imageRef}
          className={classes.imageContainer}
          style={{ opacity: imageOpacity }}
        >
          <Image
            onMouseEnter={onTrailerStart}
            className={classes.card__image}
            src={`https://image.tmdb.org/t/p/w1280${props.item.backdrop_path}`}
            alt="media image"
            width={400}
            height={250}
          />
        </div>
        {playing && (
          <div ref={videoContainer} className={classes.video}>
            <VideoJS
              controlBar={false}
              options={videoJsOptions}
              onReady={handlePlayerReady}
            />
            {!imageOpacity && (
              <div className={classes.soundBtn}>
                <CircleButton onClick={toggleSound}>
                  {!soundOn ? (
                    <img src="/images/volume-off.png" />
                  ) : (
                    <img src="/images/volume-on.png" />
                  )}
                </CircleButton>
              </div>
            )}
          </div>
        )}
        <div className={classes.preview}>
          <div className={classes.preview__info}>
            <div className={classes['preview__controls']}>
              <Fade
                in={showMiniModel}
                style={{ transitionDelay: props.show ? '300ms' : '0ms' }}
              >
                <div
                  onMouseLeave={onMiniModalMouseLeave}
                  className={`${classes['preview__mini-modal']}`}
                >
                  <LightTooltip placement="top" title="Not for me" arrow>
                    <button className={classes['preview__mini-modal-btn']}>
                      <img
                        className={classes['preview__mini-modal-img']}
                        src="/images/dislike.png"
                      />
                    </button>
                  </LightTooltip>
                  <LightTooltip placement="top" title="I like this" arrow>
                    <button className={classes['preview__mini-modal-btn']}>
                      <img
                        className={classes['preview__mini-modal-img']}
                        src="/images/like.png"
                      />
                    </button>
                  </LightTooltip>
                  <LightTooltip placement="top" title="Love this!" arrow>
                    <button className={classes['preview__mini-modal-btn']}>
                      <img
                        className={classes['preview__mini-modal-img']}
                        src="/images/love.png"
                      />
                    </button>
                  </LightTooltip>
                </div>
              </Fade>
              <div className={classes['preview__buttons--left']}>
                <CircleButton white>
                  <PlayArrowIcon
                    onClick={onTrailerStartPlaying}
                    className={`${classes.preview__icon} ${classes['preview__icon--black']}`}
                  />
                </CircleButton>
                <CircleButton>
                  <img className={classes.preview__img} src="/images/add.png" />
                </CircleButton>

                <CircleButton onMouseEnter={onLikeHover}>
                  <img
                    className={classes.preview__img}
                    src="/images/like.png"
                  />
                </CircleButton>
              </div>
              <div className={classes['preview__buttons--right']}>
                <CircleButton>
                  <img
                    className={classes.preview__img}
                    src="/images/arrow-down.png"
                  />
                </CircleButton>
              </div>
            </div>
            <div className={classes['preview__video-metadata']}>
              <span
                className={classes['preview__video-metadata-match-percentage']}
              >
                98% Match
              </span>
              <span className={classes['duration-text']}>2h 57m</span>
              <span className={classes['hd-text']}>HD</span>
            </div>
            <div className={classes['preview__evidence']}>
              <span className={classes['preview__evidence-item']}>
                Stand-Up
              </span>
              <span className={classes['preview__evidence-item']}>
                Social Commentary
              </span>
              <span className={classes['preview__evidence-item']}>Thai</span>
            </div>
          </div>
        </div>
      </div>
    </Fade>
  );
};
export default PreviewModal;
