import { FormControl, Select } from '@mui/material';
import { useRouter } from 'next/router';
import classes from './Genres.module.scss';
import { useEffect, useRef, useState } from 'react';
import { styled } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
type Genre = {
  name: string;
  id: number;
};
const Genres = ({ genres }: { genres: Genre[] }) => {
  const [genre, setGenre] = useState(0);
  const [genreList, setGenreList] = useState<JSX.Element[]>([]);
  const [position, setPosition] = useState({
    top: 0,
    left: 0,
  });

  const inputComponent = useRef<HTMLInputElement>(null);
  const router = useRouter();
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
        <li className={classes.menu__item} key={i}>
          <a className={classes.menu__link} href={`/browse/genre/1?g=${l.id}`}>
            {l.name}
          </a>
        </li>
      ));
      list.push(<ul className={classes.menu}>{lis} </ul>);
    }
    setGenreList(list);
  }, [inputComponent, genres]);

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
      fontSize: 16,
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
      },
    },
  };

  const type = router.query.type_id === '1' ? 'TV Shows' : 'Movies';

  return (
    <div className={classes.genreWrapper}>
      <span className={classes.type}>{type}</span>
      <FormControl sx={{ mx: 0, minWidth: 120 }} size="small">
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
          value={genre}
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
    </div>
  );
};

export default Genres;
