import { Modal } from '@mui/material';
import React, { Fragment, useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import classes from './MediaItem.module.scss';
import PreviewModal from '../PreviewModal/PreviewModal';
import { Media } from '../../store/redux/media/model';
import Image from 'next/image';

const MediaItem = ({
  item,
  underIndicator,
  isFirst,
  isLast,
}: {
  item: Media;
  underIndicator?: boolean;
  isFirst?: boolean;
  isLast?: boolean;
}) => {
  const [open, setOpen] = useState(false);
  const [closedModal, setClosedModal] = useState(false);

  const boxRef = useRef<HTMLDivElement>(null);
  let timeout: ReturnType<typeof setTimeout>;

  useEffect(() => {
    const divNode = boxRef.current!;

    const openModal = (event: any) => {
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
      clearTimeout(timeout);
      document.removeEventListener('mouseleave', hideModal);
      document.removeEventListener('mouseenter', openModal);
    };
  }, [boxRef]);

  const modalPosition = () => {
    const position = {
      position: 'absolute',
      outline: 'none',
      width: '0px',
      top: '0px',
      left: '0px',
    };
    const box = boxRef.current!;
    const offsetWidth = box.offsetWidth;
    const left = box.getBoundingClientRect().left;
    const top = box.getBoundingClientRect().top;
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
            <Image
              alt="item image"
              className={classes.boxArt__image}
              src={`https://image.tmdb.org/t/p/w1280${item.backdrop_path}`}
              fill={true}
            />
            <p className={classes.boxArt__title}>{item.title || item.name}</p>
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
