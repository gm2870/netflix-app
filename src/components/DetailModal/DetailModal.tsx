import { useAppDispatch } from '@/src/hooks';
import ModalContainer from '../ModalContainer/ModalContainer';
import TitleDetail from '../TitleDetail/TitleDetail';
import { mediaActions } from '@/src/store/redux/media/media';
import { uiActions } from '@/src/store/redux/ui/ui';
import { Media } from '@/src/store/redux/media/model';

const DetailModal = ({ detailPreviewItem }: { detailPreviewItem: Media }) => {
  const dispatch = useAppDispatch();

  const closeDetailModalHandler = () => {
    dispatch(mediaActions.setDetailPreviewItem(null));
    dispatch(uiActions.toggleShowDetailModal());
  };

  return (
    <ModalContainer
      onClose={closeDetailModalHandler}
      open={!!detailPreviewItem}
    >
      {detailPreviewItem && (
        <TitleDetail
          closeModal={closeDetailModalHandler}
          item={detailPreviewItem}
        />
      )}
    </ModalContainer>
  );
};

export default DetailModal;
