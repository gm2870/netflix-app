import { Router } from 'express';
import * as authController from '../controllers/authController.mjs';
const router = Router();

router.post('/login', authController.login);
router.post('/signup', authController.signup);
router.post('/check-email', authController.checkEmail);

export default router;
