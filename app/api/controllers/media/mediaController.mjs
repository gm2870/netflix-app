import Genre from '../../models/genreModel.mjs';
import Movie from '../../models/media/movieModel.mjs';
import TV from '../../models/media/tvModel.mjs';
import catchAsync from '../../utils/catchAsync.mjs';

export const getAllTitles = async (req, res) => {
  const genres = await Genre.aggregate([
    {
      $lookup: {
        from: 'tv_shows',
        let: {
          genreId: '$id',
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: [
                  {
                    $arrayElemAt: ['$genre_ids', 0],
                  },
                  '$$genreId',
                ],
              },
            },
          },
          { $limit: 21 },
        ],
        as: 'tv_shows',
      },
    },

    {
      $lookup: {
        from: 'movies',
        let: {
          genreId: '$id',
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: [
                  {
                    $arrayElemAt: ['$genre_ids', 0],
                  },
                  '$$genreId',
                ],
              },
            },
          },
          { $limit: 21 },
        ],
        as: 'movies',
      },
    },
    {
      $project: {
        id: 1,
        name: 1,
        titles: { $concatArrays: ['$tv_shows', '$movies'] },
      },
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: genres,
  });
};

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
