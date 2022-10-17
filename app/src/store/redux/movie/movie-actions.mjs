import { sendRequest } from '../../../utils/api.mjs';
import { movieActions } from './movie.mjs';

export const getMovies = () => {
  return (dispatch) => {
    const config = {
      url: '/movies',
    };
    const handleError = (err) => console.log(err);
    const setMovies = (data) => console.log(data);
    sendRequest(config, dispatch, setMovies, handleError);
  };
};

export const getMovie = (id) => {
  return (dispatch) => {
    const config = {
      url: `/movies/${id}`,
    };
    const handleError = (err) => console.log(err);
    const setMovies = (data) => console.log(data);
    sendRequest(config, dispatch, setMovies, handleError);
  };
};

export const getBillboardMovie = (id) => {
  return (dispatch) => {
    const config = {
      url: `/movies/${id}`,
    };
    const handleError = (err) => console.log(err);
    const setBillboardMovie = (data) => {
      dispatch(movieActions.setBillboardMovie(data));
    };
    sendRequest(config, dispatch, setBillboardMovie, handleError);
  };
};
