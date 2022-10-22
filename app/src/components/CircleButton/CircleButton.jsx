import classes from './CircleButton.module.scss';
const CircleButton = (props) => {
  return (
    <button
      type="button"
      className={`${classes['circle-button']} ${
        props.white ? classes['circle-button--white'] : ''
      }`}
    >
      <div className={classes['circle-button__inner']}>{props.children}</div>
    </button>
  );
};

export default CircleButton;
