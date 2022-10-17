import { Router } from 'express';
import * as movieController from '../controllers/movieController.mjs';
const router = Router();
router.get('/', movieController.getMovies);
router.get('/:id', movieController.getMovie);
router.get('/search/:name', movieController.searchMovie);
router.get('/video/:movieId', movieController.httpStream);
router.get('/image/:path', movieController.imageStream);
export default router;
