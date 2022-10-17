import { createSlice } from '@reduxjs/toolkit';

const movieSlice = createSlice({
  name: 'movie',
  initialState: {
    error: null,
    loading: false,
    movies: null,
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
  },
});
export const movieActions = movieSlice.actions;
export default movieSlice;
