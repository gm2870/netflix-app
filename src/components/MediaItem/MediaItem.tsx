import { Box, Portal } from '@mui/material';
import React, { Fragment, useRef, useState } from 'react';
import classes from './MediaItem.module.scss';
import PreviewModal from '../PreviewModal/PreviewModal';
import { Media } from '../../store/redux/media/model';
import Image from 'next/image';
import { uiActions } from '@/src/store/redux/ui/ui';
import { useAppDispatch } from '@/src/hooks';

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
  const dispatch = useAppDispatch();
  const getSX = () => {
    const sx = {
      position: 'absolute',
      outline: 'none !important',
      width: '0px',
      top: '0px',
      left: '0px',
      zIndex: '555',
    };

    const box = boxRef.current!;
    const offsetWidth = box.offsetWidth;
    const left = box.getBoundingClientRect().left;
    const top = box.getBoundingClientRect().top + window.scrollY;
    sx.width = `${offsetWidth * 1.5}px`;
    sx.top = `${top - offsetWidth * 0.4}px`;
    if (isFirst) {
      sx.left = `${left}px`;
    } else if (isLast) {
      sx.left = `${left - offsetWidth * 0.5}px`;
    } else {
      sx.left = `${left - offsetWidth * 0.25}px`;
    }
    return sx;
  };

  const [open, setOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);
  const openModal = () => {
    if (underIndicator) {
      return;
    }
    setOpen(true);
  };

  const hideModal = () => {
    dispatch(uiActions.setBillnoardPlaying(true));
    setOpen(false);
  };

  return (
    <Fragment>
      <div onMouseOver={openModal} ref={boxRef} className={classes.mediaItem}>
        <div className={classes.boxArt}>
          {item.backdrop_path && (
            <Image
              alt="item image"
              className={classes.boxArt__image}
              src={`https://image.tmdb.org/t/p/w1280${item.backdrop_path}`}
              fill={true}
            />
          )}
          <p className={classes.boxArt__title}>{item.title || item.name}</p>
        </div>
      </div>

      {open && (
        <Portal container={document.getElementById('modalContainer')}>
          <Box sx={getSX}>
            <PreviewModal
              item={item}
              show={open}
              hideModal={hideModal}
            ></PreviewModal>
          </Box>
        </Portal>
      )}
    </Fragment>
  );
};

export default MediaItem;
