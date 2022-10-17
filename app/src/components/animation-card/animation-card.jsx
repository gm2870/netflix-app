import classes from './animation-card.module.scss';

const AnimationCardComponent = (props) => {
  return (
    <div className={classes['animation-card']}>
      <div className={classes['animation-card__container']}>
        {props.children}
      </div>
    </div>
  );
};
export default AnimationCardComponent;
