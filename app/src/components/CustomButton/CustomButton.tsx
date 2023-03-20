import { Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { PropsWithChildren, ComponentPropsWithoutRef } from 'react';

type ButtonProps = ComponentPropsWithoutRef<typeof Button>;
type CustomButtonProps = PropsWithChildren<
  ButtonProps & { dynamicSize: boolean }
>;

const CustomButton = ({
  children,
  dynamicSize,
  ...props
}: CustomButtonProps) => {
  const theme = useTheme();
  const min600 = useMediaQuery(theme.breakpoints.up('sm'));
  const getSize = () => {
    if (!dynamicSize || min600) {
      return 'medium';
    }
    return 'small';
  };
  return (
    <Button {...props} size={getSize()}>
      {children}
    </Button>
  );
};

export default CustomButton;
