import { Router } from 'express';
import * as mediaController from '../controllers/media/mediaController.mjs';
const router = Router();
router.get('/all', mediaController.getAllTitles);
router.get('/billboard/general', mediaController.getGeneralBillboard);

router.get('/billboard/tv', mediaController.getTVBillboard);
router.get('/billboard/movie', mediaController.getMovieBillboard);

router.get('/movies', mediaController.getAllMovies);
router.get('/movies/:genreId', mediaController.getAllMoviesByGenre);

router.get('/tv-shows', mediaController.getAllTVShows);
router.get('/tv-shows/:genreId', mediaController.getAllTVShowsByGenre);

export default router;
