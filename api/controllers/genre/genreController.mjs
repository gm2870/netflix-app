import axios from 'axios';
import Genre from '../../models/genreModel.mjs';

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
  const list = await axios.get(`https://api.themoviedb.org/3/movie/top_rated`, {
    params: {
      api_key: process.env.MOVIEDB_API_KEY,
      primary_relase_year: 2022,
      sort_by: 'popularity.desc',
    },
  });
  const movies = list.data.filter((movie) => movie.popularity > 300);
  return movies;
};

export const getMoviesByGenreIds = async (genreIds) => {
  const list = await axios.get(`https://api.themoviedb.org/3/discover/movie`, {
    params: {
      api_key: process.env.MOVIEDB_API_KEY,
      genre_ids: genreIds,
      primary_release_year: 2022,
      sort_by: 'popularity.desc',
    },
  });
  return list.data;
};
export const getTVShowsByGenreIds = async (genreIds) => {
  const list = await axios.get(`https://api.themoviedb.org/3/discover/tv`, {
    params: {
      api_key: process.env.MOVIEDB_API_KEY,
      genre_ids: genreIds,
      primary_release_year: 2022,
      sort_by: 'popularity.desc',
    },
  });
  return list.data;
};
export const getActionMovies = () => getMoviesByGenreIds([28]);

export const getComedyMovies = () => getMoviesByGenreIds([35]);

export const getAllMovies = async () => {
  const list = getMoviesByGenreIds([]);
  const genres = await Genre.find();
  const movieCollection = {};
  genres.movie.forEach((genre) => {
    movieCollection[genre.title] = list
      .filter((item) => item.genres.includes(genre.id))
      .slice(0, 30);
  });
};
