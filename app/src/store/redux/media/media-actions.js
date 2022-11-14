import { sendRequest } from '../../../utils/api.mjs';
import { sliderActions } from '../slider/slider.js';
import { mediaActions } from './media.js';

export const getMediaItems = () => {
  return (dispatch) => {
    const config = {
      url: '/media/all',
    };
    const handleError = (err) => console.log(err);
    const setMediaItems = (data) => {
      dispatch(sliderActions.getAllItems(data));
    };
    sendRequest(config, dispatch, setMediaItems, handleError);
  };
};

export const getMedia = (id) => {
  return (dispatch) => {
    const config = {
      url: `/media/${id}`,
    };
    const handleError = (err) => console.log(err);
    const setMedia = (data) => console.log(data);
    sendRequest(config, dispatch, setMedia, handleError);
  };
};

export const getBillboardMovie = (id) => {
  return (dispatch) => {
    const config = {
      url: `/media/${id}`,
    };
    const handleError = (err) => console.log(err);
    const setBillboardMovie = (data) => {
      dispatch(mediaActions.setBillboardMovie(data));
    };
    sendRequest(config, dispatch, setBillboardMovie, handleError);
  };
};
