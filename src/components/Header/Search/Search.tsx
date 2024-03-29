import classes from './Search.module.scss';
import SearchIcon from '@mui/icons-material/Search';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useRef, useState } from 'react';

type SearchProps = {
  hide: (searchRef: any) => void;
};
const Search = (props: SearchProps) => {
  const [searchParam, setSearchParam] = useState('');
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const handleOutsideClick = useCallback(
    (event: any) => {
      if (searchParam) return;
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        props.hide(event);
      }
    },
    [props, searchParam]
  );

  const handleChange = (event: any) => {
    setSearchParam(event.target.value);
  };

  useEffect(() => {
   
      if (router.isReady && router.query.q) {
        const inputVal = router.query.q.toString();
        setSearchParam(inputVal);
      }
   
  }, [router.query.q, router.isReady]);

  useEffect(() => {
   const timer = setTimeout(() => {
      if(searchParam) {
        router.push({
          pathname: '/search',
          query: { q: searchParam },
        });
      }
    }, 1000);
    return () => clearTimeout(timer);
  },[searchParam])
  
  useEffect(() => {
    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, [handleOutsideClick]);

  const clearSearch = () => router.push('/browse');

  return (
    <div ref={searchRef} className={classes.search}>
      <SearchIcon className={classes.search__icon} />
      <input
        className={classes.search__input}
        type="text"
        value={searchParam}
        placeholder="Title, people, genres"
        onChange={handleChange}
      />
      {searchParam && (
        <span
          onClick={clearSearch}
          className={classes.search__clear}
          role="button"
        >
          x
        </span>
      )}
    </div>
  );
};
export default Search;
