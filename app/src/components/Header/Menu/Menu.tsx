import Link from 'next/link';
import { Fragment } from 'react';
import classes from './Menu.module.scss';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';

type MenuProps = {
  onMouseLeave: () => void;
};
const menu = (props: MenuProps) => {
  return (
    <Fragment>
      <div className={classes.arrow}>
        <ArrowDropUpIcon fontSize="large" />
      </div>
      <div className={classes.menu} onMouseLeave={props.onMouseLeave}>
        <ul className={classes.menu__list}>
          <li className={classes.menu__item}>
            <img
              className={classes.menu__icon}
              src="/images/manage-profiles.png"
            />
            <Link className={classes.menu__link} href="/">
              Manage Profiles
            </Link>
          </li>
          <li className={classes.menu__item}>
            <img
              className={classes.menu__icon}
              src="/images/exit-profile.png"
            />
            <Link className={classes.menu__link} href="/">
              Exit Profile
            </Link>
          </li>
          <li className={classes.menu__item}>
            <img
              className={classes.menu__icon}
              src="/images/transfer-profile.png"
            />
            <Link className={classes.menu__link} href="/">
              Transfer Profile
            </Link>
          </li>
          <li className={classes.menu__item}>
            <img className={classes.menu__icon} src="/images/account.png" />
            <Link className={classes.menu__link} href="/">
              Account
            </Link>
          </li>
          <li className={classes.menu__item}>
            <img className={classes.menu__icon} src="/images/help-center.png" />
            <Link className={classes.menu__link} href="/">
              Help Center
            </Link>
          </li>
        </ul>
        <div className={classes.logout}>
          <Link className={classes.logout__link} href="/logout">
            Sign out of Netflix
          </Link>
        </div>
      </div>
    </Fragment>
  );
};

export default menu;
