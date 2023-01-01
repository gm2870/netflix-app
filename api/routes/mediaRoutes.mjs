import { Router } from 'express';
import * as mediaController from '../controllers/mediaController.mjs';
const router = Router();
router.get('/all', mediaController.getMediaItems);
router.get('/:id', mediaController.getMedia);
router.get('/search/:name', mediaController.searchMedia);
router.get('/video/:mediaId', mediaController.mediaStream);
router.get('/image/:id', mediaController.imageStream);
export default router;
