import { configureStore, ConfigureStoreOptions } from '@reduxjs/toolkit';
import uiSlice from './ui/ui';
import mediaSlice from './media/media.js';
import authSlice from './auth/auth-slice';
import sliderSlice from './slider/slider.js';
import { api } from '../../services/api';

export const createStore = (
  options?: ConfigureStoreOptions['preloadedState'] | undefined
) =>
  configureStore({
    reducer: {
      [api.reducerPath]: api.reducer,
      auth: authSlice.reducer,
      ui: uiSlice.reducer,
      media: mediaSlice.reducer,
      slider: sliderSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }).concat(api.middleware),
    ...options,
  });

export const store = createStore();

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
