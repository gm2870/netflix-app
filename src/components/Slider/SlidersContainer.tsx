import Slider from './Slider';
import { GenreWithMedia } from '../../store/redux/media/model';
import Link from 'next/link';
import classes from './slider.module.scss';
import { useRouter } from 'next/router';
const SlidersContainer = ({
  genresWithTitles,
}: {
  genresWithTitles: GenreWithMedia[];
}) => {
  const router = useRouter();
  const hasGenre = router.query.g;
  const sliders = genresWithTitles.map((g, i) => {
    if (g.titles.length < 6) return;
    return (
      <div key={i} className={classes.sliderContent}>
        {!hasGenre && g.titles.length && (
          <Link href="/" className={classes.title}>
            <h2 className={classes.title__header}>{g.name}</h2>
          </Link>
        )}

        <Slider titles={g.titles} />
      </div>
    );
  });
  return <div className={classes.row}>{sliders}</div>;
};

export default SlidersContainer;
