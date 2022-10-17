import Media from '../models/mediaModel.mjs';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { getSrcWithVideoId, getVideoSrc } from '../utils/urlGrabber.mjs';
import {
  needsSrcUpdate,
  searchMediaByName,
} from '../controllers/movieController.mjs';
import catchAsync from '../utils/catchAsync.mjs';
import AppError from '../utils/appError.mjs';
dotenv.config({ path: '../config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose.connect(DB);

const mediaNames = [
  'red-notice',
  'avengers-endgame',
  'spiderman-no-way-home',
  'the-batman',
  'uncharted',
  'irishman',
  'scream',
  'the-lost-city',
  'hustle',
  'bullet-train',
  'joker',
  'breaking-bad',
  'money-heist',
  'the-black-list',
];

const importMedia = async () => {
  for (const name of mediaNames) {
    const media = await searchMediaByName(name);
    await Media.create(media);
  }
  process.exit();
};
const deleteAllMedia = async () => {
  await Media.deleteMany();
  try {
    await Media.deleteMany();
  } catch (error) {
    return new AppError(error.message || 'Something went wrong.', 500);
  }
  process.exit();
};

export const checkAndUpdateSrc = async () => {
  const items = await Media.find();
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
  const items = await Media.find();
  let i = 0;
  for (const media of items) {
    console.log(media.title);
    await updateSrc(media);
    console.log(media.video_src);

    i++;
  }
  if (i === items.length) process.exit();
});

export const updateSrc = async (media) => {
  let HDSrc, SDSrc, videoData;
  if (media.title_video_id) {
    SDSrc = await getSrcWithVideoId(media.title_video_id, 480);
    HDSrc = await getSrcWithVideoId(media.title_video_id, 1080);
    videoData = {
      SD: SDSrc,
      HD: HDSrc,
    };
  } else {
    videoData = await getVideoSrc(media.title_id, 1080);
  }
  if (!videoData || !videoData.SD) return;
  return await Media.findOneAndUpdate(
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
const updateMedia = async (id) => {
  const movie = await Media.findOne({ id });
  console.log(movie.title);
  await updateSrc(movie);
  process.exit();
};
if (process.argv[2] === '--import') {
  importMedia();
} else if (process.argv[2] === '--delete') {
  deleteAllMedia();
} else if (process.argv[2] === '--update-src') {
  forceSrcUpdate();
} else if (process.argv[2] === '--update') {
  updateMedia(1396);
}
