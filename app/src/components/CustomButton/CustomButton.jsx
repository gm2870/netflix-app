import { Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
const CustomButton = (props) => {
  const theme = useTheme();
  const min600 = useMediaQuery(theme.breakpoints.up('sm'));
  const getSize = () => {
    if (!props.dynamicSize || min600) {
      return 'medium';
    }
    return 'small';
  };
  return (
    <Button
      type={props.type}
      variant={props.variant}
      color={props.color}
      size={getSize()}
    >
      {props.children}
    </Button>
  );
};

export default CustomButton;
