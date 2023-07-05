import Image from 'next/image';
import CircleButton from '../CircleButton/CircleButton';
import classes from './MoreLikeCard.module.scss';
const MoreLikeCard = ({ data }: any) => {
  return (
    <div className={classes.card}>
      <Image
        className={classes.card__image}
        width={265}
        height={130}
        src={`https://image.tmdb.org/t/p/w1280${data.backdrop_path}`}
        alt="card image"
      />
      <div className={classes.info}>
        <h4 className={classes.name}>{data.name || data.title}</h4>

        <div className={classes.metadata}>
          <span className={classes.rating}>{data.vote_average} / 10</span>
          <CircleButton>
            <img className={classes.img} src="/images/add.png" />
          </CircleButton>
        </div>
        <p className={classes.info__overview}>{data.overview}</p>
      </div>
    </div>
  );
};

export default MoreLikeCard;
