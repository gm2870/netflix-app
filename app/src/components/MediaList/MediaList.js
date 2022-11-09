import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getMediaItems } from '../../store/redux/media/media-actions';
import MediaItem from '../MediaItem/MediaItem';
import classes from './MediaList.module.scss';
const MediaList = ({ sliderItems }) => {
  const dispatch = useDispatch();
  const items = useSelector((state) => state.media.mediaItems);

  useEffect(() => {
    if (!items) {
      dispatch(getMediaItems());
    }
  }, []);

  if (!items) return <div>data not found</div>;
  const content = sliderItems.visible.map((itemIndex) => (
    <div key={items[itemIndex].id} className={classes.media__item}>
      <MediaItem item={items[itemIndex]} />
    </div>
  ));
  return <div className={classes.media}>{content}</div>;
};

export default MediaList;
// https://blog.bitsrc.io/5-ways-to-avoid-react-component-re-renderings-90241e775b8c
