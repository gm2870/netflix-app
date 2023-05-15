import { useEffect } from 'react';
import { useState } from 'react';
import { useRef } from 'react';
import CircleButton from '../../../src/components/CircleButton/CircleButton';
import VideoJS from '../../../src/components/VideoJS/VideoJS';
import videojs from 'video.js';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import classes from './Billboard.module.scss';
import { useAppSelector } from '../../../src/hooks';
import CustomButton from '../../../src/components/CustomButton/CustomButton';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import Image from 'next/image';
import { useSpring, animated } from '@react-spring/web';
import { useRouter } from 'next/router';
import { NoSsr } from '@mui/material';
import SliderLoader from '../loader/SliderLoader';
import { useGetBillboardMediaQuery } from '../../services/query/media';

const Billboard = () => {
  const router = useRouter();
  const playerRef = useRef<videojs.Player | null>(null);
  const [playing, setPlaying] = useState<boolean>(true);
  const [animatingTitle, toggleAnimatingTitle] = useState(false);
  const [toggleVolumeOn, setToggleVolumeOn] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  const [videoOptions, setVideoOptions] = useState({
    autoplay: true,
    muted: true,
    children: ['MediaLoader'],
    controls: false,
    componentName: 'billboard',
    sources: [
      {
        src: '',
        type: 'video/mp4',
      },
    ],
  });

  const { x } = useSpring({
    from: { x: 0 },
    x: animatingTitle ? 1 : 0,
    delay: animatingTitle ? 5000 : 0,
    config: { duration: 1300 },
  });
  const type = (router.query.type_id as string) || '0';
  const {
    data: item,
    isLoading,
    isError,
  } = useGetBillboardMediaQuery(type, { skip: loading });

  useEffect(() => {
    if (item) {
      setLoading(false);
      setVideoOptions({
        autoplay: true,
        muted: true,
        children: ['MediaLoader'],
        controls: false,
        componentName: 'billboard',
        sources: [
          {
            src: item.video_src.HD,
            type: 'video/mp4',
          },
        ],
      });
    }
    return () => {
      playerRef.current?.dispose();
    };
  }, [item]);

  const handleToggle = () => {
    setPlaying(!playing);
    toggleAnimatingTitle(!animatingTitle);
  };

  const handlePlayerReady = (player: videojs.Player) => {
    playerRef.current = player;

    player.on('ended', () => {
      setPlaying(false);
      handleToggle();
    });
  };

  const shouldPlay = useAppSelector((state) => state.ui.billboardPlaying);
  const name = item?.name || item?.title;

  const reloadVideoHandler = () => {
    playerRef.current?.load();
    setPlaying(true);
    toggleAnimatingTitle(!animatingTitle);
  };
  const toggleSoundHandler = () => {
    setToggleVolumeOn((volOn) => {
      playerRef.current?.muted(volOn);
      return !volOn;
    });
  };

  const handleScroll = () => {
    if (!playerRef?.current) return;
    if (
      window.scrollY > 600 &&
      playerRef.current &&
      !playerRef.current.paused()
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
      playerRef.current?.play();
      toggleAnimatingTitle(!animatingTitle);
    }
  }, [shouldPlay]);

  return (
    <section className={classes.billboardRow}>
      {!isLoading && (
        <div className={classes.billboard}>
          {!playing && (
            <div
              className={classes.imageWraper}
              style={{ opacity: playing ? 0 : 1 }}
            >
              <Image
                alt="billboard image"
                className={classes.billboard__image}
                src={`https://image.tmdb.org/t/p/w1280${item?.backdrop_path}`}
                fill={true}
              />
            </div>
          )}
          <div className={classes.info}>
            <animated.div
              style={{
                scale: x.to({
                  range: [0, 1],
                  output: [1, 0.6],
                }),
              }}
              className={classes.info__fantcyTitle}
            >
              <img src={`/images/${name}.webp`} alt="title logo" />
            </animated.div>

            {!animatingTitle && (
              <div className={classes.info__description}>{item?.overview}</div>
            )}
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

          {videoOptions.sources[0].src && (
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
          )}
          <div>
            <div className={classes.billboard__gradient}></div>
          </div>
        </div>
      )}
      {(isLoading || loading) && (
        <NoSsr>
          <div>
            <SliderLoader></SliderLoader>
          </div>
        </NoSsr>
      )}
    </section>
  );
};
export default Billboard;
