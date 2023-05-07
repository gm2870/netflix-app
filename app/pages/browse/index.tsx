import classes from './index.module.scss';
import { Fragment } from 'react';

import Billboard from './Billboard/Billboard';
import { useAppDispatch, useAppSelector } from '../../src/hooks';
import Header from '../../src/components/Header/Header';
import { getAllTitles } from '../../api/controllers/media/mediaController.mjs';
import SlidersContainer from '../../src/components/Slider/SlidersContainer';
const browse = (props: any) => {
  return (
    <section className={classes.browse}>
      <Fragment>
        {/* {items.length && <Billboard item={items[19]} />} */}
        <SlidersContainer items={props.titles} />
      </Fragment>
    </section>
  );
};
export default browse;
export async function getServerSideProps() {
  // const titles = await getAllTitles();
  return {
    props: {
      titles: {},
    },
  };
}
