import dotenv from "dotenv";
dotenv.config();
import express from "express";
import { trimAndMerge } from "./functions/trimAndMerge.js";
import { fileURLToPath } from "url";
import path from "path";
import { convertVideoToAudio } from "./functions/videoToAudio.js";
import { transcribeAudio } from "./functions/transcribe.js";
import { createTrailerForGenre } from "./functions/trailer.js";

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

const inputVideoPath = path.join(__dirname, "./assets/input.mkv");

app.get("/", async (req, res) => {
	// 1. Video to Audio
	const audio = await convertVideoToAudio(inputVideoPath);

	// 2. Transcribe Audio
	const srtText = await transcribeAudio(audio);

	// 3. Get Relevant Transcriptions
	const scenes = await createTrailerForGenre(["informative"], srtText);

	if (!scenes.length) return res.send("NO Scenes to show!");

	// 4. Cut and Merge relevent transcriptions
	console.log(scenes);

	await trimAndMerge(inputVideoPath, "output.mp4", scenes);

	res.send("Welcome to the Express CRUD API!");
});

app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});
