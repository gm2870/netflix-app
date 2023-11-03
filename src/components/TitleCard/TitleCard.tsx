import Image from 'next/image';
import classes from './TitleCard.module.scss';
import Link from 'next/link';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

type EpisodInfo = {
  episodeNumber: number;
  still_path: string;
  overview: string;
  name: string;
  runtime: number;
  titleId: string;
  seasonNumber: number;
};

const TitleCard = ({
  episodeNumber,
  still_path,
  overview,
  name,
  runtime,
  titleId,
  seasonNumber
}: EpisodInfo) => {
  const containerClassNames = episodeNumber === 1
  ? `${classes.titleCardContainer} ${classes.grayBg}`
  : `${classes.titleCardContainer}`;
  return (
    <div className={containerClassNames}>
      <span className={classes.episodeNumber}>{episodeNumber}</span>
      <div className={classes.image}>
        <Link className={classes.source} href={`https://vidsrc.to/embed/tv/${titleId}/${seasonNumber}/${episodeNumber}`} target='_blank'>
          <PlayArrowIcon className={classes.playIcon} />
        </Link>
        <Image  src={`https://image.tmdb.org/t/p/w1280${still_path}`} width={150} height={100} alt="alt" />
      </div>
      <div className={classes.cardInfo}>
        <div className={classes.header}>
          <span className={classes.episodeTitle}>{name}</span>
          <span>{runtime}m</span>
        </div>
        <p className={classes.overview}>{overview}</p>
      </div>
    </div>
  );
};

export default TitleCard;
