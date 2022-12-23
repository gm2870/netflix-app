import CircleButton from '../CircleButton/CircleButton';
import classes from './PreviewModal.module.scss';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { useEffect, useState } from 'react';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';
import { useRef } from 'react';
import { Fade } from '@mui/material';
import { useDispatch } from 'react-redux';
import { sliderActions } from '../../store/redux/slider/slider';

const MediaCard = (props) => {
  const dispatch = useDispatch();
  const [playing, setPlaying] = useState(false);
  const onTrailerStart = () => {
    console.log(playing);
    setTimeout(() => {
      setPlaying(true);
    }, 1500);
  };
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
  const onLikeHover = () => setShowMiniModal(true);
  const onEndTrailer = () => setPlaying(false);
  const cardRef = useRef();

  useEffect(() => {
    if (props.show) {
      cardRef.current.style.width = `${props.offsetWidth * 1.5}px`;
      cardRef.current.style.top = `${props.top - props.offsetWidth * 0.4}px`;
      if (props.isFirst) {
        cardRef.current.style.left = `${props.left}px`;
      } else if (props.isLast) {
        cardRef.current.style.left = `${
          props.left - props.offsetWidth * 0.5
        }px`;
      } else {
        cardRef.current.style.left = `${
          props.left - props.offsetWidth * 0.25
        }px`;
      }
    }
  }, []);
  const onMiniModalMouseLeave = () => setShowMiniModal(false);
  return (
    <Fade
      in={props.show}
      style={{ transitionDelay: props.show ? '500ms' : '0ms' }}
    >
      <div ref={cardRef} className={classes.card}>
        {!playing && (
          <div className={classes.imageContainer}>
            <img
              onMouseEnter={onTrailerStart}
              className={classes.card__image}
              src={`http://localhost:8001/api/v1/media/image/${props.item.backdrop_path}`}
            />
          </div>
        )}
        {playing && (
          <div className={classes.video} onMouseLeave={onEndTrailer}>
            <video
              autoPlay
              muted
              className={classes.video__src}
              src={`http://localhost:8001/api/v1/media/video/${props.item.id}`}
            />
          </div>
        )}
        <div className={classes.preview}>
          <div className={classes.preview__info}>
            <div className={classes['preview__controls']}>
              <Fade
                in={showMiniModel}
                style={{ transitionDelay: props.show ? '300ms' : '0ms' }}
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
    </Fade>
  );
};
export default MediaCard;
