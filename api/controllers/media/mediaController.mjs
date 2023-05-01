import Genre from '../../models/genreModel.mjs';
import Movie from '../../models/media/movieModel.mjs';
import TV from '../../models/media/tvModel.mjs';
import catchAsync from '../../utils/catchAsync.mjs';

export const getAllTitles = catchAsync(async (req, res) => {
  const genres = await Genre.find();
  const movies = await Movie.find();
  const tvShows = await TV.find();
  let movieList = [];
  let tvList = [];
  for (const genre of genres) {
    movieList = movies.filter((m) => m.genre_ids.includes(genre.id));
    tvList = tvShows.filter((m) => m.genre_ids.includes(genre.id));
  }

  res.status(200).json({
    status: 'success',
    data: [...movieList, ...tvList],
  });
});

export const getAllMovies = catchAsync(async (req, res) => {
  const genres = await Genre.find();
  const movieGenres = genres.filter((g) => g.types.includes('movie'));
  const movies = await Movie.find();
  const collection = {};
  for (const genre of movieGenres) {
    collection[genre.name] = movies.filter((m) => m.genre_ids[0] === genre.id);
  }

  res.status(200).json({
    status: 'success',
    data: collection,
  });
});
export const getAllMoviesByGenre = catchAsync(async (req, res) => {
  const genreId = req.params.genreId;
  const movies = await Movie.find();
  let movieList = [];
  movieList = movies.filter((m) => m.genre_ids.includes(genreId));

  res.status(200).json({
    status: 'success',
    data: movieList,
  });
});
export const getAllTVShows = catchAsync(async (req, res) => {
  const genres = await Genre.find();
  const tvGenres = genres.filter((g) => g.types.includes('tv'));

  const tvShows = await TV.find();
  const collection = {};
  for (const genre of tvGenres) {
    collection[genre.name] = tvShows.filter((m) => m.genre_ids[0] === genre.id);
  }

  res.status(200).json({
    status: 'success',
    data: collection,
  });
});

export const getAllTVShowsByGenre = catchAsync(async (req, res) => {
  const genreId = req.params.genreId;
  const tvShows = await TV.find();
  let tvList = [];
  tvList = tvShows.filter((m) => m.genre_ids.includes(genreId));

  res.status(200).json({
    status: 'success',
    data: tvList,
  });
});
