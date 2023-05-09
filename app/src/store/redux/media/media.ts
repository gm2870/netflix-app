import { createSlice } from '@reduxjs/toolkit';
import { GenreWithMedia, Media } from './model';
type MediaState = {
  error: string;
  loading: boolean;
  mediaItems: GenreWithMedia[];
  billboardMedia: Media | null;
  playingBillboardTrailer: boolean;
  cropSize: number;
};
const initialState: MediaState = {
  error: '',
  loading: false,
  mediaItems: [],
  billboardMedia: null,
  playingBillboardTrailer: false,
  cropSize: 0,
};
const mediaSlice = createSlice({
  name: 'media',
  initialState,
  reducers: {
    getMediaItems: (state, action) => {
      state.mediaItems = action.payload;
    },
    getBillboardMedia: (state, action) => {
      state.billboardMedia = action.payload;
      state.playingBillboardTrailer = true;
    },
    setMediaItems: (state, action) => {
      state.mediaItems = action.payload;
    },
    setCropSize: (state, action) => {
      state.cropSize = action.payload;
    },
  },
});
export const mediaActions = mediaSlice.actions;
export default mediaSlice;
