import Movie from '../models/movieModel.mjs';
import axios from 'axios';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { getSrcWithVideoId, getVideoSrc } from '../utils/urlGrabber.mjs';
import {
  needsSrcUpdate,
  searchMovieByName,
} from '../controllers/movieController.mjs';
import catchAsync from '../utils/catchAsync.mjs';
import AppError from '../utils/appError.mjs';
dotenv.config({ path: '../config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose.connect(DB);

const movies = [
  'red-notice',
  'avengers-endgame',
  'spiderman-no-way-home',
  'the-batman',
  'uncharted',
  'irishman',
  'scream',
  'the-lost-city',
  'hustle',
  'bullet-train',
  'joker',
];

const importMovies = async () => {
  for (const name of movies) {
    const movie = await searchMovieByName(name);
    await Movie.create(movie);
  }
  process.exit();
};
const deleteMovies = async () => {
  await Movie.deleteMany();
  try {
    await Movie.deleteMany();
  } catch (error) {
    return new AppError(error.message || 'Something went wrong.', 500);
  }
  process.exit();
};

export const checkAndUpdateSrc = async () => {
  const movies = await Movie.find();
  for (const movie of movies) {
    if (
      !movie.video_src['1080p'] ||
      !movie.video_src['480p'] ||
      needsSrcUpdate(movie.video_src['480p']) ||
      needsSrcUpdate(movie.video_src['1080p'])
    ) {
      updateSrc(movie);
    }
  }
  process.exit();
};
export const forceSrcUpdate = catchAsync(async () => {
  const movies = await Movie.find();
  let i = 0;
  for (const movie of movies) {
    console.log(movie.title);
    await updateSrc(movie);
    console.log(movie.video_src);

    i++;
  }
  if (i === movies.length) process.exit();
});

export const updateSrc = async (movie) => {
  let HDSrc, SDSrc, videoData;
  if (movie.video_movie_id) {
    SDSrc = await getSrcWithVideoId(movie.video_movie_id, 480);
    HDSrc = await getSrcWithVideoId(movie.video_movie_id, 1080);
    videoData = {
      '480p': SDSrc,
      '1080p': HDSrc,
    };
  } else {
    videoData = await getVideoSrc(movie.video_title_id, 1080);
  }
  if (!videoData || !videoData['480p']) return;
  return await Movie.findOneAndUpdate(
    { id: movie.id },
    {
      video_src: {
        '480p': videoData['480p'],
        '1080p': videoData['1080p'],
      },
      video_movie_id: videoData.videoId,
    }
  );
};
const updateMovie = async (id) => {
  const movie = await Movie.findOne({ id });
  console.log(movie.title);
  await updateSrc(movie);
  process.exit();
};
if (process.argv[2] === '--import') {
  importMovies();
} else if (process.argv[2] === '--delete') {
  deleteMovies();
} else if (process.argv[2] === '--update-src') {
  forceSrcUpdate();
} else if (process.argv[2] === '--update') {
  updateMovie(1396);
}
