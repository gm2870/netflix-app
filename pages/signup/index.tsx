import classes from './signup.module.scss';
import Link from 'next/link';
import { Button, TextField, styled } from '@mui/material';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { signupUser } from '../../src/store/redux/auth/auth-actions';
import { useAppDispatch, useAppSelector } from '../../src/hooks';
import { useSignupMutation } from '@/src/services/query/auth';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
type SignupCredentials = {
  password: string;
  email: string;
};
const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email('Please enter a valid email address.')
    .required('Email is required.'),
  password: Yup.string().required('Password is required.'),
});

const Signup = () => {
  const email = useAppSelector((state) => state.auth.email);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      email,
      password: '',
    },
  });
  const [signup, { isLoading, error, isSuccess }] = useSignupMutation();

  const registerUser = (data: SignupCredentials) => {
    signup(data);
  };
  useEffect(() => {
    if (isSuccess) {
      router.push('/browse');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  const CustomInput = styled(TextField)({
    '& .MuiFilledInput-root': {
      backgroundColor: 'unset',
      border: '1px solid #8c8c8c',
      borderRadius: '2px',
    },
  });
  return (
    <div className={classes.signup}>
      <header className={classes.header}>
        <Link href="/" className={classes.header__logo}>
          <img src="/images/netflix-logo.svg" alt="Netflix logo" />
        </Link>
        <Link href="/login" className={classes.header__signin}>
          Sign In
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
              size="medium"
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
              size="medium"
              autoComplete="on"
            />
            {errors.password && (
              <p className={classes.form__error}>{errors.password.message}</p>
            )}
            {(error as any)?.data.message && (
              <p className={classes.form__error}>
                {(error as any).data.message}
              </p>
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

export default Signup;
