import Movie from '../models/media/movieModel.mjs';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { getSrcWithVideoId, getVideoSrc } from '../utils/urlGrabber.mjs';
import {
  getTitleId,
  needsSrcUpdate,
  searchMediaByName,
} from '../controllers/streamController.mjs';
import catchAsync from '../utils/catchAsync.mjs';
import AppError from '../utils/appError.mjs';
import TV from '../models/media/tvModel.mjs';
import { importGenres } from '../dev-data/genre.mjs';

import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: `${__dirname}/../../.env.local` });
mongoose.connect(process.env.MONGODB_URI);
const mediaNames = [
  // 'red-notice',
  // 'avengers-endgame',
  // 'spiderman-no-way-home',
  // 'the-batman',
  // 'irishman',
  // 'scream',
  // 'the-lost-city',
  // 'bullet-train',
  // 'joker',
  // 'better-call-saul',
  // 'dark',
  // 'blindspot',
  // 'ted-lasso',
  // 'see',
  // 'money-heist',
  // '1899',
  'designated survier',
  // 'treason',
  // 'the-sandman',
  // 'the-recruit',
];

const importTVMedia = async () => {
  for (const name of mediaNames) {
    const res = await searchMediaByName(name);

    res.tv_results.forEach(async (tv) => {
      tv.media_type = 'tv';
      await TV.create(tv);
    });
  }
  process.exit();
};
const updateTVMedia = async () => {
  const res = await Movie.updateMany(
    {},
    { media_type: 'movie' },
    { upsert: true }
  );
  console.log(res);
  process.exit();
};
export const importMovieMedia = async (name) => {
  const res = await searchMediaByName(name);
  await Movie.create(res.movie_results[0]);

  process.exit();
};

const deleteAllMedia = async () => {
  try {
    await Movie.deleteMany();
  } catch (error) {
    return new AppError(error.message || 'Something went wrong.', 500);
  }
  process.exit();
};

export const checkAndUpdateSrc = async () => {
  const items = await Movie.find();
  for (const media of items) {
    if (
      !media.video_src.HD ||
      !media.video_src.SD ||
      needsSrcUpdate(media.video_src.SD) ||
      needsSrcUpdate(media.video_src.HD)
    ) {
      updateSrc(media);
    }
  }
  process.exit();
};

export const forceSrcUpdate = catchAsync(async () => {
  const items = await Movie.find();
  let i = 0;
  for (const media of items) {
    await updateSrc(media);

    i++;
  }
  if (i === items.length) process.exit();
});

export const updateSrc = async (media) => {
  let HDSrc, SDSrc, videoData;
  const name = media.name || media.title;

  if (media.title_video_id) {
    SDSrc = await getSrcWithVideoId(media.title_video_id, 480);
    HDSrc = await getSrcWithVideoId(media.title_video_id, 1080);
    videoData = {
      videoId: media.title_video_id,
      SD: SDSrc,
      HD: HDSrc,
    };
  } else {
    let titleId = media.title_id;
    if (!titleId) {
      titleId = await getTitleId(name);
      console.log(titleId);
    }
    videoData = await getVideoSrc(titleId, 1080);
  }

  if (!videoData || !videoData.SD) {
    console.log(`${name} failed`);
    return;
  }
  return await TV.findOneAndUpdate(
    { id: media.id },
    {
      video_src: {
        SD: videoData.SD,
        HD: videoData.HD,
      },
      title_video_id: videoData.videoId,
    }
  );
};
export const updateMedia = async (id) => {
  const item = await TV.findOne({ id });
  await updateSrc(item);
  process.exit();
};

if (process.argv[2] === '--import-tv') {
  importTVMedia();
} else if (process.argv[2] === '--delete') {
  deleteAllMedia();
} else if (process.argv[2] === '--update-src') {
  forceSrcUpdate();
} else if (process.argv[2] === '--update') {
  updateMedia(67026);
} else if (process.argv[2] === '--import-genres') {
  importGenres();
} else if (process.argv[2] === '--import-movie') {
  importMovieMedia('red notice');
} else if (process.argv[2] === '--update-tv') {
  updateTVMedia();
}
