import { configureStore } from '@reduxjs/toolkit';
import signupSlice from './signup/signup.mjs';
import uiSlice from './ui/ui.mjs';
import loginSlice from './login/login.mjs';
import mediaSlice from './media/media.mjs';

const store = configureStore({
  reducer: {
    signup: signupSlice.reducer,
    ui: uiSlice.reducer,
    login: loginSlice.reducer,
    media: mediaSlice.reducer,
  },
});

export default store;
