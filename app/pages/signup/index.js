import classes from './signup.module.scss';
import Link from 'next/link';
import { Button, TextField, styled } from '@mui/material';
import { useSelector } from 'react-redux';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { signupUser } from '../../src/store/redux/auth/auth-actions.js';

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email('Please enter a valid email address.')
    .required('Email is required.'),
  password: Yup.string().required('Password is required.'),
});

const signup = () => {
  const email = useSelector((state) => state.signup.email);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      email,
    },
  });
  const registerUser = (data) => {
    signupUser(data);
  };
  const CustomInput = styled(TextField)({
    '& .MuiFilledInput-root': {
      backgroundColor: 'unset',
      border: '1px solid #8c8c8c',
      borderRadius: '2px',
    },
  });
  return (
    <div>
      <header className={classes.header}>
        <Link href="/">
          <a className={classes.header__logo}>
            <img src="/images/netflix-logo.svg" alt="Netflix logo" />
          </a>
        </Link>
        <Link href="/login">
          <a className={classes.header__signin}>Sign In</a>
        </Link>
      </header>
      <div className={classes.signup}>
        <form className={classes.form} onSubmit={handleSubmit(registerUser)}>
          <p>
            STEP <b>1</b> OF <b>3</b>
          </p>
          <h1>Create a password to start your membership</h1>
          <p>Just a few more steps and you&#39;re finished!</p>
          <p>We hate paperwork, too.</p>
          <div className={classes.form__actions}>
            <CustomInput
              {...register('email')}
              className={classes.form__input}
              label="Email"
              variant="filled"
              size="large"
              id="email"
              autoComplete="on"
            />
            {errors.email && (
              <p className={classes.form__error}>{errors.email.message}</p>
            )}
            <CustomInput
              {...register('password')}
              className={classes.form__input}
              label="Password"
              id="password"
              type="password"
              variant="filled"
              size="large"
              autoComplete="on"
            />
            {errors.password && (
              <p className={classes.form__error}>{errors.password.message}</p>
            )}
            <Button
              className={classes.form__btn}
              sx={{ height: 60, fontSize: 22 }}
              color="error"
              size="large"
              variant="contained"
              type="submit"
            >
              Sign Up
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default signup;
