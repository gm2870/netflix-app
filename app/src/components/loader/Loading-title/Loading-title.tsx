import classes from './Loading-title.module.scss';

const LoadingTitle = ({ animationDelay }: { animationDelay: string }) => {
  return (
    <div className={classes.loader}>
      <div
        style={{ animationDelay: animationDelay }}
        className={`${classes.pulsate} ${classes['ratio-16x9']}`}
      ></div>
    </div>
  );
};

export default LoadingTitle;
