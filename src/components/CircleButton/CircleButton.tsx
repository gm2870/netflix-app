import { PropsWithChildren } from 'react';
import classes from './CircleButton.module.scss';
type CircleButtonProps = PropsWithChildren<{
  white?: boolean;
  onClick?: () => void;
  onMouseEnter?: () => void;
}>;

const CircleButton = ({
  children,
  white,
  onClick,
  onMouseEnter,
  ...props
}: CircleButtonProps) => {
  return (
    <button
      type="button"
      className={`${classes['circle-button']} ${
        white ? classes['circle-button--white'] : ''
      }`}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      {...props}
      
    >
      <div className={classes['circle-button__inner']}>{children}</div>
    </button>
  );
};

export default CircleButton;
