import { Router } from 'express';
import {
  authorizedRedirect,
  logout,
  unauthorizedRedirect,
} from '../controllers/authController.mjs';

const router = Router();
router.get('/login', authorizedRedirect);
router.get('/signup', authorizedRedirect);
router.get('/', authorizedRedirect);

router.get('/logout', unauthorizedRedirect, logout);

router.get('/search', unauthorizedRedirect);
export default router;
