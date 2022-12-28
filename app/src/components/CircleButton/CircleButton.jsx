import classes from './CircleButton.module.scss';
const CircleButton = (props) => {
  return (
    <button
      type="button"
      className={`${classes['circle-button']} ${
        props.white ? classes['circle-button--white'] : ''
      }`}
      onClick={props.onClick}
      onMouseEnter={props.onMouseEnter}
    >
      <div className={classes['circle-button__inner']}>{props.children}</div>
    </button>
  );
};

export default CircleButton;
