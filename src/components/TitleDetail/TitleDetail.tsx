import { GenreWithMedia, Media } from '@/src/store/redux/media/model';
import Player from '../Player/Player';
import TitleCard from '../TitleCard/TitleCard';
import { useState } from 'react';
import {
  useGetSeasonDetailsQuery,
  useGetTitleDetailsQuery,
} from '@/src/services/query/media';
import classes from './TitleDetail.module.scss';
import SoundButton from '../SoundButton/SoundButton';
import PlayButton from '../PlayButton/PlayButton';
import CircleButton from '../CircleButton/CircleButton';
import CloseIcon from '@mui/icons-material/Close';
import { Genre } from '@/src/models/genre.model';
import SeasonSelect from './SeasonSelect/SeasonSelect';
import GridList from '../GridList/GridList';
import MoreLikeCard from '../MoreLikeCard/MoreLikeCard';

type DetailInfoProps = {
  item: Media;
  closeModal: () => void;
  genres: Genre[];
  allItems: GenreWithMedia[];
};
const TitleDetail = ({
  item,
  closeModal,
  genres,
  allItems,
}: DetailInfoProps) => {
  const [soundOn, setSoundOn] = useState(false);
  const [seasonNumber, setSeasonNumber] = useState(1);

  const { data: titleDetails, isLoading } = useGetTitleDetailsQuery({
    id: item.id,
    type: item.media_type,
  });
  const { data: seasonDetails } = useGetSeasonDetailsQuery(
    {
      id: item.id,
      seasonNumber,
    },
    {
      skip: !item.id,
    }
  );

  const soundToggleHandler = () => setSoundOn((prev) => !prev);

  const moreLikeItems = allItems
    ?.map((g) => {
      const noneDuplicateTitles = { ...g };
      noneDuplicateTitles.titles = g.titles.filter((t) => t.id !== item.id);
      return noneDuplicateTitles;
    })
    .filter((genreItem) => item.genre_ids[0] === genreItem.id)
    .map((x) => x.titles.slice(0, 4));
  const moreLikeTitles: Media[] = [];
  for (const items of moreLikeItems) {
    items.forEach((x) => moreLikeTitles.push(x));
  }
  console.log(moreLikeTitles);
  const playStartHandler = () => {};
  const titleGenres = genres.filter((g) => item.genre_ids.includes(g.id));
  const handleSelectChange = (val: any) => console.log(val.target.value);
  return (
    <div className={classes.container}>
      <Player
        backdrop_path={item.backdrop_path}
        video_src={item.video_src}
        id={item.id}
        soundOn={soundOn}
        media_type={item.media_type}
        playing={playStartHandler}
      />
      <button className={classes.closeBtn} onClick={closeModal}>
        <CloseIcon />
      </button>
      <div className={classes.action}>
        <div className={classes.action__buttons}>
          <PlayButton />
          <CircleButton>
            <img className={classes.preview__img} src="/images/add.png" />
          </CircleButton>

          <CircleButton>
            <img className={classes.preview__img} src="/images/like.png" />
          </CircleButton>
        </div>
        <div>
          <SoundButton soundOn={soundOn} onToggle={soundToggleHandler} />
        </div>
      </div>
      <div className={classes.gradient}></div>
      <div className={classes.info}>
        <div className={classes.info__header}>
          <div className={classes.overview}>
            <span>{item.vote_average.toFixed(1)}</span>
            <span> / 10</span>
            <p className={classes.overview__text}>{item.overview}</p>
          </div>
          <div>
            {seasonDetails &&
              seasonDetails.episodes[0].guest_stars.length !== 0 && (
                <div className={classes.cast}>
                  <span className={classes.info__text}>Cast: </span>
                  {seasonDetails.episodes[0].guest_stars
                    .slice(0, 3)
                    .map((star) => (
                      <span key={star.name}>{star.name}, </span>
                    ))}
                  <span>more</span>
                </div>
              )}
            <div className={classes.genres}>
              <span className={classes.info__text}>Genres: </span>
              {titleGenres.map((genre) => (
                <span key={genre.id}>{genre.title}, </span>
              ))}
            </div>
          </div>
        </div>

        {item.media_type === 'tv' && (
          <>
            <div
              style={{
                display: 'flex',
                color: 'white',
                justifyContent: 'space-between',
              }}
            >
              <h2>Episodes</h2>
              {titleDetails && (
                <SeasonSelect
                  handleChange={handleSelectChange}
                  options={titleDetails.seasons}
                />
              )}
            </div>
            <div className={classes.cardContainer}>
              {!isLoading &&
                seasonDetails &&
                seasonDetails.episodes.map((episode, i) => (
                  <TitleCard
                    key={episode.id}
                    episodeNumber={i + 1}
                    still_path={episode.still_path}
                    runtime={episode.runtime}
                    name={episode.name}
                    overview={episode.overview}
                  />
                ))}
            </div>
          </>
        )}
        <h2>More like this</h2>

        {moreLikeTitles && (
          <div className={classes.moreLikeWrapper}>
            {moreLikeTitles.map((item: Media) => (
              <MoreLikeCard key={item.id} data={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TitleDetail;
