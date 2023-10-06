import fs from 'fs';
import axios from 'axios';
import got from 'got';
// import path from 'path';
import catchAsync from '../utils/catchAsync.mjs';
import util from 'util';
import Movie from '../models/media/movieModel.mjs';
import { getSrcWithVideoId, getVideoSrc } from '../utils/urlGrabber.mjs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { exec } from 'child_process';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import * as path from 'path';
ffmpeg.setFfmpegPath(ffmpegInstaller.path);

import {
  emptyFolder,
  getChunkProps,
  normalizeText,
} from '../utils/helpers.mjs';
import AppError from '../utils/appError.mjs';
import TV from '../models/media/tvModel.mjs';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const getMediaItems = catchAsync(async (req, res, next) => {
  const media = await Movie.find();
  if (!media) {
    return next(new Error('No document found with that ID'), 404);
  }

  res.status(200).json({
    status: 'success',
    data: media,
  });
});

export const getMedia = catchAsync(async (req, res, next) => {
  const media = await Movie.findOne({ id: req.params.id });
  if (!media) {
    return next(new Error('No document found with that ID'), 404);
  }

  updateVideoSrc(media);

  res.status(200).json({
    status: 'success',
    data: media,
  });
});

export const searchMedia = catchAsync(async (req, res) => {
  const name = normalizeText(req.params.name);

  // const items = await Movie.find({
  //   title: { $regex: `${name}`, $options: 'i' },
  // });
  const data = await searchMediaByName(name);
  let type = data.movie_results.length ? 'movie' : 'tv';
  const Model = type === 'movie' ? Movie : TV;
  const result = data[`${type}_results`];
  const videoData = await getVideoSrc(data.title_id, 1080);
  result[0].video_src = {
    SD: videoData.SD,
    HD: videoData.HD,
  };

  res.status(200).json({
    status: 'success',
    data: result,
  });
  const d = await Model.findOneAndUpdate({ id: result[0].id }, result[0], {
    upsert: true,
  });
});

export const searchMediaByName = async (name) => {
  try {
    const id = await getTitleId(name);
    const res = await axios({
      url: `https://api.themoviedb.org/3/find/${id}`,
      method: 'GET',
      params: {
        api_key: process.env.MOVIEDB_API_KEY,
        external_source: 'imdb_id',
      },
    });

    return {
      ...res.data,
      title_id: id,
    };
  } catch (error) {
    return new AppError(error.message || 'Something went wrong.', 500);
  }
};

export const getTitleId = async (name) => {
  try {
    const mediaData = await axios({
      url: 'https://imdb8.p.rapidapi.com/auto-complete',
      method: 'GET',
      params: { q: name },
      headers: {
        'X-RapidAPI-Key': process.env.RAPID_API_KEY,
        'X-RapidAPI-Host': 'imdb8.p.rapidapi.com',
      },
    });

    if (!mediaData.data.d) return;
    if (!mediaData.data.d[0].id.startsWith('tt')) {
      return mediaData.data.d[1].id;
    }
    return mediaData.data.d[0].id;
  } catch (error) {
    return new AppError(error.message || 'Could not get title id', 500);
  }
};

export const updateVideoSrc = catchAsync(async (media, model) => {
  if (
    !media.video_src ||
    !media.video_src.SD ||
    needsSrcUpdate(media.video_src.SD) ||
    needsSrcUpdate(media.video_src.HD)
  ) {
    let videoData;
    // if title_video_id is already saved then should use a lighter function
    // otherwise should use the main one
    if (media.title_video_id) {
      const SDSrc = await getSrcWithVideoId(media.title_video_id, 480);
      const HDSrc = await getSrcWithVideoId(media.title_video_id, 1080);
      videoData = {
        videoId: media.title_video_id,
        SD: SDSrc,
        HD: HDSrc,
      };
    } else {
      videoData = await getVideoSrc(media.title_id, 1080);
    }
    if (!videoData) throw 'videoData not found.';
    updateTitleMedia(model, media.id, videoData);
  } else console.log('no need to update');
});

export const updateTitleMedia = async (model, id, videoData) => {
  await model.findOneAndUpdate(
    { id },
    {
      video_src: {
        SD: videoData.SD,
        HD: videoData.HD,
      },
      title_video_id: videoData.videoId,
    }
  );
};

export const needsSrcUpdate = (src) => {
  if (!src) return true;
  const expireTime = src
    .split('?')
    .find((x) => x.startsWith('Expires='))
    .split('&')[0]
    .split('=')[1];
  const unix_timestamp = +expireTime;
  const date = new Date(unix_timestamp * 1000);
  const now = new Date();
  const remainingHour = date.getHours() - now.getHours();
  return remainingHour < 2;
};

export const emptyAssets = (req, res, next) => {
  emptyFolder(path.join(__dirname, '..', 'media-files'));
  next();
};

export const mediaStream = catchAsync(async (req, res) => {
  const Model = req.params.mediaType === 'tv' ? TV : Movie;
  const media = await Model.findOne({ id: req.params.mediaId });

  const src = media.video_src.HD;
  const name = media.title || media.name;
  const fileName = `${normalizeText(name)}.mp4`;
  const resolvedPath = path.join(__dirname, '..', 'media-files', fileName);
  const requestRangeHeader = req.headers.range;
  if (!requestRangeHeader) {
    res.status(400).send('Requires Range header');
  }

  if (!fs.existsSync(resolvedPath)) {
    const axiosResponseHead = await axios.head(src);
    const fileSize = axiosResponseHead['headers']['content-length'];
    const downloadStream = got.stream(src);
    const fileWriterStream = fs.createWriteStream(resolvedPath);
    const { start, end, chunkSize } = getChunkProps(
      requestRangeHeader,
      fileSize
    );
    let headers = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      range: `bytes=${start}-${end}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunkSize,
      'Content-Type': 'video/mp4',
    };
    res.writeHead(206, headers);
    downloadStream.on('response', (response) => {
      response.pipe(res);
    });
    downloadStream.pipe(fileWriterStream);
  } else {
    const videoSize = fs.statSync(resolvedPath).size;
    const { start, end } = getChunkProps(requestRangeHeader, videoSize);

    const videoStream = fs.createReadStream(resolvedPath, { start, end });

    videoStream.pipe(res);
  }
});

export const getVideoCropSize = catchAsync(async (req, res) => {
  const Model = req.params.type === 'tv' ? TV : Movie;
  res.status(200).json({
    status: 'success',
    data: 0,
  });
  // const media = await Model.findOne({ id: req.params.id });
  // const src = media.video_src.SD || media.video_src.HD;
  // const name = media.title || media.name;
  // const fileName = `${normalizeText(name)}-temp.mp4`;
  // const resolvedPath = path.join(__dirname, '..', 'media-files', fileName);
  // const fileWriterStream = fs.createWriteStream(resolvedPath);
  // let blackBarHeight = 0;

  // const asyncExec = util.promisify(exec);
  // let downloaded = 0;
  // const downloadStream = got.stream(src);

  // downloadStream
  //   .on('downloadProgress', async (progress) => {
  //     downloaded = progress.percent;
  //     if (downloaded >= 0.1) {
  //       downloadStream.destroy();
  //       const { err, stdout } = await asyncExec(
  //         `ffmpeg -i ${resolvedPath} -vf cropdetect -f null - 2>&1 | awk '/crop/ { print $NF }' | tail -1`
  //       );

  //       if (err) {
  //         return new AppError('crop value not found.', 500);
  //       }
  //       blackBarHeight = stdout.split(':').pop();
  //       const match = blackBarHeight.match(/\d+/);
  //       if (match) {
  //         blackBarHeight = match[0];
  //       }
  //       res.status(200).json({
  //         status: 'success',
  //         data: +blackBarHeight,
  //       });
  //     }
  //   })
  //   .pipe(fileWriterStream);
});

export const imageStream = catchAsync(async (req, res, next) => {
  const backdrop_path = req.params.backdropPath;
  const resolvedPath = path.join(
    __dirname,
    '..',
    'media-files',
    `${backdrop_path}`
  );
  const sourcePath = `https://image.tmdb.org/t/p/w1280/${backdrop_path}`;
  const imageStream = got.stream(sourcePath);
  req.headers['content-type'] = 'image/jpg';
  imageStream.on('response', (response) => {
    response.pipe(res);
  });
  imageStream.pipe(fs.createWriteStream(resolvedPath));

  imageStream.on('error', () => {
    return next(new AppError('Image not found', 500));
  });
});
