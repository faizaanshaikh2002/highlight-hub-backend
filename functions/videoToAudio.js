import ffmpeg from 'fluent-ffmpeg';
import ffmpegStatic from 'ffmpeg-static';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// const videoFile = path.join(__dirname, '../assets/video/sample.mp4');
// console.log(videoFile,"vmd")

export const convertVideoToAudio = (pathName) => {

    ffmpeg.setFfmpegPath(ffmpegStatic);

    const outputDir = path.join(__dirname, 'output-audio');
    
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir);
    }
    const audioFile = path.join(outputDir, `${path.parse(pathName).name}.mp3`);
    
    if (fs.existsSync(pathName)) {
      ffmpeg(pathName)
        .output(audioFile)
        .on('end', async () => {
          console.log('Audio file created successfully:', audioFile);
        })
        .on('error', (err) => {
          console.error('Error during conversion:', err.message);
        })
        .run();
    } else {
      console.log('Video file not found in the directory!');
    }

}


convertVideoToAudio(videoFile);