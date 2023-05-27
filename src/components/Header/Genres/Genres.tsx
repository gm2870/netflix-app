import { FormControl, MenuItem, Select } from '@mui/material';
import { useRouter } from 'next/router';
import classes from './Genres.module.scss';
import { Fragment, useEffect, useRef, useState } from 'react';
import { styled } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import Link from 'next/link';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { Genre } from '@/src/models/genre.model';

const Genres = ({ genres }: { genres: Genre[] }) => {
  const [genre, setGenre] = useState('');
  const router = useRouter();
  const [genreList, setGenreList] = useState<JSX.Element[]>([]);
  const [position, setPosition] = useState({
    top: 0,
    left: 0,
  });

  const inputComponent = useRef<HTMLInputElement>(null);
  useEffect(() => {
    setPosition({
      top: inputComponent.current
        ? inputComponent.current.getBoundingClientRect().top + 35
        : 0,
      left: inputComponent.current
        ? inputComponent.current.getBoundingClientRect().left + 0
        : 0,
    });
    const list = [];
    const chunkSize = Math.ceil(genres.length / 3);
    for (let i = 0; i < genres.length; i += chunkSize) {
      const chunk = genres.slice(i, i + chunkSize);
      const lis = chunk.map((l, i) => (
        <MenuItem
          value={l.id}
          className={classes.menu__item}
          key={l.id * Math.random()}
        >
          <Link
            className={classes.menu__link}
            href={`/browse/genre/${router.query.type_id}?g=${l.id}`}
          >
            {l.title}
          </Link>
        </MenuItem>
      ));
      list.push(
        <ul key={Math.random()} className={classes.menu}>
          {lis}
        </ul>
      );
    }
    setGenreList(list);
  }, [inputComponent, genres, router.query.type_id]);

  useEffect(() => {
    if (router.query.g) {
      const genreName =
        genres.find((g) => g.id === +(router.query.g as string))?.title || '';
      setGenre(genreName);
    }
  }, [genres, router.query.g]);

  const BootstrapInput = styled(InputBase)(({ theme }) => ({
    'label + &': {
      marginTop: theme.spacing(3),
    },
    '& .MuiInputBase-input': {
      borderRadius: 0,
      position: 'relative',
      backgroundColor: '#000',
      border: '1px solid #fff',
      color: '#fff',
      fontSize: '1.2rem',
      padding: '5px 10px',
      display: 'flex',
      alignItems: 'center',
      transition: theme.transitions.create(['border-color', 'box-shadow']),

      '&:focus': {
        borderRadius: 0,
        borderColor: 'none',
        boxShadow: 'none',
      },
    },
  }));
  const MenuProps = {
    PaperProps: {
      sx: {
        backgroundColor: '#000',
        color: '#fff',
        top: `${position.top}px !important`,
        left: `${position.left}px !important`,
        border: '1px solid hsla(0,0%,100%,.15)',
        borderRadius: 0,
        overflow: 'auto',
      },
    },
  };
  const type = router.query.type_id === '1' ? 'TV Shows' : 'Movies';

  return (
    <div className={classes.genreWrapper}>
      {!router.query.g && (
        <Fragment>
          <span className={classes.type}>{type}</span>
          <FormControl sx={{ mx: 0 }} size="small">
            <Select
              ref={inputComponent}
              input={<BootstrapInput />}
              MenuProps={MenuProps}
              renderValue={(selected: number) => {
                if (!selected) {
                  return <span>Genres</span>;
                }

                return selected;
              }}
              value={0}
              labelId="genres"
              sx={{
                '.MuiSvgIcon-root ': {
                  fill: 'white !important',
                },
              }}
            >
              {genreList}
            </Select>
          </FormControl>
        </Fragment>
      )}

      {router.query.g && genres.length ? (
        <Fragment>
          <Link
            className={classes.type__link}
            href={`/browse/genre/${router.query.type_id}`}
          >
            {type}
          </Link>
          <span className={classes.breadcrumbIcon}>
            <KeyboardArrowRightIcon />
          </span>
          <p>{genre}</p>
        </Fragment>
      ) : null}
    </div>
  );
};

export default Genres;
