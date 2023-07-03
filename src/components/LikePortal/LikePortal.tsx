import { Fade } from "@mui/material"
import { LightTooltip } from "../Tooltip/Tooltip"
import classes from './LikePortal.module.scss'
const LikePortal = ({showLikeModal, onMiniModalMouseLeave}:{onMiniModalMouseLeave: () => void, showLikeModal: boolean}) => {
    return   <Fade
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
}

export default LikePortal;