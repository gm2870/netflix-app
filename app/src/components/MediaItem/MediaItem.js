import { Modal } from '@mui/material';
import { useRef, useState } from 'react';
import Box from '@mui/material/Box';
import classes from './MediaItem.module.scss';
import PreviewModal from '../PreviewModal/PreviewModal';
import { useDispatch } from 'react-redux';
import { sliderActions } from '../../store/redux/slider/slider';

const MediaItem = ({ isFirst, isLast, index, underIndicator }) => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [offsetWidth, setOffsetWidth] = useState(null);
  const [left, setLeft] = useState(null);
  const [top, setTop] = useState(null);
  const boxRef = useRef();

  const handleOpen = () => {
    handleClose();
    if (!open) {
      setOffsetWidth(boxRef.current.offsetWidth);
      const left = boxRef.current.getBoundingClientRect().left;
      const top = boxRef.current.getBoundingClientRect().top;
      setLeft(left);
      setTop(top);
      setOpen(true);
    }
  };

  const handleClose = () => {
    setLeft(left);
    setTop(top);
    dispatch(sliderActions.setShowNext(false));
    setOpen(false);
  };

  return (
    <div className={classes.mediaItem}>
      <div ref={boxRef} onMouseEnter={handleOpen} className={classes.boxArt}>
        <img className={classes.boxArt__image} src={'/images/tiger.jpg'} />
      </div>
      <Modal hideBackdrop open={open && index !== 6}>
        <div style={{ outline: 'none' }}>
          <Box onMouseLeave={handleClose}>
            <PreviewModal
              index={index}
              isLast={isLast}
              isFirst={isFirst}
              left={left}
              top={top}
              offsetWidth={offsetWidth}
              show={open}
            ></PreviewModal>
          </Box>
        </div>
      </Modal>
    </div>
  );
};

export default MediaItem;
