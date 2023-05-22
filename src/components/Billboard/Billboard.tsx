import { useEffect, useReducer } from 'react';
import { useRef } from 'react';
import CircleButton from '../../../src/components/CircleButton/CircleButton';
import VideoJS from '../../../src/components/VideoJS/VideoJS';
import videojs from 'video.js';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import classes from './Billboard.module.scss';
import CustomButton from '../../../src/components/CustomButton/CustomButton';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import Image from 'next/image';
import { useSpring, animated } from '@react-spring/web';
import { useRouter } from 'next/router';
import { NoSsr } from '@mui/material';
import SliderLoader from '../loader/SliderLoader';
import { useGetBillboardMediaQuery } from '../../services/query/media';

const initialPlayerState = {
  playing: false,
  showImage: true,
  animatingTitle: false,
  volumnOn: false,
  options: {
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
  },
};

const Billboard = () => {
  const router = useRouter();
  const playerRef = useRef<videojs.Player | null>(null);
  const reducer = (state: any, action: any) => {
    switch (action.type) {
      case 'play':
        playerRef?.current?.dispose();
        return {
          ...state,
          playing: true,
          showImage: false,
          animatingTitle: true,
          options: {
            ...state.options,
            sources: [
              {
                src: action.payload,
                type: 'video/mp4',
              },
            ],
          },
        };
      case 'togglePause':
        const paused = !state.playing;
        paused ? playerRef.current?.pause() : playerRef.current?.play();
        return {
          ...state,
          playing: paused,
        };
      case 'toggleVolumn':
        const vol = !state.volumnOn;
        playerRef.current?.muted(!vol);
        return {
          ...state,
          volumnOn: vol,
        };
      case 'end':
        return {
          ...state,
          playing: false,
          showImage: true,
          animatingTitle: false,
        };

      default:
        return state;
    }
  };
  const [player, setPlayer] = useReducer(reducer, initialPlayerState);

  const { x } = useSpring({
    from: { x: 0 },
    x: player.animatingTitle ? 1 : 0,
    delay: player.animatingTitle ? 3000 : 0,
    config: { duration: 1300 },
  });
  const type = (router.query.type_id as string) || '0';
  const { data: item, isLoading, isError } = useGetBillboardMediaQuery(type);

  useEffect(() => {
    if (item) {
      setPlayer({ type: 'play', payload: item.video_src.HD });
    }
  }, [item]);

  const handlePlayerReady = (player: videojs.Player) => {
    playerRef.current = player;

    player.on('ended', () => {
      setPlayer({ type: 'end' });
    });
  };

  const name = item?.name || item?.title;

  const reloadVideoHandler = () => {
    playerRef.current?.load();
    setPlayer({ type: 'play', payload: { src: item?.video_src.HD } });
  };
  const toggleSoundHandler = () => {
    setPlayer({ type: 'toggleVolumn' });
  };

  return (
    <section className={classes.billboardRow}>
      {!isLoading && (
        <div className={classes.billboard}>
          {player.showImage && (
            <div
              className={classes.imageWraper}
              style={{ opacity: player.playing ? 0 : 1 }}
            >
              {item?.backdrop_path && (
                <Image
                  alt="billboard image"
                  className={classes.billboard__image}
                  src={`https://image.tmdb.org/t/p/w1280${item.backdrop_path}`}
                  fill={true}
                />
              )}
            </div>
          )}
          <div className={classes.info}>
            <animated.div
              style={{
                scale: x.to({
                  range: [0, 1],
                  output: [1, 0.6],
                }),
                transformOrigin: 'bottom left',
              }}
              className={classes.info__fantcyTitle}
            >
              <img src={`/images/${name}.webp`} alt="title logo" />
            </animated.div>

            {!player.animatingTitle && (
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
            {player.playing ? (
              <CircleButton onClick={toggleSoundHandler}>
                <img
                  src={`/images/volume-${player.volumnOn ? 'on' : 'off'}.png`}
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

          {player.options.sources[0].src && (
            <div
              className={classes.videoContainer}
              style={{ opacity: player.playing ? 1 : 0 }}
            >
              <VideoJS
                controlBar={false}
                options={player.options}
                onReady={handlePlayerReady}
              />
            </div>
          )}
          <div>
            <div className={classes.billboard__gradient}></div>
          </div>
        </div>
      )}
      {isLoading && (
        <NoSsr>
          <div className={classes.loaderWrapper}>
            <SliderLoader></SliderLoader>
          </div>
        </NoSsr>
      )}
    </section>
  );
};
export default Billboard;
