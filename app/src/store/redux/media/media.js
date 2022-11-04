import { createSlice } from '@reduxjs/toolkit';

const mediaSlice = createSlice({
  name: 'media',
  initialState: {
    error: null,
    loading: false,
    mediaItems: null,
    billboardMovie: null,
    playingBillboardTrailer: false,
  },
  reducers: {
    getMovies: (state, action) => {
      state.movies = action.payload;
    },
    setBillboardMovie: (state, action) => {
      state.billboardMovie = action.payload;
      state.playingBillboardTrailer = true;
    },
    setMediaItems: (state, action) => {
      state.mediaItems = action.payload;
    },
  },
});
export const mediaActions = mediaSlice.actions;
export default mediaSlice;
