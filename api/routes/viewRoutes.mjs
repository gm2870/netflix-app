import { Router } from 'express';
import * as authController from '../controllers/authController.mjs';
const router = Router();
router.get('/browse', authController.protect);
