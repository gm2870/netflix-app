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
export const getUiConfig = (id) => {
  return (dispatch) => {
    const config = {
      url: `/media/ui-config/${id}`,
    };
    const handleError = (err) => console.log(err);
    const uiConfig = (data) => {
      console.log(data);
      dispatch(sliderActions.setUiConfig(data));
    };
    sendRequest(config, dispatch, uiConfig, handleError);
  };
};
export const getImageSrcFromStream = (id) => {
  fetch(`http://localhost:8001/api/v1/media/image/${id}`)
    // Retrieve its body as ReadableStream
    .then((response) => {
      const reader = response.body.getReader();
      return new ReadableStream({
        start(controller) {
          return pump();
          function pump() {
            return reader.read().then(({ done, value }) => {
              // When no more data needs to be consumed, close the stream
              if (done) {
                controller.close();
                return;
              }
              // Enqueue the next data chunk into our target stream
              controller.enqueue(value);
              return pump();
            });
          }
        },
      });
    })
    // Create a new response out of the stream
    .then((stream) => new Response(stream))
    // Create an object URL for the response
    .then((response) => response.blob())
    .then((blob) => URL.createObjectURL(blob))
    // Update image
    .then((url) => console.log(url))
    .catch((err) => console.error(err));
};

export const getBillboardMedeia = (id) => {
  return (dispatch) => {
    const config = {
      url: `/media/${id}`,
    };
    const handleError = (err) => console.log(err);
    const getBillboardMedia = (data) => {
      dispatch(mediaActions.getBillboardMedia(data));
    };
    sendRequest(config, dispatch, getBillboardMedia, handleError);
  };
};
