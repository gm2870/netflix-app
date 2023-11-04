import { createSlice } from '@reduxjs/toolkit';
import { GenreWithMedia, Media } from './model';
type MediaState = {
  error: string;
  loading: boolean;
  mediaItems: GenreWithMedia[];
  myListItems: number[];
  billboardMedia: Media | null;
  playingBillboardTrailer: boolean;
  cropSize: number;
  detailPreviewItem: Media | null;
};
const initialState: MediaState = {
  error: '',
  loading: false,
  mediaItems: [],
  myListItems: [],
  billboardMedia: null,
  playingBillboardTrailer: false,
  cropSize: 0,
  detailPreviewItem: null,
};
const mediaSlice = createSlice({
  name: 'media',
  initialState,
  reducers: {
    getMediaItems: (state, action) => {
      state.mediaItems = action.payload;
    },
    setMyListItems: (state, action) => {
      state.myListItems = action.payload;
    },
    getBillboardMedia: (state, action) => {
      state.billboardMedia = action.payload;
      state.playingBillboardTrailer = true;
    },

    setMediaItems: (state, action) => {
      state.mediaItems = action.payload;
    },

    setDetailPreviewItem: (state, action) => {
      state.detailPreviewItem = action.payload;
      state.playingBillboardTrailer = false;
    },

    setCropSize: (state, action) => {
      state.cropSize = action.payload;
    },
  },
});
export const mediaActions = mediaSlice.actions;
export default mediaSlice;
