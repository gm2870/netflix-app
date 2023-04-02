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
  const min900 = useMediaQuery(theme.breakpoints.up('md'));
  const min1200 = useMediaQuery(theme.breakpoints.up('lg'));

  const getSize = () => {
    if (min1200) {
      return 'large';
    }

    if (min900) {
      return 'medium';
    }
    if (min600) {
      return 'small';
    }
    return 'large';
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
