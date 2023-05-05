import { Fragment } from 'react';
import Slider from './Slider';
const SlidersContainer = ({ items }: { items: any }) => {
  const genres = Object.keys(items);

  const sliders = genres.map((g, i) => (
    <div key={g}>
      <Slider title={g} items={items[g]} />
    </div>
  ));
  return <Fragment>{sliders}</Fragment>;
};

export default SlidersContainer;
