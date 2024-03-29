import { Router } from 'express';
import * as mediaController from '../controllers/media/mediaController.mjs';
import { getVideoFromServer, mediaStream } from '../controllers/streamController.mjs';
const router = Router();
// router.use(mediaController.protect);
router.get('/all', mediaController.getAllTitles);
router.get('/billboard/general',mediaController.getGeneralBillboard);
router.get('/billboard/general/:mediaType/:mediaId',mediaStream);

router.get('/billboard/tv', mediaController.getTVBillboard);
router.get('/billboard/movie', mediaController.getMovieBillboard);

router.get('/movies/:titleId', mediaController.getMovieDetails);

router.get('/movies/genres/:genreId', mediaController.getAllMoviesByGenre);
router.get('/movies', mediaController.getAllMovies);

router.get(
  '/tv-shows/:titleId/season/:seasonNumber',
  mediaController.getSeasonInfo
);
router.get('/tv-shows/:titleId', mediaController.getTVDetails);

router.get('/tv-shows/genres/:genreId', mediaController.getAllTVShowsByGenre);
router.get('/tv-shows', mediaController.getAllTVShows);

router.get('/:type/:titleId', mediaController.getTitle);
router.post('/favorites', mediaController.addTitleToFavorites);
router.delete('/favorites', mediaController.RemoveFromFavorites);

router.get('/favorites', mediaController.getFavoritesList);

export default router;
