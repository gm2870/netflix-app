import classes from './Header.module.scss';
import Link from 'next/link';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import SearchIcon from '@mui/icons-material/Search';
import { useEffect, useState, useRef } from 'react';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Menu from './Menu/Menu';
import Notifications from './Notifications/Notifications';
import Search from './Search/Search';
import { useRouter } from 'next/router';

const Header = () => {
  const [stickyHeader, setStickyHeader] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showNavigationLinks, setNavigationLinks] = useState(false);
  const [showNotifications, setShowNotification] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const userDropdown = useRef<HTMLDivElement>(null);
  const notiDropdown = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const navigationToggleHandler = () =>
    setNavigationLinks(!showNavigationLinks);

  useEffect(() => {
    if (router.query.q) {
      setShowSearch(true);
    }
  }, [router.isReady]);

  useEffect(() => {
    window.addEventListener('scroll', () => {
      if (window.scrollY !== 0) {
        setStickyHeader(true);
      } else setStickyHeader(false);
    });
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

  const handleHideSearch = ({ target }: { target: Element }) => {
    if (searchRef.current && !searchRef.current.contains(target)) {
      setShowSearch(false);
    }
  };

  useEffect(() => {
    const dropdownRef = userDropdown.current;
    if (dropdownRef) {
      dropdownRef.style.transitionDuration = '150ms';
      dropdownRef.style.opacity = showUserDropdown ? '1' : '0';
    }
  }, [showUserDropdown]);

  useEffect(() => {
    const dropdownRef = notiDropdown.current;
    if (dropdownRef) {
      dropdownRef.style.transitionDuration = '150ms';
      dropdownRef.style.opacity = showNotifications ? '1' : '0';
    }
  }, [showNotifications]);

  const dropdownIcon = !showUserDropdown ? (
    <ArrowDropDownIcon
      fontSize="small"
      className={`${classes.account__icon} ${classes.caret}`}
    />
  ) : (
    <ArrowDropDownIcon
      fontSize="small"
      className={`${classes.account__icon} ${classes.caret} ${classes.open}`}
    />
  );

  return (
    <div
      className={`${classes.headerWrapper} ${
        stickyHeader ? classes.sticky : ''
      }`}
    >
      <header className={classes.header}>
        <div className={classes['header__logo-box']}>
          <Link href="/browse" className={classes.header__link}>
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
            onMouseLeave={() => setShowUserDropdown(false)}
          >
            <img
              src="/images/user-icon.png"
              className={classes.account__image}
            />
            {dropdownIcon}
            {showUserDropdown && (
              <div ref={userDropdown} className={classes.account__dropdown}>
                <Menu onMouseLeave={() => setShowUserDropdown(false)} />
              </div>
            )}
          </div>
          <div
            className={classes.notification}
            onMouseEnter={() => setShowNotification(true)}
            onMouseLeave={() => setShowNotification(false)}
          >
            <NotificationsNoneIcon className={classes.account__icon} />
            {showNotifications && (
              <div
                ref={notiDropdown}
                className={classes.notification__dropdown}
              >
                <Notifications
                  onMouseLeave={() => setShowNotification(false)}
                />
              </div>
            )}
          </div>

          <div
            ref={searchRef}
            className={classes.search}
            onClick={() => setShowSearch(true)}
          >
            <SearchIcon className={classes.account__icon} />
            {showSearch && (
              <div className={classes.search__container}>
                <Search hide={handleHideSearch} />
              </div>
            )}
          </div>
        </div>
      </header>
    </div>
  );
};

export default Header;
