import { Modal } from '@mui/material';
import { Fragment, useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import classes from './MediaItem.module.scss';
import { useDispatch } from 'react-redux';
import MediaCard from '../PreviewModal/PreviewModal';

const MediaItem = ({ item, underIndicator, isFirst, isLast }) => {
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);
  const [closedModal, setClosedModal] = useState(false);

  const [left, setLeft] = useState(null);
  const [top, setTop] = useState(null);
  const [offsetWidth, setOffsetWidth] = useState(null);

  const boxRef = useRef();
  let timeout = null;

  useEffect(() => {
    const divNode = boxRef.current;

    const handleEvent = (event) => {
      if (divNode) {
        if (divNode.contains(event.target)) {
          setOffsetWidth(boxRef.current.offsetWidth);
          const left = boxRef.current.getBoundingClientRect().left;
          const top = boxRef.current.getBoundingClientRect().top;
          setLeft(left);
          setTop(top);
          timeout = setTimeout(() => {
            if (!closedModal) {
              setOpen(true);
              setClosedModal(false);
            }
          }, 1000);
        }
      }
    };

    const hideModal = () => {
      clearTimeout(timeout);
      setClosedModal(true);
    };
    divNode.addEventListener('mouseenter', handleEvent);

    divNode.addEventListener('mouseleave', hideModal);

    return () => {
      document.removeEventListener('mouseleave', handleEvent);
    };
  }, [boxRef]);
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
            <Box>
              <MediaCard
                isFirst={isFirst}
                isLast={isLast}
                item={item}
                left={left}
                top={top}
                offsetWidth={offsetWidth}
                show={open}
                hideModal={hideModal}
              ></MediaCard>
            </Box>
          </Modal>
        </div>
      )}
    </Fragment>
  );
};

export default MediaItem;
