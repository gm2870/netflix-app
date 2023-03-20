import { useEffect } from 'react';
import { useState } from 'react';
import { useRef } from 'react';
import CircleButton from '../../../src/components/CircleButton/CircleButton';
import VideoJS from '../../../src/components/VideoJS/VideoJS';
import videojs from 'video.js';

import classes from './Billboard.module.scss';
import { Media } from '../../../src/store/redux/media/model';
import { useAppSelector } from '../../../src/hooks';

const Billboard = ({ item }: { item: Media }) => {
  const playerRef = useRef<videojs.Player>(null);
  const [playing, setPlaying] = useState(true);
  const [volume, setVolume] = useState(false);
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
    // playerRef.current = player;

    player.on('ended', () => {
      setPlaying(false);
    });
  };

  const reloadVideoHandler = () => {
    playerRef.current?.load();
    setPlaying(true);
  };
  const toggleSoundHandler = () =>
    setVolume((prev) => {
      playerRef.current?.muted(prev);
      return !prev;
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
      playerRef.current?.play();
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
            <img
              className={classes.billboard__image}
              src={`http://localhost:8001/api/v1/media/image/${item.id}`}
            />
          </div>
        )}
        <div className={classes.actions}>
          {playing ? (
            <CircleButton onClick={toggleSoundHandler}>
              <img src={`/images/volume-${volume ? 'on' : 'off'}.png`} />
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
