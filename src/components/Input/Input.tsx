import styled from '@emotion/styled';
import { TextField } from '@mui/material';

export const Input = styled(TextField)({
  '& label': {
    color: '#8c8c8c',
  },
  '& label.Mui-focused': {
    color: '#8c8c8c',
  },

  '& .MuiInputBase-input': {
    color: 'white',
    borderRadius: '4px',
  },

  '& .MuiFilledInput-root': {
    backgroundColor: 'unset',
  },
  '.css-ahj2mt-MuiTypography-root': {
    color: 'white',
  },
  '& .MuiInput-underline:after': {
    display: 'none',
  },
});
