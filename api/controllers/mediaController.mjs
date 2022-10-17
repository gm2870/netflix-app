import fs from 'fs';
import axios from 'axios';
import got from 'got';
import path from 'path';
import { paramsWithUrl, scrapingbeeUrl } from '../utils/moviedbConfig.mjs';
import catchAsync from '../utils/catchAsync.mjs';
import Media from '../models/mediaModel.mjs';
import { getSrcWithVideoId, getVideoSrc } from '../utils/urlGrabber.mjs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import {
  emptyFolder,
  getChunkProps,
  normalizeText,
} from '../utils/helpers.mjs';
import AppError from '../utils/appError.mjs';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// export const getMovies = catchAsync(async (req, res) => {
//   const { data } = await axios({
//     url: scrapingbeeUrl,
//     method: 'GET',
//     params: paramsWithUrl('/discover/movie'),
//   });

//   res.status(200).json({
//     status: 'success',
//     data: data.results,
//   });
// });

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
  const name = req.params.name
    .toLowerCase()
    .split(' ')
    .join('-')
    .replace(':', '');

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
        video_title_id: mediaTitleId.data.d[0].id,
      },
      allResults: mediaData.data.results.slice(0, 4),
    };
  } catch (error) {
    console.log(error);
    return new AppError(error.message || 'Something went wrong.', 500);
  }
};
export const updateVideoSrc = catchAsync(async (movie) => {
  if (
    !movie.video_src ||
    !movie.video_src['480p'] ||
    needsSrcUpdate(movie.video_src['480p']) ||
    needsSrcUpdate(movie.video_src['1080p'])
  ) {
    let videoData;
    // if video_movie_id is already saved then should use a lighter function
    // otherwise should use the main one
    if (movie.video_movie_id) {
      videoData = await getSrcWithVideoId(movie.video_movie_id, 1080);
    } else {
      videoData = await getVideoSrc(movie.video_title_id, 1080);
    }
    if (videoData) {
      await Media.findOneAndUpdate(
        { id: movie.id },
        {
          video_src: {
            '480p': videoData['480p'],
            '1080p': videoData['1080p'],
          },
          video_movie_id: videoData.videoId,
        }
      );
      console.log(`${movie.title} src updated.`);
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
  emptyFolder(path.join(__dirname, '..', 'assets', 'segments'));
  next();
};

export const mediaStream = catchAsync(async (req, res) => {
  const movie = await Media.findOne({ id: req.params.mediaId });
  const src = movie.video_src['1080p'];
  const fileName = `${movie.title.split(' ').join('-').replace(':', '')}.mp4`;
  const requestRangeHeader = req.headers.range;
  if (!requestRangeHeader) {
    res.status(400).send('Requires Range header');
  }
  const resolvedPath = path.join(
    __dirname,
    '..',
    'assets',
    'segments',
    fileName
  );
  const axiosResponseHead = await axios.head(src);
  const fileSize = axiosResponseHead['headers']['content-length'];
  if (!fs.existsSync(resolvedPath)) {
    const downloadStream = got.stream(src);
    const fileWriterStream = fs.createWriteStream(resolvedPath);
    const { start, end, chunkSize } = getChunkProps(
      requestRangeHeader,
      fileSize
    );
    downloadStream.on('response', (response) => {
      let headers = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        range: `bytes=${start}-${end}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunkSize,
        'Content-Type': 'video/mp4',
      };
      res.writeHead(206, headers);
      response.pipe(res);
    });
    downloadStream.pipe(fileWriterStream);
  } else {
    const videoSize = fs.statSync(resolvedPath).size;
    console.log(videoSize);
    const { start, end, chunkSize } = getChunkProps(
      requestRangeHeader,
      videoSize
    );
    let headers = {
      'Content-Range': `bytes ${start}-${end}/${videoSize}`,
      range: `bytes=${start}-${end}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunkSize,
      'Content-Type': 'video/mp4',
    };
    res.writeHead(206, headers);
    // create video read stream for this particular chunk
    const videoStream = fs.createReadStream(resolvedPath, { start, end });

    // Stream the video chunk to the client
    videoStream.pipe(res);
  }
});

export const imageStream = async (req, res) => {
  const imageStream = got.stream(
    `https://image.tmdb.org/t/p/w1280/${req.params.path}`
  );
  const resolvedPath = path.join(
    __dirname,
    '..',
    'assets',
    'segments',
    `${req.params.path}`
  );
  const fileWriterStream = fs.createWriteStream(resolvedPath);
  req.headers['content-type'] = 'image/jpg';
  imageStream.on('response', (response) => {
    response.pipe(res);
  });
  // .on('end', () => {
  //   const videoStream = fs.createReadStream(resolvedPath);
  //   imageStream.pipe(videoStream);
  // });
  imageStream.pipe(fileWriterStream);
};
