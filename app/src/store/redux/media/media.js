import { createSlice } from '@reduxjs/toolkit';

const mediaSlice = createSlice({
  name: 'media',
  initialState: {
    error: null,
    loading: false,
    mediaItems: null,
    billboardMedia: null,
    playingBillboardTrailer: false,
    uiConfig: null,
  },
  reducers: {
    getMediaItems: (state, action) => {
      state.mediaItems = action.payload;
    },
    getBillboardMedia: (state, action) => {
      state.billboardMedia = action.payload;
      state.playingBillboardTrailer = true;
    },
    // setMediaItems: (state, action) => {
    //   state.mediaItems = action.payload;
    // },
    setUiConfig: (state, action) => {
      state.uiConfig = action.payload;
    },
  },
});
export const mediaActions = mediaSlice.actions;
export default mediaSlice;
