import { Router } from 'express';
import {
  authorizedRedirect,
  unauthorizedRedirect,
} from '../controllers/authController.mjs';

const router = Router();

router.get('/', authorizedRedirect);
router.get('/login', authorizedRedirect);
router.get('/signup', authorizedRedirect);
router.get('/browse', unauthorizedRedirect);

export default router;
