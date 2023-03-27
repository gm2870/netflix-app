import { Fragment } from 'react';
import classes from './Notifications.module.scss';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';

type NotificationsProps = {
  onMouseLeave: () => void;
};
const notifications = (props: NotificationsProps) => {
  return (
    <Fragment>
      <div className={classes.arrow}>
        <ArrowDropUpIcon fontSize="large" />
      </div>
      <div className={classes.notifications} onMouseLeave={props.onMouseLeave}>
        {/* <img src="" /> */}
        {/* <div>
        <p>Continue Watching</p>
        <p>Friends</p>
        <p>1 week ago</p>
      </div> */}
        <p className={classes.notifications__text}>No recent notifications</p>
      </div>
    </Fragment>
  );
};

export default notifications;
