import { Router } from 'express';
import { protect } from '../controllers/authController.mjs';
const router = Router();
router.get('/browse', protect);

export default router;
