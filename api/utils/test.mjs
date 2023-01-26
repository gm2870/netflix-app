import { exec, spawn } from 'child_process';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import * as path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

ffmpeg.setFfmpegPath(ffmpegInstaller.path);
import util from 'util';

const fileName = 'hustle.mp4';
const resolvedPath = path.join(__dirname, '..', 'media-files', fileName);
const asyncExec = util.promisify(exec);

exec(
  `ffmpeg -i ${resolvedPath} -vf cropdetect -f null - 2>&1 | awk '/crop/ { print $NF }' | tail -1`,
  (err, stdout) => {
    console.log(err);
    console.log(stdout);
  }
);
const cropFile = (fileName, path, cropValues) => {
  exec(
    `ffmpeg -i ${path} -vf "${cropValues}" ${fileName} `,
    (err, stdout, stderr) => {
      if (err) {
        console.log(err);
        // node couldn't execute the command
        return;
      }

      // the *entire* stdout and stderr (buffered)
      console.log(`stdout: ${stdout}`);
    }
  );
};
