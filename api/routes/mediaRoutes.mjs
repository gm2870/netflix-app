import { Router } from 'express';
import * as mediaController from '../controllers/mediaController.mjs';
import { getAllTitles } from '../controllers/genre/genreController.mjs';
const router = Router();
router.get('/all', getAllTitles);
router.get('/:id', mediaController.getMedia);
router.get('/search/:name', mediaController.searchMedia);
router.get('/movie/:genreId', mediaController.searchMedia);

router.get('/video/:mediaId', mediaController.mediaStream);
router.get('/crop-size/:id', mediaController.getVideoCropSize);
router.get('/image/:id', mediaController.imageStream);

export default router;
