import classes from './MiniInfo.module.scss';
import CircleButton from '../../CircleButton/CircleButton';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { useState, useRef } from 'react';
import { useGetTitleInfoQuery } from '@/src/services/query/media';
import LikePortal from '../../LikePortal/LikePortal';
import { LightTooltip } from '../../Tooltip/Tooltip';
type MiniInfoProps = {
  mediaType: string;
  id: number;
  showDetailsPreviewHandler: () => void;
  toggleAddToMyList: () => void;
  isInMyList: boolean;
};
const MiniInfo = ({
  mediaType,
  id,
  showDetailsPreviewHandler,
  toggleAddToMyList,
  isInMyList = false,
}: MiniInfoProps) => {
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

  const showDetailsHandler = () => {
    showDetailsPreviewHandler();
  };

  const addToMyListHandler = () => {
    toggleAddToMyList();
  };

  return (
    <>
      <div ref={previewRef} className={classes.preview}>
        <div className={classes.preview__info}>
          <div className={classes['preview__controls']}>
            {showLikeModal && (
              <LikePortal
                showLikeModal={showLikeModal}
                onMiniModalMouseLeave={onMiniModalMouseLeave}
              />
            )}

            <div className={classes['preview__buttons--left']}>
              <CircleButton white onClick={showDetailsHandler}>
                <PlayArrowIcon
                  className={`${classes.preview__icon} ${classes['preview__icon--black']}`}
                />
              </CircleButton>
              <LightTooltip
                placement="top"
                title={isInMyList ? 'Remove from list' : 'Add to my list'}
                arrow
              >
                <div>
                  <CircleButton onClick={addToMyListHandler}>
                    {!isInMyList && (
                      <img
                        className={classes.preview__img}
                        src="/images/add.png"
                      />
                    )}
                    {isInMyList && (
                      <img
                        className={classes.preview__img}
                        src="/images/check.png"
                      />
                    )}
                  </CircleButton>
                </div>
              </LightTooltip>
              <CircleButton onMouseEnter={onLikeHover}>
                <img className={classes.preview__img} src="/images/like.png" />
              </CircleButton>
            </div>

            <LightTooltip placement="top" title="More info" arrow>
              <div className={classes['preview__buttons--right']}>
                <CircleButton onClick={showDetailsHandler}>
                  <img
                    className={classes.preview__img}
                    src="/images/arrow-down.png"
                  />
                </CircleButton>
              </div>
            </LightTooltip>
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
