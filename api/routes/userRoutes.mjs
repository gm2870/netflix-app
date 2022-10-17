import { Router } from 'express';
import * as userController from '../controllers/userController.mjs';
import * as authController from '../controllers/authController.mjs';
const router = Router();

router.post('/login', authController.login);
router.post('/signup', authController.signup);
router.post('/check-email', userController.checkEmail);
router.get('/me', authController.protect);
export default router;
