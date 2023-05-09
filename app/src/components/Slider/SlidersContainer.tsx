import { Fragment } from 'react';
import Slider from './Slider';
import { GenreWithMedia } from '../../store/redux/media/model';
const SlidersContainer = ({
  genresWithTitles,
}: {
  genresWithTitles: GenreWithMedia[];
}) => {
  const sliders = genresWithTitles.map((g, i) => (
    <div key={i}>
      <Slider genre={g} />
    </div>
  ));
  return <Fragment>{sliders}</Fragment>;
};

export default SlidersContainer;
