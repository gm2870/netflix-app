import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import classes from './index.module.scss';
import Link from 'next/link';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import SearchIcon from '@mui/icons-material/Search';
import { useState } from 'react';
import Slider from '../../src/components/Slider/Slider';

import MediaItem from '../../src/components/MediaItem/MediaItem';

const browse = () => {
  const [showNavigationLinks, setNavigationLinks] = useState(false);

  const navigationToggleHandler = () =>
    setNavigationLinks(!showNavigationLinks);
  const navigations = [
    {
      name: 'Home',
      link: '/',
    },
    {
      name: 'TVShows',
      link: '/',
    },
    {
      name: 'Movies',
      link: '/',
    },
    {
      name: 'New & Popular',
      link: '/',
    },
    {
      name: 'My List',
      link: '/',
    },
    {
      name: 'Browse by Languages',
      link: '/',
    },
  ];

  return (
    <section className={classes.browse}>
      <header className={classes.header}>
        <div className={classes['header__logo-box']}>
          <Link href="/">
            <a className={classes.header__link}>
              <img
                className={classes.header__logo}
                src="/images/netflix-logo.svg"
                alt="Netflix logo"
              />
            </a>
          </Link>
        </div>
        <List className={classes.navigation}>
          <ListItem
            onClick={navigationToggleHandler}
            className={classes.navigation__menu}
          >
            <span>Browse</span>
            <ArrowDropDownIcon size="small" className={classes.account__icon} />
          </ListItem>
          {showNavigationLinks && (
            <div className={classes.navigation__dropdown}>
              {navigations.map((nav) => (
                <ListItem
                  key={nav.name}
                  className={classes['navigation__dropdown-link']}
                >
                  <Link href={nav.link}>{nav.name}</Link>
                </ListItem>
              ))}
            </div>
          )}
          {navigations.map((nav) => (
            <ListItem key={nav.name} className={classes.navigation__tab}>
              <Link href={nav.link}>{nav.name}</Link>
            </ListItem>
          ))}
        </List>

        <div className={classes.account}>
          <div className={classes.account__menu}>
            <img
              src="images/user-icon.png"
              className={classes.account__image}
            />
            <ArrowDropDownIcon size="small" className={classes.account__icon} />
          </div>
          <div className={classes.account__dropdown}></div>

          <div className={classes.notification}>
            <NotificationsNoneIcon className={classes.account__icon} />
          </div>
          <div className={classes.search}>
            <SearchIcon className={classes.account__icon} />
          </div>
        </div>
      </header>

      <section className={classes.billboard}></section>
      <Slider>
        <MediaItem />
      </Slider>
    </section>
  );
};
export default browse;
