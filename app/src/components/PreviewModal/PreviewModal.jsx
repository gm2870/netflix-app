import CircleButton from '../CircleButton/CircleButton';
import classes from './PreviewModal.module.scss';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { Fragment, useEffect, useState } from 'react';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';
import { useRef } from 'react';
import { Fade, Grow, Slide, Zoom } from '@mui/material';

const MediaCard = (props) => {
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
  const previewRef = useRef();
  const onLikeHover = () =>
    setTimeout(() => {
      setShowMiniModal(true);
    }, 300);
  const cardRef = useRef();
  const infoRef = useRef();
  const imageRef = useRef();
  useEffect(() => {
    if (props.show) {
      cardRef.current.style['opacity'] = 1;
      cardRef.current.style.width = `${props.offsetWidth * 1.5}px`;
      cardRef.current.style.top = `${props.top - props.offsetWidth * 0.4}px`;
      cardRef.current.style.left = `${props.left - props.offsetWidth * 0.25}px`;
      infoRef.current.style['opacity'] = 1;
    }
  }, []);
  const onMiniModalMouseLeave = () => setShowMiniModal(false);
  return (
    // <Grow in={props.show} {...(props.show ? { timeout: 500 } : {})}>
    // <Zoom
    //   in={props.show}
    //   style={{ transitionDelay: props.show ? '500ms' : '0ms' }}
    // >
    // <Slide in={props.show} direction="up" container={imageRef.current}>
    <Zoom in={props.show}>
      <div ref={cardRef} className={classes.card}>
        <div className={classes.imageContainer}>
          <img
            ref={imageRef}
            className={classes.card__image}
            src={'/images/tiger.jpg'}
          />
        </div>
        <div ref={previewRef} className={classes.preview}>
          <div ref={infoRef} className={classes.preview__info}>
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
                  <img
                    className={classes.preview__img}
                    src="/images/like.png"
                  />
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
              <span className={classes['preview__evidence-item']}>
                Stand-Up
              </span>
              <span className={classes['preview__evidence-item']}>
                Social Commentary
              </span>
              <span className={classes['preview__evidence-item']}>Thai</span>
            </div>
          </div>
        </div>
      </div>
    </Zoom>
    // </Grow>
  );
};
export default MediaCard;
