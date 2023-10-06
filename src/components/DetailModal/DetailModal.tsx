import { useAppDispatch, useAppSelector } from "@/src/hooks";
import ModalContainer from "../ModalContainer/ModalContainer";
import TitleDetail from "../TitleDetail/TitleDetail";
import { mediaActions } from "@/src/store/redux/media/media";
import { uiActions } from "@/src/store/redux/ui/ui";

const DetailModal = ({genresWithTitles}: {genresWithTitles: any}) => {
    const dispatch = useAppDispatch();

    const detailPreviewItem = useAppSelector(
        (state) => state.media.detailPreviewItem
      );

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
            allItems={genresWithTitles || []}
            closeModal={closeDetailModalHandler}
            item={detailPreviewItem}
          />
        )}
      </ModalContainer>
    )
}

export default DetailModal;