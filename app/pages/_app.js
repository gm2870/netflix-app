import '../styles/styles.scss';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { red } from '@mui/material/colors';
import { AuthContextProvider } from '../src/store/context/auth/auth.mjs';
import store from '../src/store/redux/index.mjs';
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
    <AuthContextProvider>
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <Component {...pageProps} />
        </Provider>
      </ThemeProvider>
    </AuthContextProvider>
  );
}

export default MyApp;
