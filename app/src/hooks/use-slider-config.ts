import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

const useSliderConfig = () => {
  const theme = useTheme();
  const min600 = useMediaQuery(theme.breakpoints.up('sm'));
  const min900 = useMediaQuery(theme.breakpoints.up('md'));
  const min1200 = useMediaQuery(theme.breakpoints.up('lg'));
  const min1400 = useMediaQuery('(min-width:1400px)');
  if (min1400) {
    return {
      rowItems: 6,
      itemWidth: 16.66666666666667,
    };
  }
  if (min1200)
    return {
      rowItems: 5,
      itemWidth: 20,
    };
  if (min900)
    return {
      rowItems: 4,
      itemWidth: 25,
    };
  if (min600)
    return {
      rowItems: 3,
      itemWidth: 33.333333,
    };
  return {
    rowItems: 2,
    itemWidth: 50,
  };
};

export default useSliderConfig;
