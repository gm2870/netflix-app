import '../styles/styles.scss';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { store } from '../src/store/redux/index';
import { Provider } from 'react-redux';
import type { AppProps } from 'next/app';
import React from 'react';

const theme = createTheme({
  palette: {
    error: {
      main: '#f40612',
    },
  },
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <Component {...pageProps} />
      </Provider>
    </ThemeProvider>
  );
}

export default MyApp;
