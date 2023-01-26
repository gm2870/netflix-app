import { useEffect, useRef } from 'react';
import videojs from 'video.js';
import classes from './VideoJS.module.scss';

export const VideoJS = (props) => {
  const videoRef = useRef();
  const playerRef = useRef();

  const { options, onReady } = props;

  useEffect(() => {
    // Make sure Video.js player is only initialized once
    if (!playerRef.current && videoRef.current) {
      const player = videojs(videoRef.current, options, () => {
        console.log('options.cropSize', options.cropSize);
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
          if (cropSize > 50) cropSize = 50;
          videoRef.current.style.top = `-${cropSize + 2}px`;
          videoRef.current.style.height = `calc(100% + ${cropSize * 2}px)`;
        }
        onReady && onReady(player);
      });

      player.on('mouseenter', function () {
        player.userActive(false);
      });

      // You could update an existing player in the `else` block here
      // on prop change, for example:
    }
  }, [options, videoRef]);

  useEffect(() => {
    const player = playerRef.current;

    return () => {
      if (player && !player.isDisposed()) {
        player.dispose();
        playerRef.current = null;
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
