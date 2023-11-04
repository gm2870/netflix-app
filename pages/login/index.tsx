import { Button, styled, TextField, Checkbox, Typography } from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import CircularProgress from '@mui/material/CircularProgress';

import classes from './login.module.scss';
import Link from 'next/link';
import { Fragment, useEffect, useRef, useState } from 'react';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { FieldValues, useForm } from 'react-hook-form';
import CustomButton from '../../src/components/CustomButton/CustomButton';
import { useLoginMutation } from '@/src/services/query/auth';
import { useRouter } from 'next/router';
import Footer from '@/src/components/Footer/Footer';
import Image from 'next/image';
import Head from 'next/head';
import { useAppDispatch } from '@/src/hooks';
import { mediaActions } from '@/src/store/redux/media/media';

const CustomInput = styled(TextField)({
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

const validationSchema = Yup.object().shape({
  email: Yup.string().required('Please enter a valid email or phone number.'),
  password: Yup.string()
    .min(4)
    .max(60)
    .required('Your password must contain between 4 and 60 characters.'),
});

const Login = () => {
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [showLearnMore, setShowLearnMore] = useState({
    opacity: 0,
    visibility: '',
  });

  const handleLearnMore = () => {
    setShowLearnMore({
      opacity: 1,
      visibility: 'visible',
    });
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const [login, { data, isLoading, error, isSuccess }] = useLoginMutation();

  const loginHandler = (credentials: FieldValues) => {
    login({
      email: credentials.email,
      password: credentials.password,
    });
  };
  useEffect(() => {
    if (isSuccess) {
      localStorage.setItem('user', JSON.stringify(data.user));
      dispatch(mediaActions.setMyListItems(data.user.favorites));
      router.push('/browse');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  return (
    <Fragment>
      <Head>
        <title>Projcet - Login</title>
      </Head>
      <div className={classes.login}>
        <header className={classes.header}>
          <Link href="/" className={classes.header__link}>
            <Image
              src="/images/myflix.png"
              alt="myflix logo"
              className={classes.header__logo}
              width={130}
              height={30}
            />
          </Link>
        </header>
        <div className={classes.login__imageContainer}>
          <Image
            width={2000}
            height={1000}
            className={classes.login__image}
            src="/images/hero-bg.jpg"
            alt="hero background inage"
          />
        </div>

        <div className={classes.login__container}>
          <div className={classes.form}>
            <h1 className={classes.form__header}>Sign In</h1>
            <form
              className={classes.form__body}
              onSubmit={handleSubmit((e) => loginHandler(e))}
            >
              <div className={classes['form__input-container']}>
                <CustomInput
                  className={classes.form__input}
                  {...register('email')}
                  type="text"
                  label="Email or Phone Number"
                  variant="filled"
                  size="small"
                  id="email"
                  autoComplete="on"
                  InputProps={{
                    disableUnderline: true,
                  }}
                />
              </div>
              {errors.email && (
                <p
                  className={classes.form__error}
                >{`${errors.email.message}`}</p>
              )}
              <div className={classes['form__input-container']}>
                <CustomInput
                  InputProps={{
                    disableUnderline: true,
                  }}
                  {...register('password')}
                  className={classes.form__input}
                  type="password"
                  label="Password"
                  id="password"
                  variant="filled"
                  size="small"
                  color="warning"
                  autoComplete="on"
                />
              </div>
              {errors.password && (
                <p
                  className={classes.form__error}
                >{`${errors.password.message}`}</p>
              )}
              {(error as any)?.data?.message && (
                <p className={classes.form__error}>
                  {(error as any).data.message}
                </p>
              )}
              <CustomButton
                className={classes.form__btn}
                color="error"
                variant="contained"
                type="submit"
                dynamicSize={false}
              >
                {isLoading ? (
                  <CircularProgress thickness={5} size={17} color="inherit" />
                ) : (
                  'Sign In'
                )}
              </CustomButton>
              <div className={classes.rememberme}>
                <FormControlLabel
                  control={
                    <Checkbox
                      sx={{
                        color: '#1976d2',
                      }}
                      defaultChecked
                    />
                  }
                  label={
                    <Typography className={classes.rememberme__text}>
                      Remember Me
                    </Typography>
                  }
                />
                <Link href="/">Need help?</Link>
              </div>
            </form>
          </div>
          <div className={classes['login__signup-now']}>
            <span>New to Myflix? </span>
            <Link href="/signup">Sign up Now.</Link>
          </div>
          <div className={classes.captcha}>
            <p className={classes.captcha__text}>
              This page is protected by Google reCAPTCHA to ensure you&#39;re
              not a bot.
              {!showLearnMore.visibility && (
                <Button onClick={handleLearnMore}>learn more.</Button>
              )}
            </p>

            <div ref={ref} className={classes.captcha__learnMore}>
              <p>
                The information collected by Google reCAPTCHA is subject to the
                Google Privacy Policy and Terms of Service, and is used for
                providing, maintaining and improving the reCAPTCHA service and
                for general security purposes (it is not used for personalised
                advertising by Google).
              </p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </Fragment>
  );
};

export default Login;
