import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCurrentUser } from '../../store/redux/auth/auth-actions';
const RouterGaurd = ({ children }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    authCheck(router.asPath);
    const hideContent = () => setAuthorized(false);
    router.events.on('routeChangeStart', hideContent);
    router.events.on('routeChangeComplete', authCheck);
    return () => {
      router.events.off('routeChangeStart', hideContent);
      router.events.off('routeChangeComplete', authCheck);
    };
  }, []);
  const authCheck = (url) => {
    const publicPaths = ['/login', '/signup'];
    if (user && publicPaths.includes(url)) {
      setAuthorized(false);
      router.push('/browse');
    } else if (!user && !publicPaths.includes(url)) {
      if (url === '/') {
        setAuthorized(true);
      } else {
        setAuthorized(false);
        router.push('/login');
      }
    } else setAuthorized(true);
    dispatch(getCurrentUser());
  };
  return authorized && children;
};

export default RouterGaurd;
