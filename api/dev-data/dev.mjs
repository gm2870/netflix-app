import Movie from '../models/media/movieModel.mjs';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
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

dotenv.config({ path: `${__dirname}/../../.env` });

mongoose.connect(process.env.MONGODB_URI);

const mediaNames = [];

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

const updateManyTitleId = async (model) => {
  const Model = model === 'tv' ? TV : Movie;
  const items = await Model.find();
  for (const show of items) {
    if (show.title_id) continue;
    console.log(show.name);
    const name = show.name || show.title;
    const id = await getTitleId(name);
    console.log(id);
    if (!id?.startsWith('tt')) continue;
    const res = await Model.updateOne(
      { id: show.id },
      { title_id: id },
      { upsert: true }
    );
    console.log(res);
  }
  process.exit();
};
const updateOneTitleId = async (model, id) => {
  const Model = model === 'tv' ? TV : Movie;
  const item = await Model.findOne({ id });
  const name = item.name || item.title;
  console.log(name);
  const titleId = await getTitleId(name);
  console.log(titleId);
  if (!titleId?.startsWith('tt')) {
    return new AppError('Invalid title id.', 500);
  }
  const res = await Model.updateOne(
    { id: item.id },
    { title_id: titleId },
    { upsert: true }
  );
  console.log(res);

  process.exit();
};
export const importOne = async (name, model) => {
  const Model = model === 'tv' ? TV : Movie;
  const res = await searchMediaByName(name);
  await Model.create(res.movie_results[0]);

  process.exit();
};

const deleteMany = async (model) => {
  const Model = model === 'tv' ? TV : Movie;

  try {
    await Model.deleteMany();
  } catch (error) {
    return new AppError(error.message || 'Something went wrong.', 500);
  }
  process.exit();
};

export const updateManySrc = async (model) => {
  const Model = model === 'tv' ? TV : Movie;
  const items = await Model.find();

  for (const media of items) {
    if (!media.video_src.HD) {
      await updateItemSrc(model, media);
    } else continue;
  }
};

export const forceSrcUpdate = catchAsync(async (model) => {
  const Model = model === 'tv' ? TV : Movie;

  const items = await Model.find();
  let i = 0;
  for (const media of items) {
    if (!media.title_id) continue;
    await updateItemSrc(model, media);

    i++;
  }
  if (i === items.length) process.exit();
});

export const updateItemSrc = async (model, media) => {
  const Model = model === 'tv' ? TV : Movie;
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
    videoData = await getVideoSrc(name, 1080);
  }

  if (!videoData || !videoData.SD) {
    console.log(`${name} failed`);
    fs.appendFile('failed.txt', `\n${name} failed`, 'utf-8', (err) =>
      console.log(err)
    );
    return;
  }
  console.log(videoData);
  return await Model.findOneAndUpdate(
    { id: media.id },
    {
      video_src: {
        SD: videoData.SD,
        HD: videoData.HD,
      },
      title_video_id: videoData.videoId,
    },
    { upsert: true }
  );
};
export const updateOne = async (model, id) => {
  const Model = model === 'tv' ? TV : Movie;
  try {
    const item = await Model.findOne({ id });
    await updateItemSrc(model, item);
  } catch (error) {
    console.log(error);
  }
  process.exit();
};

if (process.argv[2] === '--import-tv') {
  importTVMedia();
} else if (process.argv[2] === '--delete') {
  deleteMany();
} else if (process.argv[2] === '--update-many') {
  forceSrcUpdate('movie');
} else if (process.argv[2] === '--update') {
  updateOne('tv', 60797);
} else if (process.argv[2] === '--import-genres') {
  importGenres();
} else if (process.argv[2] === '--import-movie') {
  importOne('red notice');
} else if (process.argv[2] === '--update-tv') {
  updateManyTitleId('tv');
} else if (process.argv[2] === '--update-movie') {
  updateManyTitleId('movie');
} else if (process.argv[2] === '--add-id') {
  updateOneTitleId('tv', 93405);
}
