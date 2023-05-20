import { Modal } from '@mui/material';
import React, { Fragment, useReducer, useRef } from 'react';
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
  const getSX = () => {
    const sx = {
      position: 'absolute',
      outline: 'none !important',
      width: '0px',
      top: '0px',
      left: '0px',
      transition: 'all 1s',
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
  const reducer = (
    state: any,
    action: {
      type: string;
      payload?: any;
    }
  ) => {
    console.log(action.type);
    switch (action.type) {
      case 'open':
        return {
          open: true,
          sx: action.payload,
        };

      case 'close':
        return {
          open: false,
          sx: {},
        };
      default:
        return state;
    }
  };
  const [modalConfig, setModalConfig] = useReducer(reducer, {
    open: false,
    sx: {},
  });
  const boxRef = useRef<HTMLDivElement>(null);
  const openModal = () => {
    console.log(underIndicator);
    if (underIndicator) {
      return;
    }
    setModalConfig({ type: 'open', payload: getSX() });
  };
  const hideModal = () => {
    setModalConfig({ type: 'close' });
  };

  return (
    <Fragment>
      <div className={classes.mediaItem}>
        <div ref={boxRef} className={classes.boxArt}>
          <Image
            onMouseEnter={openModal}
            alt="item image"
            className={classes.boxArt__image}
            src={`https://image.tmdb.org/t/p/w1280${item.backdrop_path}`}
            fill={true}
          />
          <p className={classes.boxArt__title}>{item.title || item.name}</p>
        </div>
      </div>

      <Modal
        container={document.getElementById('content')}
        className={classes.modal}
        sx={getSX}
        hideBackdrop
        open={modalConfig.open}
      >
        <PreviewModal
          item={item}
          show={modalConfig.open}
          hideModal={hideModal}
        ></PreviewModal>
      </Modal>
    </Fragment>
  );
};

export default MediaItem;
