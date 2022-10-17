import app from './app.mjs';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
// import schedule from 'node-schedule';
// import Movie from './models/movieModel.mjs';
// import { getVideoSrc } from './utils/urlGrabber.mjs';
// import catchAsync from './utils/catchAsync.mjs';

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose.connect(DB);

// schedule.scheduleJob(
//   '35 8,14,20 * * *',
//   catchAsync(async () => {
//     // eslint-disable-next-line
//     console.log('src update running');
//     const movies = await Movie.find();
//     for (const movie of movies) {
//       const videoSrc = await getVideoUrl(movie.video_title_id, 1080);
//       if (!videoSrc) return;
//       await Movie.findOneAndUpdate(
//         { id: movie.id },
//         {
//           video_src: videoSrc,
//         }
//       );
//       // eslint-disable-next-line
//       console.log(movie.title, ' src updated');
//     }
//   })
// );
app.listen(process.env.PORT, () => {
  // eslint-disable-next-line
  console.log(`Server listening on the port::${process.env.PORT}`);
});
