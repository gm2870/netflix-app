import '../styles/styles.scss';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { store } from '../src/store/redux/index.ts';
import { Provider } from 'react-redux';

const theme = createTheme({
  palette: {
    error: {
      main: '#f40612',
    },
    red: {
      main: '#64748B',
      contrastText: '#fff',
    },
  },
});

function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <Component {...pageProps} />
      </Provider>
    </ThemeProvider>
  );
}

export default MyApp;
