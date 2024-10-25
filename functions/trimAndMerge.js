import ffmpeg from "fluent-ffmpeg";
import path from "path";
import fs from "fs";

import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory

const command = ffmpeg();

/**
 * Trim and merge multiple video segments
 * @param {string} inputPath - Path to the input video file
 * @param {string} outputPath - Path to save the final merged video
 * @param {Array<{ start: string, duration: number }>} segments - Array of start time and duration objects
 */
export async function trimAndMerge(inputPath, outputPath, segments) {
	const tempFiles = [];

	// Process each segment and save as temporary file
	for (let i = 0; i < segments.length; i++) {
		const { start, duration } = segments[i];
		const tempPath = path.join(__dirname, `../temp_clip_${i}.mp4`);
		tempFiles.push(tempPath);

		await new Promise((resolve, reject) => {
			ffmpeg(inputPath)
				.format("mp4")
				.setStartTime(start)
				.duration(duration)
				.output(tempPath)
				.on("end", resolve)
				.on("error", reject)
				.run();
		});
	}

	// Merge all temp files into one output file
	tempFiles.forEach((video) => command.input(video));

	await new Promise((resolve, reject) => {
		command
			.on("error", (err) => {
				console.error("Error:", err);
				reject(err);
			})
			.on("end", () => {
				console.log("Merged video saved to:", outputPath);
				tempFiles.forEach((file) => fs.unlinkSync(file));
				resolve();
			})
			.mergeToFile(outputPath, __dirname);
	});
}
