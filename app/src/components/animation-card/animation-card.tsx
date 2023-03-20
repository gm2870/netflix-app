import classes from './animation-card.module.scss';
import { PropsWithChildren } from 'react';

const AnimationCardComponent = ({ children }: PropsWithChildren) => {
  return (
    <div className={classes['animation-card']}>
      <div className={classes['animation-card__container']}>{children}</div>
    </div>
  );
};
export default AnimationCardComponent;
