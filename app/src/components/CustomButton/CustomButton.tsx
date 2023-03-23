import { Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { PropsWithChildren, ComponentPropsWithoutRef } from 'react';
import classes from './CustomButton.module.scss';
type ButtonProps = ComponentPropsWithoutRef<typeof Button>;
type CustomButtonProps = PropsWithChildren<
  ButtonProps & { dynamicSize?: boolean; white?: boolean }
>;

const CustomButton = ({
  children,
  dynamicSize,
  white,
  ...props
}: CustomButtonProps) => {
  const theme = useTheme();
  const min600 = useMediaQuery(theme.breakpoints.up('sm'));
  const getSize = () => {
    if (!dynamicSize || min600) {
      return 'large';
    }
    return 'small';
  };
  return (
    <Button
      className={`${classes.button} ${white ? classes['button--white'] : ''}`}
      {...props}
    >
      {children}
    </Button>
  );
};

export default CustomButton;
