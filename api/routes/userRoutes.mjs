import { Router } from 'express';
import * as userController from '../controllers/userController.mjs';
import * as authController from '../controllers/authController.mjs';
const router = Router();

router.use(authController.protect);

router.get('/currentUser', userController.getMe, userController.getUser);

export default router;
