import Image from 'next/image';
import classes from './TitleCard.module.scss';

type EpisodInfo = {
  episodeNumber: number;
  image: string;
  overview: string;
  name: string;
  runtime: number;
};

const TitleCard = ({
  episodeNumber,
  image,
  overview,
  name,
  runtime,
}: EpisodInfo) => {
  return (
    <div className={classes.titleCardContainer}>
      <span>{episodeNumber}</span>
      <div>
        <Image src={image} width={100} height={50} alt="alt" />
      </div>
      <div>
        <span>{name}</span>
        <span>{runtime}m</span>
      </div>
      <p>{overview}</p>
    </div>
  );
};

export default TitleCard;
