import {
  FormControl,
  InputBase,
  MenuItem,
  Select,
  styled,
} from '@mui/material';

const BootstrapInput = styled(InputBase)(({ theme }) => ({
  'label + &': {
    marginTop: theme.spacing(3),
  },
  '& .MuiSelect-icon': {
    fill: 'white',
  },

  '& .MuiInputBase-input': {
    borderRadius: 4,
    position: 'relative',
    border: '1px solid rgb(77,77,77)',
    backgroundColor: 'rgb(36, 36, 36)',
    color: 'white',
    fontSize: 16,
    padding: '10px 26px 10px 12px',
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    '&:focus': {
      borderRadius: 4,
    },
  },
}));

const SeasonSelect = ({ options, handleChange }: any) => {
  return (
    <FormControl sx={{ m: 1, mr: 0 }} variant="standard">
      <Select
        MenuProps={{
          sx: {
            '& .MuiPaper-root': {
              backgroundColor: 'rgb(36, 36, 36)',
              color: 'white',
              margin: 0,
            },
          },
        }}
        id="season-select"
        defaultValue={1}
        onChange={handleChange}
        input={<BootstrapInput />}
      >
        {options.map((opt: any, index: number) => (
          <MenuItem
            style={{
              padding: '1rem 1.5rem',
              fontSize: 16,
              fontWeight: 700,
            }}
            key={opt.id}
            value={index + 1}
          >
            {opt.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default SeasonSelect;
