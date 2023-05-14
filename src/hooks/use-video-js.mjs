import { useCallback, useEffect, useRef } from 'react';
import videojs from 'video.js';
export const useVideoJS = ({ key, videoJsOptions }) => {
  const videoNode = useRef();
  const player = useRef();

  useEffect(() => {
    if (!player.current) {
      player.current = videojs(videoNode.current, videoJsOptions);
    }

    return () => {
      player.current.dispose();
    };
  }, [key]);

  const Video = useCallback(
    ({ children, ...props }) => {
      return (
        <div data-vjs-player key={key}>
          <video ref={videoNode} className="video-js" {...props}>
            {children}
          </video>
        </div>
      );
    },
    [key]
  );
  return { Video, player: player.current };
};
