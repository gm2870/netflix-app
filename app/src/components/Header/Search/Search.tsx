import classes from './Search.module.scss';
import SearchIcon from '@mui/icons-material/Search';
import { useEffect, useRef } from 'react';

type SearchProps = {
  hide: (searchRef: any) => void;
};
const search = (props: SearchProps) => {
  const searchRef = useRef<HTMLDivElement>(null);
  const handleOutsideClick = (event: any) => {
    if (searchRef.current && !searchRef.current.contains(event.target)) {
      props.hide(event);
    }
  };
  useEffect(() => {
    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, []);
  return (
    <div ref={searchRef} className={classes.search}>
      <SearchIcon className={classes.search__icon} />
      <input
        className={classes.search__input}
        type="text"
        placeholder="Title, people, genres"
      />
    </div>
  );
};
export default search;
