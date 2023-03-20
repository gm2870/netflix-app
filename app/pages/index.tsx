import Link from 'next/link';
import classes from './index.module.scss';
import { Button, TextField } from '@mui/material';
import AnimationCardComponent from '../src/components/animation-card/animation-card';
import { Fragment, useCallback } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import CustomButton from '../src/components/CustomButton/CustomButton';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { FieldValues, useForm } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from '../src/hooks';
import { checkEmail, logout } from '../src/store/redux/auth/auth-actions';
const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email('Please enter a valid email address.')
    .required('Email is required.'),
});

export default function Home() {
  const dispatch = useAppDispatch();
  const loading = useAppSelector((state) => state.ui.loading);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });
  const sendEmail = (e: FieldValues) => {
    dispatch(checkEmail(e.email));
  };

  const logOut = useCallback(() => {
    dispatch(logout());
  }, [dispatch]);

  return (
    <Fragment>
      <div className={classes.story}>
        <header className={classes.header}>
          <Link href="/">
            <a className={classes.header__link}>
              <img
                src="/images/netflix-logo.svg"
                alt="Netflix logo"
                className={classes.header__logo}
              />
            </a>
          </Link>

          <div className={classes['header__language']}>
            <div className={`${classes['select-container']} select-arrow`}>
              <select className={`${classes.header__select} ui-select mr-1`}>
                <option value="">English</option>
                <option value="">Persian</option>
              </select>
              <div className={classes['header__select-icon']}>
                <ArrowDropDownIcon
                  fontSize="small"
                  style={{
                    color: 'white',
                  }}
                />
              </div>
            </div>
            <div>
              <CustomButton
                dynamicSize={true}
                color="error"
                variant="contained"
              >
                <Link href="login" className="btn btn__red">
                  Sign In
                </Link>
              </CustomButton>
            </div>
          </div>
        </header>
        <div className={classes.hero}>
          <img className={classes.hero__image} src="/images/hero-bg.jpg" />
          <div className={classes.hero__gradient}></div>
          <div className={classes.hero__text}>
            <div className={classes.description}>
              <h1 className={classes.description__title}>
                Unlimited films, TV programmes and more.
              </h1>
              <h4 className={classes.description__subtitle}>
                Watch anywhere. Cancel anytime.
              </h4>
            </div>
            <form
              className={classes.form}
              onSubmit={handleSubmit((e) => sendEmail(e))}
            >
              <h4>
                Ready to watch? Enter your email to create or restart your
                membership.
              </h4>

              <div className={classes.form__email}>
                <div className={classes.input}>
                  <TextField
                    label="Email address"
                    variant="filled"
                    id="email"
                    type="email"
                    {...register('email')}
                  />
                </div>
                <div className={classes.cta}>
                  <Button
                    className={classes.form__button}
                    type="submit"
                    size="large"
                    color="error"
                    variant="contained"
                  >
                    {loading ? (
                      <CircularProgress color="inherit" />
                    ) : (
                      <span style={{ width: '100%' }}>
                        Get Started <i className="right-arrow"></i>
                      </span>
                    )}
                  </Button>
                </div>
              </div>
              {errors.email && (
                <p
                  className={classes.form__error}
                >{`${errors.email.message}`}</p>
              )}
            </form>
          </div>
        </div>
      </div>
      <AnimationCardComponent>
        <div className={classes['watch-tv']}>
          <div className={classes['watch-tv__text']}>
            <h1>Enjoy on your TV.</h1>
            <h2>
              Watch on smart TVs, PlayStation, Xbox, Chromecast, Apple TV,
              Blu-ray players and more.
            </h2>
          </div>
          <div className={classes['watch-tv__gif']}>
            <div className={classes['watch-tv__img']}>
              <img src="/images/watch-tv.png" />
              <div className={classes['watch-tv__video']}>
                <video autoPlay muted loop playsInline>
                  <source
                    src="/images/video-watch-tv.m4v"
                    type="video/mp4"
                  ></source>
                </video>
              </div>
            </div>
          </div>
        </div>
      </AnimationCardComponent>
      <AnimationCardComponent>
        <div className={classes['downloadAndWatch']}>
          <div className={classes['downloadAndWatch__text']}>
            <h1>Download your programmes to watch offline.</h1>
            <h2>
              Save your favourites easily and always have something to watch.
            </h2>
          </div>
          <div className={classes.downloadAndWatch__gif}>
            <div className={classes.downloadAndWatch__img}>
              <img src="/images/download-watch.jpg" />
              <div className={classes.downloader}>
                <div className={classes.downloader__img}>
                  <img src="/images/stranger-things.png" />
                </div>
                <div className={classes.downloader__text}>
                  <p>Stranger Things</p>
                  <span>Downloading...</span>
                </div>
                <div className={classes.downloader__animation}></div>
              </div>
            </div>
          </div>
        </div>
      </AnimationCardComponent>
    </Fragment>
  );
}
