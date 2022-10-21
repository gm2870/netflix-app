const eventBus = {
  on(event, callBack) {
    document.addEventListener(event, (e) => callBack(e.detail));
  },
  dispatch(event, data) {
    document.dispatchEvent(new CustomEvent(event, { detail: data }));
  },
  remove(event, callBack) {
    document.removeEventListener(event, callBack);
  },
};

export default eventBus;
