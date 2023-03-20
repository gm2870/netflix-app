import classes from './CircleButton.module.scss';
type CircleButton = {
  children?: React.ReactNode;
  white?: boolean;
  onClick?: () => void;
  onMouseEnter?: () => void;
};

const CircleButton = ({
  children,
  white,
  onClick,
  onMouseEnter,
}: CircleButton) => {
  return (
    <button
      type="button"
      className={`${classes['circle-button']} ${
        white ? classes['circle-button--white'] : ''
      }`}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
    >
      <div className={classes['circle-button__inner']}>{children}</div>
    </button>
  );
};

export default CircleButton;
