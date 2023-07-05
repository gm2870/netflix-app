import axios from 'axios';
import Genre from '../../models/genreModel.mjs';
import Movie from '../../models/media/movieModel.mjs';
import TV from '../../models/media/tvModel.mjs';
import catchAsync from '../../utils/catchAsync.mjs';
import { getToken } from '../authController.mjs';
import User from '../../models/userModel.mjs';
import { promisify } from 'util';
import jwt from 'jsonwebtoken';
import AppError from '../../utils/appError.mjs';
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
  const genres = await Genre.aggregate([
    { $match: { types: { $ne: ['tv'] } } },
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
          { $limit: 42 },
        ],
        as: 'titles',
      },
    },
    {
      $project: {
        id: 1,
        name: 1,
        titles: 1,
      },
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: genres,
  });
});

export const getAllMoviesByGenre = catchAsync(async (req, res) => {
  const genreId = +req.params.genreId;
  const genres = await Genre.aggregate([
    {
      $match: {
        id: genreId,
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
                  genreId,
                ],
              },
            },
          },
        ],
        as: 'titles',
      },
    },
    {
      $project: {
        id: 1,
        name: 1,
        titles: 1,
      },
    },
  ]);
  res.status(200).json({
    status: 'success',
    data: genres,
  });
});

export const getAllTVShows = catchAsync(async (req, res) => {
  const genres = await Genre.aggregate([
    { $match: { types: { $ne: ['movie'] } } },
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
          { $limit: 42 },
        ],
        as: 'titles',
      },
    },
    {
      $project: {
        id: 1,
        name: 1,
        titles: 1,
      },
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: genres,
  });
});

export const getAllTVShowsByGenre = catchAsync(async (req, res) => {
  const genreId = +req.params.genreId;
  console.log(genreId);
  const genres = await Genre.aggregate([
    {
      $match: {
        id: genreId,
      },
    },
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
                  genreId,
                ],
              },
            },
          },
        ],
        as: 'titles',
      },
    },
    {
      $project: {
        id: 1,
        name: 1,
        titles: 1,
      },
    },
  ]);
  res.status(200).json({
    status: 'success',
    data: genres,
  });
});

export const getTitle = catchAsync(async (req, res) => {
  const result = await axios({
    url: `https://api.themoviedb.org/3/${req.params.type}/${req.params.titleId}`,
    method: 'GET',
    params: {
      api_key: process.env.MOVIEDB_API_KEY,
    },
  });
  res.status(200).json({
    status: 'success',
    data: result.data,
  });
});

export const getTitleDetails = catchAsync(async (req, res) => {
  const result = await axios({
    url: `https://api.themoviedb.org/3/${req.params.type}/${req.params.titleId}`,
    method: 'GET',
    params: {
      api_key: process.env.MOVIEDB_API_KEY,
    },
  });
  res.status(200).json({
    status: 'success',
    data: result.data,
  });
});

export const getTVDetails = catchAsync(async (req, res) => {
  const result = await axios({
    url: `https://api.themoviedb.org/3/tv/${req.params.titleId}`,
    method: 'GET',
    params: {
      api_key: process.env.MOVIEDB_API_KEY,
    },
  });
  res.status(200).json({
    status: 'success',
    data: result.data,
  });
});

export const getMovieDetails = catchAsync(async (req, res) => {
  const result = await axios({
    url: `https://api.themoviedb.org/3/movie/${req.params.titleId}`,
    method: 'GET',
    params: {
      api_key: process.env.MOVIEDB_API_KEY,
    },
  });
  res.status(200).json({
    status: 'success',
    data: result.data,
  });
});

export const getSeasonInfo = catchAsync(async (req, res) => {
  const result = await axios({
    url: `https://api.themoviedb.org/3/tv/${req.params.titleId}/season/${req.params.seasonNumber}`,
    method: 'GET',
    params: {
      api_key: process.env.MOVIEDB_API_KEY,
    },
  });
  res.status(200).json({
    status: 'success',
    data: result.data,
  });
});

export const getGeneralBillboard = async (req, res) => {
  const tv = await TV.findOne({ id: 67026 });
  res.status(200).json({
    status: 'success',
    data: tv,
  });
};

export const getTVBillboard = async (req, res) => {
  const tv = await TV.findOne({ id: 103768 });
  res.status(200).json({
    status: 'success',
    data: tv,
  });
};

export const getMovieBillboard = async (req, res) => {
  const movie = await Movie.findOne({ id: 512195 });
  res.status(200).json({
    status: 'success',
    data: movie,
  });
};

export const protect = catchAsync(async (req, res, next) => {
  const token = getToken(req);
  if (!token) {
    return next(
      new AppError('Your not logged in, Please log in to get access', 401)
    );
  }
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError('The user belonging to this token does not exits', 401)
    );
  }
  next();
});
