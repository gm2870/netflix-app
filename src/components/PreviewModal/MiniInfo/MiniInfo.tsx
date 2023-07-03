import { Fade } from '@mui/material';
import classes from './MiniInfo.module.scss';
import { LightTooltip } from '../../Tooltip/Tooltip';
import CircleButton from '../../CircleButton/CircleButton';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { useState, useRef } from 'react';
import { useGetTitleInfoQuery } from '@/src/services/query/media';
type MiniInfoProps = {
  mediaType: string;
  id: number;
};
const MiniInfo = ({ mediaType, id }: MiniInfoProps) => {
  const [showLikeModal, setShowLikeModal] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);
  const { data: info } = useGetTitleInfoQuery({
    type: mediaType,
    id: id,
  });
  const onMiniModalMouseLeave = () => {
    setShowLikeModal(false);
  };
  const onLikeHover = () => {
    setShowLikeModal(true);
  };

  return (
    <>
      <div ref={previewRef} className={classes.preview}>
        <div className={classes.preview__info}>
            <div className={classes['preview__controls']}>
              <Fade
                in={showLikeModal}
                style={{ transitionDelay: showLikeModal ? '300ms' : '0ms' }}
              >
                <div
                  onMouseLeave={onMiniModalMouseLeave}
                  className={`${classes['preview__mini-modal']}`}
                >
                  <LightTooltip placement="top" title="Not for me" arrow>
                    <button className={classes['preview__mini-modal-btn']}>
                      <img
                        className={classes['preview__mini-modal-img']}
                        src="/images/dislike.png"
                      />
                    </button>
                  </LightTooltip>
                  <LightTooltip placement="top" title="I like this" arrow>
                    <button className={classes['preview__mini-modal-btn']}>
                      <img
                        className={classes['preview__mini-modal-img']}
                        src="/images/like.png"
                      />
                    </button>
                  </LightTooltip>
                  <LightTooltip placement="top" title="Love this!" arrow>
                    <button className={classes['preview__mini-modal-btn']}>
                      <img
                        className={classes['preview__mini-modal-img']}
                        src="/images/love.png"
                      />
                    </button>
                  </LightTooltip>
                </div>
              </Fade>
              <div className={classes['preview__buttons--left']}>
                <CircleButton white>
                  <PlayArrowIcon
                    className={`${classes.preview__icon} ${classes['preview__icon--black']}`}
                  />
                </CircleButton>
                <CircleButton>
                  <img className={classes.preview__img} src="/images/add.png" />
                </CircleButton>

                <CircleButton onMouseEnter={onLikeHover}>
                  <img
                    className={classes.preview__img}
                    src="/images/like.png"
                  />
                </CircleButton>
              </div>
              <div className={classes['preview__buttons--right']}>
                <CircleButton>
                  <img
                    className={classes.preview__img}
                    src="/images/arrow-down.png"
                  />
                </CircleButton>
              </div>
            </div>
            {info && (
            <div className={classes['preview__video-metadata']}>
              <span className={classes.name}>{info.name || info.title}</span>
              <div className={classes.rating}>
                <span className={classes.rating__value}>
                  {info.vote_average.toFixed(1)}
                </span>
                <span> / 10</span>
              </div>
            </div>
            )}
            <div className={classes['preview__evidence']}>
              {info
                ? info.genres.map((g: any, i: number) => (
                    <span key={i} className={classes['preview__evidence-item']}>
                      {g.name}
                    </span>
                  ))
                : null}
            </div>
          </div>
        </div>
      
    </>
  );
};

export default MiniInfo;
