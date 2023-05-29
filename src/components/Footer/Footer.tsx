import Link from 'next/link';
import classes from './Footer.module.scss';
export const Footer = () => {
  return (
    <div className={classes.footer}>
      <div className={classes.footer__body}>
        <p className={classes.footer__top}>Questions? Call 0800-022-5173</p>
        <ul className={classes.footer__links}>
          <li className={classes.footer__linkItem}>
            <Link href="/">FAQ</Link>
          </li>
          <li className={classes.footer__linkItem}>
            <Link href="/">Help Center</Link>
          </li>
          <li className={classes.footer__linkItem}>
            <Link href="/">Terms of Use</Link>
          </li>
          <li className={classes.footer__linkItem}>
            <Link href="/">Privacy</Link>
          </li>
          <li className={classes.footer__linkItem}>
            <Link href="/">Cookie Preferences</Link>
          </li>
          <li className={classes.footer__linkItem}>
            <Link href="/">Corporate Information</Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Footer;
