import CustomButton from "../CustomButton/CustomButton"
import classes from './PlayButton.module.scss';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

const PlayButton = () => {
    return (<CustomButton
    variant="contained"
    white={true}
    className={classes.colorPrimary}
  >
    <PlayArrowIcon
      className={classes.icon}
    />
    <span className={classes.text}>Play</span>
  </CustomButton>)
}

export default PlayButton;
