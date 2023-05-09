import { Router } from 'express';
import * as mediaController from '../controllers/media/mediaController.mjs';
const router = Router();
router.get('/all', mediaController.getAllTitles);
router.get('/movies', mediaController.getAllMovies);
router.get('/movies/:genreId', mediaController.getAllMoviesByGenre);

router.get('/tv-shows', mediaController.getAllTVShows);
router.get('/tv-shows/:genreId', mediaController.getAllTVShowsByGenre);

export default router;
