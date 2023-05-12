import { useEffect } from 'react';
import { useState } from 'react';
import { useRef } from 'react';
import CircleButton from '../../../src/components/CircleButton/CircleButton';
import VideoJS from '../../../src/components/VideoJS/VideoJS';
import videojs from 'video.js';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import classes from './Billboard.module.scss';
import { Media } from '../../../src/store/redux/media/model';
import { useAppSelector } from '../../../src/hooks';
import CustomButton from '../../../src/components/CustomButton/CustomButton';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import Image from 'next/image';

const Billboard = ({ item }: { item: Media }) => {
  const playerRef = useRef<videojs.Player | null>(null);
  const [playing, setPlaying] = useState<boolean>(false);
  const [toggleVolumeOn, setToggleVolumeOn] = useState<boolean>(false);
  const shouldPlay = useAppSelector((state) => state.ui.billboardPlaying);

  const videoOptions = {
    autoplay: true,
    muted: true,
    children: ['MediaLoader'],
    controls: false,
    componentName: 'billboard',
    sources: [
      {
        src: `http://localhost:8001/api/v1/media/video/${item.id}`,
        type: 'video/mp4',
      },
    ],
  };

  const handlePlayerReady = (player: videojs.Player) => {
    playerRef.current = player;

    player.on('ended', () => {
      setPlaying(false);
    });
  };

  const reloadVideoHandler = () => {
    playerRef.current?.load();
    setPlaying(true);
  };
  const toggleSoundHandler = () =>
    setToggleVolumeOn((volOn) => {
      playerRef.current?.muted(volOn);
      return !volOn;
    });

  const handleScroll = () => {
    if (
      window.scrollY > 600 &&
      playerRef.current &&
      !playerRef.current?.paused()
    ) {
      playerRef.current?.pause();
    } else {
      playerRef.current?.play();
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
  }, []);
  useEffect(() => {
    if (!shouldPlay) {
      playerRef.current?.pause();
    } else {
      // playerRef.current?.play();
    }
  }, [shouldPlay]);

  return (
    <section className={classes.billboardRow}>
      <div className={classes.billboard}>
        {!playing && (
          <div
            className={classes.imageWraper}
            style={{ opacity: playing ? 0 : 1 }}
          >
            <Image
              alt="billboard image"
              className={classes.billboard__image}
              src={`https://image.tmdb.org/t/p/w1280${item.backdrop_path}`}
              width={1500}
              height={1000}
            />
          </div>
        )}
        <div className={classes.info}>
          <div className={classes.info__fantcyTitle}>
            <img src="/images/money-heist.webp" alt="title logo" />
          </div>
          <div className={classes.info__description}>{item.overview}</div>
          <div className={classes.info__actions}>
            <CustomButton
              variant="contained"
              white={true}
              className={classes.colorPrimary}
            >
              <PlayArrowIcon
                className={`${classes.info__icon} ${classes['info__icon--black']}`}
              />
              <span className={classes.info__text}>Play</span>
            </CustomButton>
            <CustomButton variant="contained" className={classes.gray}>
              <ErrorOutlineIcon
                className={`${classes.info__icon} ${classes['info__icon--black']}`}
              />
              <span className={classes.info__text}>More Info</span>
            </CustomButton>
          </div>
        </div>
        <div className={classes.actions}>
          {playing ? (
            <CircleButton onClick={toggleSoundHandler}>
              <img
                src={`/images/volume-${toggleVolumeOn ? 'on' : 'off'}.png`}
              />
            </CircleButton>
          ) : (
            <CircleButton onClick={reloadVideoHandler}>
              <img src="/images/reload-icon.svg" />
            </CircleButton>
          )}
          <div className={classes.actions__maturity}>
            <span className={classes.actions__maturityRating}>16</span>
          </div>
        </div>
        <div
          className={classes.videoContainer}
          style={{ opacity: playing ? 1 : 0 }}
        >
          <VideoJS
            controlBar={false}
            options={videoOptions}
            onReady={handlePlayerReady}
          />
        </div>
        <div>
          <div className={classes.billboard__gradient}></div>
        </div>
      </div>
    </section>
  );
};
export default Billboard;
