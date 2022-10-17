export const scrapingbeeUrl = 'https://app.scrapingbee.com/api/v1';
export const paramsWithUrl = (moviedbUrl) => ({
  api_key: process.env.SCRAPINGBEE_API_KEY,
  url: `https://api.themoviedb.org/3${moviedbUrl}?api_key=${process.env.MOVIEDB_API_KEY}&append_to_response=videos`,
  render_js: 'false',
});

export const searchUrl = (query) => ({
  api_key: process.env.SCRAPINGBEE_API_KEY,
  url: `https://api.themoviedb.org/3/search/movie?query=${query}&api_key=${process.env.MOVIEDB_API_KEY}`,
  render_js: 'false',
});

export const movieTitleIdUrl = (query) => ({
  api_key: process.env.SCRAPINGBEE_API_KEY,
  url: `https://imdb8.p.rapidapi.com/auto-complete?q=${query}`,
  render_js: 'false',
});
