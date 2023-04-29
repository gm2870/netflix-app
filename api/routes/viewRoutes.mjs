import { Router } from 'express';
import {
  authorizedRedirect,
  logout,
  unauthorizedRedirect,
} from '../controllers/authController.mjs';

const router = Router();
router.get('/browse', unauthorizedRedirect);

router.get('/', authorizedRedirect);
router.get('/login', authorizedRedirect);
router.get('/signup', authorizedRedirect);
router.get('/logout', unauthorizedRedirect, logout);
export default router;
