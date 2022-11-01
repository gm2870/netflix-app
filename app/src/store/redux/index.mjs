import { configureStore } from '@reduxjs/toolkit';
import uiSlice from './ui/ui.mjs';
import mediaSlice from './media/media.js';
import authSlice from './auth/auth-slice.js';
import sliderSlice from './slider/slider.js';

const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    ui: uiSlice.reducer,
    media: mediaSlice.reducer,
    slider: sliderSlice.reducer,
  },
});

export default store;
