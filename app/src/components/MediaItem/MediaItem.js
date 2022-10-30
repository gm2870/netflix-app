import { Modal } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import classes from './MediaItem.module.scss';
import PreviewModal from '../PreviewModal/PreviewModal';
import debounce from 'debounce';
const MediaItem = (props) => {
  const [open, setOpen] = useState(false);
  const [offsetWidth, setOffsetWidth] = useState(null);
  const [left, setLeft] = useState(null);
  const [top, setTop] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const boxRef = useRef();

  const handleOpen = () => {
    setModalOpen(true);
    // setTimeout(() => {
    if (!modalOpen) {
      setOffsetWidth(boxRef.current.offsetWidth);
      const left = boxRef.current.getBoundingClientRect().left;
      const top = boxRef.current.getBoundingClientRect().top;
      setLeft(left);
      setTop(top);

      setOpen(true);
    }
    // }, 250);
  };
  const handleClose = () => {
    console.log('handleClose');
    setModalOpen(false);
    setOpen(false);
  };
  return (
    <div className={classes.mediaItem}>
      <div ref={boxRef} onMouseEnter={handleOpen} className={classes.boxArt}>
        <img className={classes.boxArt__image} src={'/images/tiger.jpg'} />
      </div>
      <Modal hideBackdrop open={open}>
        <div style={{ outline: 'none' }}>
          <Box onMouseLeave={handleClose}>
            <PreviewModal
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
