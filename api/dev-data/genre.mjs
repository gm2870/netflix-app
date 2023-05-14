import axios from 'axios';
import Genre from '../models/genreModel.mjs';
import Movie from '../models/media/movieModel.mjs';
import TV from '../models/media/tvModel.mjs';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const genres = JSON.parse(fs.readFileSync(`${__dirname}/genres.json`, 'utf-8'));

export const importGenres = async () => {
  console.log(genres);
  try {
    await Genre.create(genres);
  } catch (error) {
    console.log(error);
  }
  process.exit();
};

export const getTitlesFromAPI = async (type, genreIds, page) => {
  const releaseYearProp =
    type === 'tv' ? 'first_air_date.gte' : 'primary_release_date.gte';
  const list = await axios({
    url: `https://api.themoviedb.org/3/discover/${type}`,
    method: 'GET',
    params: {
      api_key: process.env.MOVIEDB_API_KEY,
      sort_by: 'vote_count.desc',
      [releaseYearProp]: '2015-01-01',
      'vote_average.gte': 7,
      page,
    },
  });
  return list.data.results;
};

export const getTitles = async (type, genreIds, page) => {
  if (process.env.TARGET === 'API') {
    const list = [];
    for (let index = 1; index <= page; index++) {
      const items = await getTitlesFromAPI(type, genreIds, index);
      list.push(...items);
    }

    return list;
  }
};

export const getTitlesByGenreId = async (req, res) => {
  const type = req.params.type;
  const genreId = req.params.genreId;
  const genre = await Genre.find({ id: genreId });
  const list = await getTitles(type, genreId, 10);
  const sortedList = sortTitles(list, genreId);
};

export const getAllTitles = async (req, res) => {
  const types = ['movie', 'tv'];
  const genres = await Genre.find();
  const list = [];
  const movieCollection = await getTitles('movie', [], 20);

  await saveToDB(Movie, movieCollection);
  res.status(200).json({
    status: 'success',
    data: movieCollection,
  });
};

const saveToDB = async (model, data) => {
  await model.create(data);
};

export const getAllByType = async (type) => {
  const genres = await Genre.find();
  const genresOfType = genres[0][type];
  const titles = [];
  for (const genre of genresOfType) {
    const list = await getTitles(type, genre.id, 10);
    titles.push(...list);
  }
  return titles;
};

export const sortTitles = (titles, genreId) => {
  const firstGenreIdMatch = titles.filter((x) => x.genre_ids[0] === genreId);
  const firstGenreIdDontMatch = titles.filter(
    (x) => x.genre_ids[0] !== genreId
  );
  return [...firstGenreIdMatch, firstGenreIdDontMatch];
};
