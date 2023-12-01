import { useAppDispatch, useAppSelector } from '@/src/hooks';
import { getMyListFromStorage } from '@/src/services/storage/storage';
import { mediaActions } from '@/src/store/redux/media/media';
import { ReactNode, useEffect } from 'react';
import DetailModal from '../DetailModal/DetailModal';

const Layout = ({ children }: { children: ReactNode }) => {
  const dispatch = useAppDispatch();

  const detailPreviewItem = useAppSelector(
    (state) => state.media.detailPreviewItem
  );

  useEffect(() => {
    const list = getMyListFromStorage();
    dispatch(mediaActions.setMyListItems(list));
  }, [dispatch]);

  return (
    <main>
      {children}
      {detailPreviewItem && (
        <DetailModal detailPreviewItem={detailPreviewItem} />
      )}
    </main>
  );
};

export default Layout;
