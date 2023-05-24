import { useEffect, useRef } from 'react';
import videojs from 'video.js';
import classes from './VideoJS.module.scss';

export const VideoJS = (props: any) => {
  const videoRef = useRef<any>(null);
  const playerRef = useRef<videojs.Player>(null);
  const { options, onReady } = props;
  useEffect(() => {
    if (!playerRef.current) {
      const videoElement = document.createElement('video-js');
      videoElement.classList.add('vjs-big-play-centered');
      videoRef.current.appendChild(videoElement);

      const player = videojs(videoElement, options, () => {
        var style = window
          .getComputedStyle(document.body, null)
          .getPropertyValue('font-size');
        var fontSize = parseFloat(style);
        let cropSize;
        if (!options.controls) {
          cropSize = +options.cropSize;
          if (cropSize == 64 || cropSize === 40) {
            cropSize = 47;
          } else if (cropSize === 32) {
            cropSize = 18;
          } else if (cropSize > 50) {
            cropSize = +options.cropSize - Math.ceil(+options.cropSize / 3);
          } else if (cropSize < 10) {
            cropSize = 0;
          }
          const vid = videoRef.current;
          if (vid) {
            vid.style.position = 'relative';
            vid.style.height = '0';
            vid.style.paddingBottom = '56.25%';
            vid.style.top = `-${cropSize / fontSize}rem`;
          }

          videoElement.style.height = '0';
          videoElement.style.position = 'relative';
          videoElement.style.paddingBottom = '56.25%';

          videoElement.classList.add(classes[`vjs-${options.componentName}`]);
          const videoEl = videoElement.firstChild as HTMLVideoElement;
          videoEl.style.objectFit = 'fill';
          videoEl.style.width = '100%';
          videoEl.style.position = 'absolute';
          videoEl.style.top = '0';

          if (cropSize !== undefined) {
            videoEl.style.height = `calc(100% + ${
              (cropSize * 2) / fontSize
            }rem)`;
          }
          videoElement.classList.add('vjs-controls-disabled');
        }

        onReady && onReady(player);
      });

      player.on('mouseenter', function () {
        player.userActive(false);
      });
    } else {
      const player = playerRef.current;

      player?.autoplay(options.autoplay);
      player?.src(options.sources);
    }
  }, [options, videoRef]);

  useEffect(() => {
    const player = playerRef.current;

    return () => {
      if (player && !player.isDisposed()) {
        player.dispose();
      }
    };
  }, [playerRef]);

  return (
    <div data-vjs-player>
      <div ref={videoRef} />
    </div>
  );
};
export default VideoJS;
