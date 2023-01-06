import fs from 'fs';
import axios from 'axios';
import got from 'got';
// import path from 'path';
import catchAsync from '../utils/catchAsync.mjs';
import Media from '../models/mediaModel.mjs';
import { getSrcWithVideoId, getVideoSrc } from '../utils/urlGrabber.mjs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { exec, spawn } from 'child_process';
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
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const getMediaItems = catchAsync(async (req, res, next) => {
  const media = await Media.find();
  if (!media) {
    return next(new Error('No document found with that ID'), 404);
  }

  res.status(200).json({
    status: 'success',
    data: media,
  });
});

export const getMedia = catchAsync(async (req, res, next) => {
  const media = await Media.findOne({ id: req.params.id });
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

  const items = await Media.find({
    title: { $regex: `${name}`, $options: 'i' },
  });

  if (!items.length) {
    const { firstResult, allResults } = await searchMediaByName(name);
    await Media.create(firstResult);
    updateVideoSrc(firstResult);
    res.status(200).json({
      status: 'success',
      data: allResults,
    });
  } else {
    res.status(200).json({
      status: 'success',
      data: items,
    });
  }
});

export const searchMediaByName = async (name) => {
  try {
    const [mediaData, mediaTitleId] = await Promise.all([
      axios({
        url: 'https://api.themoviedb.org/3/search/multi',
        method: 'GET',
        params: {
          api_key: process.env.MOVIEDB_API_KEY,
          query: name,
        },
      }),
      axios({
        url: 'https://imdb8.p.rapidapi.com/auto-complete',
        method: 'GET',
        params: { q: name },
        headers: {
          'X-RapidAPI-Key': process.env.RAPID_API_KEY,
          'X-RapidAPI-Host': 'imdb8.p.rapidapi.com',
        },
      }),
    ]);
    if (
      !mediaTitleId.data.d ||
      !mediaTitleId.data.d[0] ||
      !mediaData.data.results
    )
      return;
    if (!mediaTitleId.data.d[0].id.startsWith('tt')) return;
    const result = mediaData.data.results[0];
    const title = result.title || result.name;
    return {
      firstResult: {
        ...mediaData.data.results[0],
        title: normalizeText(title),
        title_id: mediaTitleId.data.d[0].id,
      },
      allResults: mediaData.data.results.slice(0, 4),
    };
  } catch (error) {
    return new AppError(error.message || 'Something went wrong.', 500);
  }
};
export const updateVideoSrc = catchAsync(async (media) => {
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
    if (videoData) {
      await Media.findOneAndUpdate(
        { id: media.id },
        {
          video_src: {
            SD: videoData.SD,
            HD: videoData.HD,
          },
          title_video_id: videoData.videoId,
        }
      );
      console.log(`${media.title} src updated.`);
    }
  } else console.log('no need to update');
});

export const needsSrcUpdate = (src) => {
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
  const media = await Media.findOne({ id: req.params.mediaId });
  const src = media.video_src.SD;
  const fileName = `${normalizeText(media.title)}.mp4`;
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

    // Stream the video chunk to the client
    videoStream.pipe(res);
  }
});

export const getUiConfif = catchAsync(async (req, res) => {
  const media = await Media.findOne({ id: req.params.id });
  const src = media.video_src.SD;
  const fileName = `${normalizeText(media.title)}-temp.mp4`;
  const resolvedPath = path.join(__dirname, '..', 'media-files', fileName);
  const downloadStream = got.stream(src);
  const fileWriterStream = fs.createWriteStream(resolvedPath);

  let done = false;
  downloadStream.on('downloadProgress', async (response) => {
    if (response.percent > 0.2 && !done) {
      var ffmpeg = spawn('ffmpeg', [
        '-i',
        fileName,
        '-vf',
        'cropdetect',
        '-f',
        'null',
      ]);

      ffmpeg.stdout.on('data', (data) => {
        console.log(data);
      });

      res.status(200).json({
        status: 'success',
        data: {
          height: '70px',
          top: '35px',
        },
      });
      done = true;
    }
  });
  downloadStream.pipe(fileWriterStream);
});

export const imageStream = catchAsync(async (req, res) => {
  const media = await Media.findOne({ id: +req.params.id });
  const localPath = path.join(
    __dirname,
    '..',
    'media-files',
    `${media.title}.jpg`
  );
  const resolvedPath = path.join(
    __dirname,
    '..',
    'media-files',
    `${media.backdrop_path}`
  );
  let sourcePath;
  if (fs.existsSync(localPath)) {
    res.sendFile(localPath);
  } else {
    if (!fs.existsSync(resolvedPath)) {
      sourcePath = `https://image.tmdb.org/t/p/w1280/${media.backdrop_path}`;
      const imageStream = got.stream(sourcePath);
      req.headers['content-type'] = 'image/jpg';
      imageStream.on('response', (response) => {
        response.pipe(res);
      });
      imageStream.pipe(fs.createWriteStream(resolvedPath));
    } else {
      res.sendFile(resolvedPath);
    }
  }
});
