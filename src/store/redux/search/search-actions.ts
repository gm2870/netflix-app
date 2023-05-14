import { AppDispatch } from '..';
import { sendRequest } from '../../../services/api';
import { Media } from '../media/model';
import { setResult } from './search';
export const searchTitle = (name: string) => (dispatch: AppDispatch) => {
  const config = {
    url: `/stream/search/${name}`,
  };
  const handleError = (err: string) => console.log(err);
  const setMedia = (media: Media[]) => {
    dispatch(setResult(media));
  };
  sendRequest(config, dispatch, setMedia, handleError);
};
