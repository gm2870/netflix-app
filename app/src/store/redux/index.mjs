import { configureStore } from '@reduxjs/toolkit';
import signupSlice from './signup/signup.mjs';
import uiSlice from './ui/ui.mjs';
import loginSlice from './login/login.mjs';
import movieSlice from './movie/movie.mjs';

const store = configureStore({
  reducer: {
    signup: signupSlice.reducer,
    ui: uiSlice.reducer,
    login: loginSlice.reducer,
    movie: movieSlice.reducer,
  },
});

export default store;
