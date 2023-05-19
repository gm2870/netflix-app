import { PropsWithChildren } from 'react';
import classes from './GridList.module.scss';

const GridList = (props: PropsWithChildren) => {
  return (
    <div className={classes.gridWrapper}>
      <div className={classes.gridList}>{props.children}</div>
    </div>
  );
};

export default GridList;
