import mongoose from 'mongoose';

const TVSchema = new mongoose.Schema({
  id: Number,
  created_by: [
    {
      id: Number,
      name: String,
      gender: Number,
      credit_id: String,
      profile_path: String | null,
    },
  ],
  episode_run_time: [Number],
  first_air_date: String,
  homepage: String,
  imdb_id: String,
  seasons: [
    {
      id: Number,
      air_date: String,
      episode_count: Number,
      overview: String,
      name: String,
      poster_path: String,
      season_number: Number,
    },
  ],
  title: String,
  video: Boolean,
  video_src: {
    SD: String,
    HD: String,
  },
  title_id: String,
  title_video_id: String,
  number_of_episodes: Number,
  number_of_seasons: Number,
  adult: Boolean,
  original_name: String,
  name: String,
  media_type: String,
  original_language: String,
  backdrop_path: String,
  genre_ids: [Number],
  in_production: Boolean,
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
  runtime: Number,
  uiConfig: {
    height: String,
    top: String,
  },
});

TVSchema.pre(/^find/, function (next) {
  this.find().select('-__v');
  next();
});
const TV = mongoose.models.TV_shows || mongoose.model('TV_shows', TVSchema);
export default TV;
