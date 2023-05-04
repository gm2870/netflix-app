import { Fragment, useEffect, useState } from 'react';
import Slider from './Slider';
import { useAppSelector } from '../../hooks';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import SliderTemp from './SliderTemp';
const SlidersContainer = ({ items }: { items: any }) => {
  const genres = Object.keys(items).slice(0, 1);

  const sliders = genres.map((g, i) => (
    <div key={g}>
      <SliderTemp index={i} title={g} items={items[g]} />
    </div>
  ));
  return <Fragment>{sliders}</Fragment>;
};

export default SlidersContainer;
