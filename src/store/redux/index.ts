import { configureStore } from '@reduxjs/toolkit';
import uiSlice from './ui/ui';
import mediaSlice from './media/media';
import authSlice from './auth/auth-slice';
import searchSlice from './search/search';

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    ui: uiSlice.reducer,
    media: mediaSlice.reducer,
    search: searchSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
