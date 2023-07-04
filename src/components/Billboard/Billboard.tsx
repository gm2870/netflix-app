import { useEffect, useReducer, useState } from 'react';
import { useRef } from 'react';
import CircleButton from '../../../src/components/CircleButton/CircleButton';
import VideoJS from '../../../src/components/VideoJS/VideoJS';
import videojs from 'video.js';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import classes from './Billboard.module.scss';
import CustomButton from '../../../src/components/CustomButton/CustomButton';
import Image from 'next/image';
import { useSpring, animated } from '@react-spring/web';
import { useRouter } from 'next/router';
import { NoSsr } from '@mui/material';
import SliderLoader from '../loader/SliderLoader';
import {
  useGetBillboardMediaQuery,
  useGetCropSizeQuery,
} from '../../services/query/media';
import { useAppDispatch, useAppSelector } from '@/src/hooks';
import PlayButton from '../PlayButton/PlayButton';
import { mediaActions } from '@/src/store/redux/media/media';

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
    cropSize: 0,
  },
};

const Billboard = ({ onMoreInfoClick }: any) => {
  const router = useRouter();
  const playerRef = useRef<videojs.Player | null>(null);
  const billboardPlaying = useAppSelector(
    (state) => state.ui.billboardPlaying
  );

  const reducer = (state: any, action: any) => {
    switch (action.type) {
      case 'play':
        return {
          ...state,
          playing: true,
          showImage: false,
          animatingTitle: true,
          options: {
            ...state.options,
            sources: [
              {
                src: action.payload.src,
                type: 'video/mp4',
              },
            ],
            cropSize: action.payload.cropSize,
          },
        };
      case 'togglePause':
        const paused = !state.playing;
        return {
          ...state,
          playing: paused,
        };
        case 'toggleShowImage':
          const showImage = !state.showImage;
          return {
            ...state,
            showImage,
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
    delay: player.animatingTitle ? 5000 : 0,
    config: { duration: 1300 },
  });
  const type = (router.query.type_id as string) || '0';
  const { data: item, isLoading, isFetching } = useGetBillboardMediaQuery(type);
  const [itemId, setItemId] = useState(0);
  const [loading, setLoading] = useState(true);

  const { data: cropSize } = useGetCropSizeQuery(
    {
      type: type === '2' ? 'movie' : 'tv',
      id: itemId,
    },
    { skip: !itemId }
  );

  useEffect(() => {
    if (item) {
      setItemId(item.id);
      if (cropSize !== undefined) {
        setPlayer({
          type: 'play',
          payload: { src: item.video_src.HD, cropSize },
        });
      }
    }
  }, [item, cropSize]);

  const handlePlayerReady = (player: videojs.Player) => {
    playerRef.current = player;

    player.on('ended', () => {
      setPlayer({ type: 'end' });
    });
  };

  const name = item?.name || item?.title;

  const reloadVideoHandler = () => {
    setPlayer({ type: 'play', payload: { src: item?.video_src.HD } });
  };
  const toggleSoundHandler = () => {
    setPlayer({ type: 'toggleVolumn' });
  };
  useEffect(() => {

    if (!playerRef.current) {
      return;
    }

    if (billboardPlaying && playerRef.current.paused()) {
      playerRef.current.play();
      setPlayer({ type: 'play', payload: { src: item?.video_src.HD } });


    } else if (!billboardPlaying && !playerRef.current.paused()) {
      playerRef.current.pause();
    }
  }, [billboardPlaying]);
  const dispatch = useAppDispatch();
  useEffect(() => {
    const loading = isLoading || isFetching;
    setLoading(loading);
  }, [isLoading, isFetching]);
  const showDetailsHandler = () => {
    setPlayer({ type: 'togglePause' });
    setPlayer({ type: 'toggleShowImage' });
    console.log(item)
    dispatch(mediaActions.setDetailPreviewItem(item));
  }

  const opc = useSpring({
    from: { opacity: 1 },
    to: { opacity: 0 },
    delay: 5000,
  });
  return (
    <section className={classes.billboardRow}>
      {!loading && (
        <div className={classes.billboard}>
          {player.showImage && (
            <div className={classes.imageWraper}>
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

            <animated.div style={opc} className={classes.info__description}>
              {item?.overview}
            </animated.div>

            <div className={classes.info__actions}>
              
              <PlayButton />
              <CustomButton
                onClick={showDetailsHandler}
                variant="contained"
                className={classes.gray}
              >
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

          {(player.options.sources[0].src && player.playing) && (
            <div
              className={classes.videoContainer}
            >
              <VideoJS
                controlBar={false}
                options={player.options}
                onReady={handlePlayerReady}
              />
            </div>
          )}
          <div className={classes.billboard__gradient}></div>
        </div>
      )}
      {loading && (
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
