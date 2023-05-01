import mongoose from 'mongoose';

const MovieSchema = new mongoose.Schema({
  id: Number,
  imdb_id: String,
  title: String,
  video: Boolean,
  video_src: {
    SD: String,
    HD: String,
  },
  title_id: String,
  title_video_id: String,
  adult: Boolean,
  original_name: String,
  name: String,
  media_type: String,
  original_language: String,
  backdrop_path: String,
  last_air_date: String,
  belongs_to_collection: null | Object,
  genre_ids: [Number],
  genres: [
    {
      id: Number,
      name: String,
    },
  ],
  production_countries: [
    {
      iso_3166_1: String,
      name: String,
    },
  ],
  production_companies: [
    {
      id: Number,
      name: String,
      logo_path: String,
      origin_country: String,
    },
  ],
  release_date: String,
  revenue: Number,
  poster_path: String,
  tagline: String,
  vote_count: Number,
  status: {
    type: String,
    enum: [
      'Released',
      'Canceled',
      'Post Production',
      'In Production',
      'Rumored',
      'Planed',
    ],
  },
  budget: String,
  spoken_languages: [
    {
      iso_639_1: String,
      name: String,
    },
  ],
  vote_average: Number,
  videos: {
    results: [
      {
        id: String,
        iso_639_1: String,
        iso_3166_1: String,
        key: String,
        name: String,
        official: Boolean,
        published_at: Date,
        site: String,
        size: Number,
      },
    ],
  },
  popularity: Number,
  overview: String,
  homepage: String,
  runtime: Number,
  uiConfig: {
    height: String,
    top: String,
  },
});

const Movie = mongoose.model('Movies', MovieSchema);
MovieSchema.pre(/^find/, function (next) {
  this.find().select('-__v');
  next();
});
export default Movie;
