import { Modal } from '@mui/material';
import { Fragment, useState } from 'react';
import Box from '@mui/material/Box';
import classes from './MediaItem.module.scss';
import PreviewModal from '../PreviewModal/PreviewModal';
const MediaItem = () => {
  const [open, setOpen] = useState(false);
  const style = {
    width: 440,
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  return (
    <div className={classes.mediaItem}>
      <div onMouseEnter={handleOpen} className={classes.boxArt}>
        <img className={classes.boxArt__image} src={'/images/tiger.jpg'} />
      </div>
      <Modal hideBackdrop open={open}>
        <div style={{ outline: 'none' }}>
          <Box sx={style} onMouseLeave={handleClose}>
            <PreviewModal show={open}></PreviewModal>
          </Box>
        </div>
      </Modal>
    </div>
  );
};

export default MediaItem;
