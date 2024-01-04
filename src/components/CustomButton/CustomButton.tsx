import { Button } from '@mui/material';
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
  return (
    <Button
      className={`${classes.button} ${white ? classes['button--white'] : ''}`}
      size="small"
      {...props}
    >
      {children}
      
    </Button>
  );
};

export default CustomButton;
