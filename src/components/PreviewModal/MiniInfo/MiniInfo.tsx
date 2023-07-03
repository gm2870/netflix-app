import classes from './MiniInfo.module.scss';
import CircleButton from '../../CircleButton/CircleButton';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { useState, useRef } from 'react';
import { useGetTitleInfoQuery } from '@/src/services/query/media';
import LikePortal from '../../LikePortal/LikePortal';
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
            { showLikeModal && <LikePortal showLikeModal={showLikeModal} onMiniModalMouseLeave={onMiniModalMouseLeave} />}
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
