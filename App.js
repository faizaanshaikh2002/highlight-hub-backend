dotenv.config();
import express from "express";
import dotenv from "dotenv";
import { trimAndMerge } from "./functions/trimAndMerge.js";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

app.get("/", async (req, res) => {
	const inputVideoPath = path.join(__dirname, "video.mp4");
	const outputVideoPath = path.join(__dirname, "output_merged.mp4");
	const segments = [
		{ start: "00:00:10", duration: 3 },
		{ start: "00:01:00", duration: 5 },
		{ start: "00:02:30", duration: 2 },
		{ start: "00:00:10", duration: 3 },
	];

	trimAndMerge(inputVideoPath, outputVideoPath, segments);

	res.send("Welcome to the Express CRUD API!");
});

app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});
