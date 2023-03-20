import { Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

type CustomButton = {
  children: React.ReactNode;
  variant: 'contained' | 'outlined' | 'text';
  type: 'submit' | 'button';
  color:
    | 'inherit'
    | 'primary'
    | 'secondary'
    | 'success'
    | 'error'
    | 'info'
    | 'warning';
  dynamicSize?: boolean;
  className: string;
};

const CustomButton = ({
  children,
  type,
  variant,
  color,
  dynamicSize,
  className,
}: CustomButton) => {
  const theme = useTheme();
  const min600 = useMediaQuery(theme.breakpoints.up('sm'));
  const getSize = () => {
    if (!dynamicSize || min600) {
      return 'medium';
    }
    return 'small';
  };
  return (
    <Button
      className={className}
      type={type}
      variant={variant}
      color={color}
      size={getSize()}
    >
      {children}
    </Button>
  );
};

export default CustomButton;
