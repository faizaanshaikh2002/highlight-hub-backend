import ffmpeg from "fluent-ffmpeg";
import ffmpegStatic from "ffmpeg-static";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
ffmpeg.setFfmpegPath(ffmpegStatic);

export const convertVideoToAudio = async (pathName) => {
  const outputDir = path.join(__dirname, "../assets");

  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  console.log({ pathName });

  const audioFile = path.join(outputDir, `${path.parse(pathName).name}.mp3`);

  console.log({ audioFile });

  // Check if video file exists
  if (!fs.existsSync(pathName)) {
    throw new Error("Video file not found in the directory!");
  }

  // Convert video to audio asynchronously
  return new Promise((resolve, reject) => {
    ffmpeg(pathName)
      .output(audioFile)
      .on("end", () => {
        console.log("Audio file created successfully:", audioFile);
        resolve(audioFile);
      })
      .on("error", (err) => {
        console.error("Error during conversion:", err.message);
        reject(new Error("Error during conversion: " + err));
      })
      .run();
  });
};
