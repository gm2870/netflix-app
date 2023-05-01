import { Router } from 'express';
const router = Router();

import {
  getMovieGenres,
  getTVGenres,
} from '../controllers/media/genre/genreController.mjs';

router.get('/movie/list', getMovieGenres);
router.get('/tv/list', getTVGenres);

export default router;
