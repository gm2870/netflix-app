import { configureStore } from '@reduxjs/toolkit';
import uiSlice from './ui/ui';
import mediaSlice from './media/media';
import searchSlice from './search/search';
import { mediaApi } from '@/src/services/query/media';
import { authApi } from '@/src/services/query/auth';
import authSlice from './auth/auth-slice';

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    auth: authSlice.reducer,
    ui: uiSlice.reducer,
    media: mediaSlice.reducer,
    search: searchSlice.reducer,
    [mediaApi.reducerPath]: mediaApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([mediaApi.middleware, authApi.middleware]),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
