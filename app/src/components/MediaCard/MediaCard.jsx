import CircleButton from '../CircleButton/CircleButton';
import classes from './MediaCard.module.scss';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import CheckIcon from '@mui/icons-material/Check';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import AddIcon from '@mui/icons-material/Add';
import ThumbUpOffAltOutlinedIcon from '@mui/icons-material/ThumbUpOffAltOutlined';
const MediaCard = (props) => {
  const onCardHover = (val) => console.log(val);
  return (
    <div className={classes.card}>
      <div
        className={classes.imageContainer}
        onMouseEnter={() => onCardHover(true)}
      >
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
            <div className={classes['preview__popover']}>
              <div className={classes['double-thumbs-up']}>
                <div className={classes['double-thumbs-up--outer']}>
                  <ThumbUpOffAltOutlinedIcon />
                  <div className={classes['double-thumbs-up--inner']}>
                    <ThumbUpOffAltOutlinedIcon />
                  </div>
                </div>
              </div>
            </div>
            <div className={classes['preview__buttons--left']}>
              <CircleButton white>
                <PlayArrowIcon
                  className={`${classes.preview__icon} ${classes['preview__icon--black']}`}
                />
              </CircleButton>
              <CircleButton>
                <CheckIcon className={classes.preview__icon} />
              </CircleButton>
              <CircleButton>
                <ThumbUpOffAltOutlinedIcon />
              </CircleButton>
            </div>
            <div className={classes['preview__buttons--right']}>
              <CircleButton>
                <KeyboardArrowDownIcon className={classes.preview__icon} />
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
