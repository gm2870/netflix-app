import classes from './MediaCard.module.scss';
const MediaCard = (props) => {
  const onCardHover = (val) => console.log(val);
  return (
    <div className={classes.card}>
      <div
        className={classes.card__container}
        onMouseEnter={() => onCardHover(true)}
      >
        <img
          width="165px"
          src={
            'http://localhost:8001/api/v1/media/image/gFZriCkpJYsApPZEF3jhxL4yLzG.jpg'
          }
        />
        {/* <div className={classes.video}>
        <video
          className={classes.video__src}
          src={'http://localhost:8001/api/v1/media/video/512195'}
          autoPlay
          muted
        />
      </div> */}
      </div>
    </div>
  );
};
export default MediaCard;
