import { configureStore } from '@reduxjs/toolkit';
import uiSlice from './ui/ui';
import mediaSlice from './media/media.js';
import authSlice from './auth/auth-slice';
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

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
