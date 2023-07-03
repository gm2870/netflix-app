import CircleButton from "../CircleButton/CircleButton"
import classes from './SoundButton.module.scss';

const SoundButton = ({soundOn, onToggle}: {soundOn: boolean; onToggle: () => void}) => {
    return  <div className={classes.soundBtn}>
    <CircleButton onClick={onToggle}>
      {!soundOn ? (
        <img src="/images/volume-off.png" />
      ) : (
        <img src="/images/volume-on.png" />
      )}
    </CircleButton>
  </div>
}

export default SoundButton;