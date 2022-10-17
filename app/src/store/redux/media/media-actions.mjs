import { sendRequest } from '../../../utils/api.mjs';
import { mediaActions } from './media.mjs';

// export const getMovies = () => {
//   return (dispatch) => {
//     const config = {
//       url: '/movies',
//     };
//     const handleError = (err) => console.log(err);
//     const setMovies = (data) => console.log(data);
//     sendRequest(config, dispatch, setMovies, handleError);
//   };
// };

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
      dispatch(movieActions.setBillboardMovie(data));
    };
    sendRequest(config, dispatch, setBillboardMovie, handleError);
  };
};
