import axios from 'axios';
import Genre from '../../models/genreModel.mjs';
import Movie from '../../models/media/movieModel.mjs';
import TV from '../../models/media/tvModel.mjs';

export const importGenres = async () => {
  const types = ['tv', 'movie'];
  const genres = {};
  for (const type of types) {
    const genre = await axios.get(
      `https://api.themoviedb.org/3/genre/${type}/list`,
      {
        params: {
          api_key: process.env.MOVIEDB_API_KEY,
        },
      }
    );
    genres[type] = genre.data.genres;
  }
  genres['movie'] = [
    {
      id: 1,
      name: 'Top 10 Movies in [country]',
      has_country: true,
      has_user_profile: false,
    },
    {
      id: 2,
      name: '[language] Movies',
      has_language: true,
      has_user_profile: false,
    },
    ...genres['movie'],
  ];

  genres['tv'] = [
    {
      id: 1,
      name: 'Top 10 TV Shows in [country]',
      has_country: true,
      has_user_profile: false,
    },
    {
      id: 2,
      name: '[country] TV Shows',
      has_country: true,
      has_user_profile: false,
    },
    ...genres['movie'],
  ];
  await Genre.create(genres);
  process.exit();
};

export const getTop10Movies = async () => {
  const list = await axios({
    url: `https://api.themoviedb.org/3/movie/top_rated`,
    method: 'GET',
    params: {
      api_key: process.env.MOVIEDB_API_KEY,
      primary_relase_year: 2022,
      sort_by: 'popularity.desc',
    },
  });
  const movies = list.data.filter((movie) => movie.popularity > 300);
  return movies;
};

export const getTitlesByGenreIds = async (type, genreIds, page = 1) => {
  const list = await axios({
    url: `https://api.themoviedb.org/3/discover/${type}`,
    method: 'GET',
    params: {
      api_key: process.env.MOVIEDB_API_KEY,
      with_genres: genreIds,
      primary_release_year: 2022,
      sort_by: 'popularity.desc',
      page,
    },
  });
  return list.data.results;
};

export const getTitlesByGenreId = async (req, res) => {
  const type = req.params.type;
  const genreId = req.params.genreId;
  const genre = await Genre.find({ id: genreId });
  const list = await getFilteredTitles(type, 10, genreId);
  sendTitlesCollection(genre.name, list, res);
};

export const getAllTitles = async (req, res) => {
  const types = ['movie', 'tv'];
  const genres = await Genre.find();
  const collection = {};
  for (const type of types) {
    const genresOfType = genres[0][type];
    for (const genre of genresOfType) {
      const list = await getFilteredTitles(type, 10, genre.id);
      if (!collection[genre.name]) {
        collection[genre.name] = [];
      }
      collection[genre.name] = [...collection[genre.name], ...list];
      const model = type === 'movie' ? Movie : TV;
      // await saveToDB(model, collection[genre.name]);
    }
  }

  res.status(200).json({
    status: 'success',
    data: collection,
  });
};
const saveToDB = async (model, data) => {
  await model.create(data);
};
export const getAllByType = async (req, res) => {
  const type = req.params.type;
  const genres = await Genre.find();
  const collection = {};
  for (const genre of genres) {
    const list = await getFilteredTitles(type, 10, genre[type].id);
    collection[genre.name] = list;
  }
  res.status(200).json({
    status: 'success',
    data: collection,
  });
};

const getFilteredTitles = async (type, numOfPages, genreId) => {
  const list = [];
  for (let page = 1; page < numOfPages; page++) {
    const data = await getTitlesByGenreIds(type, genreId, page);
    let filtered = data.filter((x) => x.genre_ids[0] === genreId);
    if (!filtered.length) {
      filtered = data;
    }
    list.unshift(...filtered);
  }
  return list;
};

const sendTitlesCollection = (genreName, list, res) => {
  const collection = {};
  collection[genreName.name] = list;
  res.status(200).json({
    status: 'success',
    data: collection,
  });
};
