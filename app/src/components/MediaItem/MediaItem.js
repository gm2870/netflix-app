import { Modal } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import classes from './MediaItem.module.scss';
import PreviewModal from '../PreviewModal/PreviewModal';
import Grow from '@mui/material/Grow';
import Zoom from '@mui/material/Zoom';
import Slide from '@mui/material/Slide';
import Fade from '@mui/material/Fade';

const MediaItem = () => {
  const [open, setOpen] = useState(false);
  const [offsetWidth, setOffsetWidth] = useState(null);
  const [left, setLeft] = useState(null);
  const [top, setTop] = useState(null);
  const boxRef = useRef();
  useEffect(() => {
    setOffsetWidth(boxRef.current.offsetWidth);
    const width = boxRef.current.getBoundingClientRect().width * 0.25;
    const left = boxRef.current.getBoundingClientRect().left;
    const top = boxRef.current.getBoundingClientRect().top;
    setLeft(left);
    setTop(top);
  });
  const handleOpen = () => {
    setTimeout(() => {
      // setModalWidth(boxRef.current.offsetWidth * 1.5);
      setOpen(true);
    }, 500);
  };
  const handleClose = () => setOpen(false);
  return (
    <div className={classes.mediaItem}>
      <div ref={boxRef} onMouseEnter={handleOpen} className={classes.boxArt}>
        <img className={classes.boxArt__image} src={'/images/tiger.jpg'} />
      </div>
      <Modal hideBackdrop open={open}>
        <div style={{ outline: 'none' }}>
          {/* <Fade in={open}> */}
          <Box onMouseLeave={handleClose}>
            <PreviewModal
              left={left}
              top={top}
              offsetWidth={offsetWidth}
              show={open}
            ></PreviewModal>
          </Box>
          {/* </Fade> */}
        </div>
      </Modal>
    </div>
  );
};

export default MediaItem;
