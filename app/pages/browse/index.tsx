import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import classes from './index.module.scss';
import Link from 'next/link';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import SearchIcon from '@mui/icons-material/Search';
import { Fragment, useEffect, useState } from 'react';
import Slider from '../../src/components/Slider/Slider';

import { getMediaItems } from '../../src/store/redux/media/media-actions';

import Billboard from './Billboard/Billboard';
import { useAppDispatch, useAppSelector } from '../../src/hooks';
import { Media } from '../../src/store/redux/media/model';
import { logout } from '../../src/store/redux/auth/auth-actions';

const browse = () => {
  const dispatch = useAppDispatch();

  const [showNavigationLinks, setNavigationLinks] = useState(false);
  const [stickyHeader, setStickyHeader] = useState(false);
  const items = useAppSelector((state) => state.slider.items);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const navigationToggleHandler = () =>
    setNavigationLinks(!showNavigationLinks);

  useEffect(() => {
    console.log('useEffect');

    if (!items.length) {
      dispatch(getMediaItems());
    }
  }, []);

  // useEffect(() => {
  //   console.log(items);

  //   window.addEventListener('scroll', () => {
  //     if (window.scrollY !== 0) {
  //       setStickyHeader(true);
  //     } else setStickyHeader(false);
  //   });
  // }, []);

  const handleLogout = () => dispatch(logout());
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
      <div
        className={`${classes.headerWrapper} ${
          stickyHeader ? classes.sticky : ''
        }`}
      >
        <header className={classes.header}>
          <div className={classes['header__logo-box']}>
            <Link href="/" className={classes.header__link}>
              <img
                className={classes.header__logo}
                src="/images/netflix-logo.svg"
                alt="Netflix logo"
              />
            </Link>
          </div>
          <List className={classes.navigation}>
            <ListItem
              onClick={navigationToggleHandler}
              className={classes.navigation__menu}
            >
              <span>Browse</span>
              <ArrowDropDownIcon
                fontSize="small"
                className={classes.account__icon}
              />
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
            <div
              className={classes.account__menu}
              onMouseEnter={() => setShowUserDropdown(true)}
            >
              <img
                src="images/user-icon.png"
                className={classes.account__image}
              />
              <ArrowDropDownIcon
                fontSize="small"
                className={classes.account__icon}
              />
            </div>
            <div className={classes.account__dropdown}></div>

            <div className={classes.notification}>
              <NotificationsNoneIcon className={classes.account__icon} />
            </div>
            <div className={classes.search}>
              <SearchIcon className={classes.account__icon} />
            </div>
          </div>
          {showUserDropdown && (
            <div
              className={classes.userDropdown}
              onMouseLeave={() => setShowUserDropdown(false)}
            >
              <button onClick={handleLogout}>Logout</button>
            </div>
          )}
        </header>
      </div>
      <Fragment>
        {/* {items.length && <Billboard item={items[19]} />} */}
        <Slider />
      </Fragment>
    </section>
  );
};
export default browse;
