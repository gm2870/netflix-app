import { Router } from 'express';
import * as authController from '../controllers/authController.mjs';
const router = Router();
// router.use(authController.handleRedirect);
router.post('/login', authController.handleRedirect, authController.login);
router.post('/signup', authController.signup);
router.post('/check-email', authController.checkEmail);
router.get('/refreshtoken', authController.refreshToken);
export default router;
