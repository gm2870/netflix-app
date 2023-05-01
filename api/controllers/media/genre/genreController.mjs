import Genre from '../../../models/genreModel.mjs';
import catchAsync from '../../../utils/catchAsync.mjs';

export const getMovieGenres = catchAsync(async (req, res) => {
  const genres = await Genre.find(
    {
      $or: [{ types: ['movie'] }, { types: ['tv', 'movie'] }],
    },
    '-types'
  );
  res.status(200).json({
    status: 'success',
    data: genres,
  });
});

export const getTVGenres = catchAsync(async (req, res) => {
  const genres = await Genre.find(
    {
      $or: [{ types: ['tv'] }, { types: ['tv', 'movie'] }],
    },
    '-types'
  );
  res.status(200).json({
    status: 'success',
    data: genres,
  });
});
