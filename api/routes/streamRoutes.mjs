import { Router } from 'express';
import * as streamController from '../controllers/streamController.mjs';
const router = Router();

router.get('/:id', streamController.getMedia);
router.get('/search/:name', streamController.searchMedia);
router.get('/movie/:genreId', streamController.searchMedia);

router.get('/:mediaType/video/:mediaId', streamController.mediaStream);
router.get('/crop-size/:type/:id', streamController.getVideoCropSize);
router.get('/image/:backdropPath', streamController.imageStream);

export default router;
