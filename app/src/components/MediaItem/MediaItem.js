import { Modal } from '@mui/material';
import { Fragment, useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import classes from './MediaItem.module.scss';
import { useDispatch } from 'react-redux';
import PreviewModal from '../PreviewModal/PreviewModal';

const MediaItem = ({ item, underIndicator, isFirst, isLast }) => {
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);
  const [closedModal, setClosedModal] = useState(false);

  const boxRef = useRef();
  let timeout = null;

  useEffect(() => {
    const divNode = boxRef.current;

    const openModal = (event) => {
      if (divNode && divNode.contains(event.target)) {
        timeout = setTimeout(() => {
          if (!closedModal) {
            setOpen(true);
            setClosedModal(false);
          }
        }, 1000);
      }
    };

    const hideModal = () => {
      clearTimeout(timeout);
      setClosedModal(true);
    };
    divNode.addEventListener('mouseenter', openModal);

    divNode.addEventListener('mouseleave', hideModal);

    return () => {
      document.removeEventListener('mouseleave', openModal);
    };
  }, [boxRef]);
  const modalPosition = () => {
    const position = {
      position: 'absolute',
      outline: 'none',
    };
    const offsetWidth = boxRef.current.offsetWidth;
    const left = boxRef.current.getBoundingClientRect().left;
    const top = boxRef.current.getBoundingClientRect().top;
    position.width = `${offsetWidth * 1.5}px`;
    position.top = `${top - offsetWidth * 0.4}px`;
    if (isFirst) {
      position.left = `${left}px`;
    } else if (isLast) {
      position.left = `${left - offsetWidth * 0.5}px`;
    } else {
      position.left = `${left - offsetWidth * 0.25}px`;
    }
    return position;
  };
  const hideModal = () => {
    clearTimeout(timeout);
    setOpen(false);
  };
  return (
    <Fragment>
      {item && (
        <div className={classes.mediaItem}>
          <div ref={boxRef} className={classes.boxArt}>
            <img
              className={classes.boxArt__image}
              src={`http://localhost:8001/api/v1/media/image/${item.id}`}
            />
          </div>
          <Modal hideBackdrop open={open && !underIndicator}>
            <Box sx={modalPosition}>
              <PreviewModal
                item={item}
                show={open}
                hideModal={hideModal}
              ></PreviewModal>
            </Box>
          </Modal>
        </div>
      )}
    </Fragment>
  );
};

export default MediaItem;
