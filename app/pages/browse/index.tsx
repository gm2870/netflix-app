import classes from './index.module.scss';

import { Fragment } from 'react';
import Slider from '../../src/components/Slider/Slider';

import Billboard from './Billboard/Billboard';
import { useAppDispatch, useAppSelector } from '../../src/hooks';
import Header from '../../src/components/Header/Header';
import { getAllTitles } from '../../api/controllers/media/mediaController.mjs';

const browse = (props: any) => {
  const items = useAppSelector((state) => state.slider.items);
  const genres = Object.keys(props.titles);
  const sliderRows = genres.map((g) => (
    <Slider key={g} title={g} items={props.titles[g]} />
  ));

  return (
    <section className={classes.browse}>
      <Header></Header>
      <Fragment>
        {items.length && <Billboard item={items[19]} />}
        {sliderRows}
      </Fragment>
    </section>
  );
};
export default browse;
export async function getServerSideProps() {
  const titles = await getAllTitles();
  return {
    props: {
      titles: JSON.parse(JSON.stringify(titles)),
    },
  };
}
