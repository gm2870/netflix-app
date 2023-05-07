import { sendReq, sendRequest } from '../../../services/api';
// import { sliderActions } from '../slider/slider';
import { mediaActions } from './media';
import { AppDispatch } from '../../redux/index';
import { Media } from './model';

export const searchTitle = (name: string) => {
  const config = {
    url: `/stream/search/${name}`,
  };
  const handleError = (err: string) => console.log(err);
  const setMedia = (media: Media[]) => {
    return media;
  };
  sendReq(config, setMedia, handleError);
};

export const getMedia = (id: number) => (dispatch: AppDispatch) => {
  const config = {
    url: `/media/${id}`,
  };
  const handleError = (err: string) => console.log(err);
  const setMedia = (media: Media[]) => console.log(media);
  sendRequest(config, dispatch, setMedia, handleError);
};

export const getCropSize = (id: number) => (dispatch: AppDispatch) => {
  const config = {
    url: `/media/crop-size/${id}`,
  };
  const handleError = (err: string) => console.log(err);
  const cropSize = (data: any) => {
    dispatch(mediaActions.setCropSize(data.blackBarHeight));
  };
  sendRequest(config, dispatch, cropSize, handleError);
};

export const resetCropSize = () => (dispatch: AppDispatch) =>
  dispatch(mediaActions.setCropSize(null));

export const getBillboardMedeia = (id: number) => (dispatch: AppDispatch) => {
  const config = {
    url: `/media/${id}`,
  };
  const handleError = (err: string) => console.log(err);
  const getBillboardMedia = (media: Media) => {
    dispatch(mediaActions.getBillboardMedia(media));
  };
  sendRequest(config, dispatch, getBillboardMedia, handleError);
};
