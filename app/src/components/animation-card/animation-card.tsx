import classes from './animation-card.module.scss';

const AnimationCardComponent = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <div className={classes['animation-card']}>
      <div className={classes['animation-card__container']}>{children}</div>
    </div>
  );
};
export default AnimationCardComponent;
