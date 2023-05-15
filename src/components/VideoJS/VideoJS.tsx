import { useEffect, useRef } from 'react';
import videojs from 'video.js';
import classes from './VideoJS.module.scss';

export const VideoJS = (props: any) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<videojs.Player>(null);
  const { options, onReady } = props;
  useEffect(() => {
    // +++  Determine the available player IDs +++//
    if (playerRef.current && !options.sources[0].src) {
      playerRef.current.dispose();
    }
    // Make sure Video.js player is only initialized once
    if (!playerRef.current && videoRef.current) {
      const player = videojs(videoRef.current, options, () => {
        if (!options.controls) {
          videoRef.current?.classList.add('vjs-controls-disabled');
          const nodeList = document.querySelectorAll('.vjs-control');
          for (const iterator of nodeList) {
            iterator.remove();
          }
        }
        videoRef.current?.classList.add(
          classes[`vjs-${options.componentName}`]
        );
        if (options.cropSize) {
          let cropSize = +options.cropSize;

          if (cropSize == 64 || cropSize === 40) {
            cropSize = 47;
          } else if (cropSize === 32) {
            cropSize = 19;
          } else if (cropSize > 50) {
            cropSize = +options.cropSize - Math.ceil(+options.cropSize / 3);
          } else if (cropSize < 10) {
            cropSize = 0;
          }
          const vid = videoRef.current!;
          vid.style.top = `-${cropSize}px`;
          vid.style.height = `calc(100% + ${cropSize * 2}px)`;
        }
        onReady && onReady(player);
      });

      player.on('mouseenter', function () {
        player.userActive(false);
      });
    }
  }, [options, videoRef]);

  useEffect(() => {
    // var setPlayer = Object.keys(videojs.players);
    const player = playerRef.current;

    return () => {
      if (player && !player.isDisposed()) {
        player.dispose();
      }
    };
  }, [playerRef]);

  return (
    <div data-vjs-player>
      <video ref={videoRef} className={`vjs-16-9 ${classes.videojsref}`} />
    </div>
  );
};
export default VideoJS;
