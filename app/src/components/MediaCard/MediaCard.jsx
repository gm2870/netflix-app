import CircleButton from '../CircleButton/CircleButton';
import classes from './MediaCard.module.scss';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { useState } from 'react';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';

const MediaCard = () => {
  const LightTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.arrow}`]: {
      color: theme.palette.common.white,
    },
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: theme.palette.common.white,
      color: 'rgba(0, 0, 0, 0.87)',
      boxShadow: theme.shadows[1],
      fontSize: 21,
      padding: '0.5rem 1.5rem',
    },
  }));
  const [showMiniModel, setShowMiniModal] = useState(false);
  const onLikeHover = () =>
    setTimeout(() => {
      setShowMiniModal(true);
    }, 500);

  const onMiniModalMouseLeave = () => setShowMiniModal(false);
  return (
    <div className={classes.card}>
      <div className={classes.imageContainer}>
        <img
          className={classes.card__image}
          width="165px"
          src={
            'http://localhost:8001/api/v1/media/image/gFZriCkpJYsApPZEF3jhxL4yLzG.jpg'
          }
        />
      </div>
      <div className={classes.preview}>
        <div className={classes.preview__trailer}>
          {/* <div className={classes.video}>
        <video
          className={classes.video__src}
          src={'http://localhost:8001/api/v1/media/video/512195'}
          autoPlay
          muted
        />
      </div> */}
        </div>
        <div className={classes.preview__info}>
          <div className={classes['preview__controls']}>
            <div
              onMouseLeave={onMiniModalMouseLeave}
              className={`${classes['preview__mini-modal']} ${
                showMiniModel ? classes.visible : classes.hidden
              }`}
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
                <img className={classes.preview__img} src="/images/like.png" />
              </CircleButton>
              <div></div>
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
          <div className={classes['preview__video-metadata']}>
            <span
              className={classes['preview__video-metadata-match-percentage']}
            >
              98% Match
            </span>
            <span className={classes['duration-text']}>2h 57m</span>
            <span className={classes['hd-text']}>HD</span>
          </div>
          <div className={classes['preview__evidence']}>
            <span className={classes['preview__evidence-item']}>Stand-Up</span>
            <span className={classes['preview__evidence-item']}>
              Social Commentary
            </span>
            <span className={classes['preview__evidence-item']}>Thai</span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default MediaCard;
