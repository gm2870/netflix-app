import { configureStore } from '@reduxjs/toolkit';
import uiSlice from './ui/ui';
import mediaSlice from './media/media';
import authSlice from './auth/auth-slice';
import sliderSlice from './slider/slider.js';

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    ui: uiSlice.reducer,
    media: mediaSlice.reducer,
    slider: sliderSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
