import { Router } from 'express';
import { handleRedirect, protect } from '../controllers/authController.mjs';
const router = Router();
router.get('/', handleRedirect);
router.get('/login', handleRedirect);
router.get('/browse', protect);
export default router;
