import { useAppDispatch } from '@/src/hooks';
import { getMyListFromStorage } from '@/src/services/storage/storage';
import { mediaActions } from '@/src/store/redux/media/media';
import { ReactNode, useEffect } from 'react';

const Layout = ({ children }: { children: ReactNode }) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const list = getMyListFromStorage();
    dispatch(mediaActions.setMyListItems(list));
  }, []);

  return <main>{children}</main>;
};

export default Layout;
