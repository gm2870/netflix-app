import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import classes from './index.module.scss';
import Link from 'next/link';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import SearchIcon from '@mui/icons-material/Search';
import { useEffect, useState } from 'react';
import Slider from '../../src/components/Slider/Slider';

import { useDispatch, useSelector } from 'react-redux';
import { getMediaItems } from '../../src/store/redux/media/media-actions';

const browse = () => {
  const dispatch = useDispatch();
  const [showNavigationLinks, setNavigationLinks] = useState(false);
  const items = useSelector((state) => state.media.mediaItems);
  const navigationToggleHandler = () =>
    setNavigationLinks(!showNavigationLinks);
  useEffect(() => {
    if (!items) {
      dispatch(getMediaItems());
    }
  }, []);

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
      <section className={classes.sliderContainer}>
        {items && <Slider items={items} />}
      </section>
    </section>
  );
};
export default browse;
