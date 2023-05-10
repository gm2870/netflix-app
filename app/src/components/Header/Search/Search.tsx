import classes from './Search.module.scss';
import SearchIcon from '@mui/icons-material/Search';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';

type SearchProps = {
  hide: (searchRef: any) => void;
};
const search = (props: SearchProps) => {
  const [searchParam, setSearchParam] = useState('');
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const handleOutsideClick = (event: any) => {
    if (searchParam) return;
    if (searchRef.current && !searchRef.current.contains(event.target)) {
      props.hide(event);
    }
  };

  const handleChange = (event: any) => {
    setSearchParam(event.target.value);
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!searchParam) return;
      router.push({
        pathname: '/search',
        query: { q: searchParam },
      });
    }, 500);

    return () => {
      clearTimeout(timeout);
    };
  }, [searchParam]);

  useEffect(() => {
    if (router.isReady && router.query.q) {
      const inputVal = router.query.q.toString();
      setSearchParam(inputVal);
    }
  }, [router.isReady]);

  useEffect(() => {
    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, []);
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
export default search;
