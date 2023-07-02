import { useEffect, useRef, useState } from 'react';
import VideoJS from '../VideoJS/VideoJS';
import classes from './Player.module.scss';
import Image from 'next/image';
import { uiActions } from '@/src/store/redux/ui/ui';
import { useAppDispatch } from '@/src/hooks';
import videojs from 'video.js';

const Player = ({
  cropSize,
  video_src,
  backdrop_path,
  soundOn,
}: {
  cropSize: number;
  video_src: any;
  backdrop_path: string;
  soundOn: boolean;
}) => {
  const [imageOpacity, setImageOpacity] = useState(1);
  const dispatch = useAppDispatch();
  const playerRef = useRef<videojs.Player | null>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  const [options, setOptions] = useState({
    autoplay: true,
    muted: true,
    children: ['MediaLoader'],
    controls: false,
    componentName: 'card',
    loop: true,
    sources: [
      {
        src: '',
        type: 'video/mp4',
      },
    ],
    cropSize: 0,
  });

  useEffect(() => {
    if (cropSize !== undefined) {
      setOptions({
        autoplay: true,
        muted: true,
        children: ['MediaLoader'],
        controls: false,
        componentName: 'card',
        loop: true,
        sources: [
          {
            src: `${video_src.SD}`,
            type: 'video/mp4',
          },
        ],
        cropSize,
      });
      setImageOpacity(0);
      dispatch(uiActions.setBillnoardPlaying(false));
    }
  }, [cropSize, video_src]);

  useEffect(() => {
    const ref = playerRef.current;
    ref?.muted(!soundOn);
  }, [soundOn]);

  const handlePlayerReady = (player: videojs.Player) => {
    playerRef.current = player;

    player.on('ended', () => {
      dispatch(uiActions.setBillnoardPlaying(true));
    });
  };
  const videoContainer = useRef<HTMLDivElement>(null);

  return (
    <>
      <div
        ref={imageRef}
        className={classes.imageContainer}
        style={{ opacity: imageOpacity }}
      >
        <Image
          className={classes.image}
          src={`https://image.tmdb.org/t/p/w1280${backdrop_path}`}
          alt="media image"
          fill={true}
        />
      </div>
      {options.sources[0].src && (
        <div ref={videoContainer} className={classes.video}>
          <VideoJS
            controlBar={false}
            options={options}
            onReady={handlePlayerReady}
          />
        </div>
      )}
    </>
  );
};

export default Player;
