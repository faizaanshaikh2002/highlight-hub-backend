import { client } from "../services/openai.js";
import fs from "fs";

async function extractScenesForGenre(transcription, genres, minDialogues = 3) {
	const messages = [
		{
			role: "system",
			content:
				"You are a helpful assistant that extracts scenes from movie transcriptions based on genre. No transcription should exceed the duration of 5 seconds.",
		},
		{
			role: "user",
			content: `Extract all transcriptions that are related to ${genres.join(
				","
			)} from the following transcription. Each scene should be provided as a JSON object with "start" and "duration" fields, formatted as follows:\n\n[{ start: "00:00:10", duration: 3 }, { start: "00:01:00", duration: 4 }]. If there are no matching transcription, return any ${minDialogues}\n\nTranscription:\n\n${transcription}`,
		},
	];

	try {
		const response = await client.chat.completions.create({
			model: "gpt-4o-mini",
			messages: messages,
			max_tokens: 1500,
			temperature: 0.7,
		});

		let output = response.choices[0].message.content.trim();

		// Remove Markdown code block formatting if present
		if (output.startsWith("```json")) {
			output = output.slice(7, -3).trim(); // Strip ```json and trailing ```
		} else if (output.startsWith("```")) {
			output = output.slice(3, -3).trim(); // Strip ``` and trailing ```
		}

		// Attempt to parse the output as JSON
		return JSON.parse(output);
	} catch (error) {
		console.error("Error parsing JSON from API response:", error);
		return null;
	}
}

export const createTrailerForGenre = async (genres, transcriptionText) => {
	console.log(`Generating ${genres.join(",")} trailer...`);

	const genreScenes = await extractScenesForGenre(
		transcriptionText,
		genres,
		10
	);

	if (genreScenes) {
		console.log(`Trailer script for ${genres.join(",")}:\n`, genreScenes);

		// Save the trailer script to a JSON file
		// fs.writeFileSync(
		// 	"./trailerScript.json",
		// 	JSON.stringify({ genres, scenes: genreScenes }, null, 2)
		// );
		console.log(`Trailer script Fetched succesfully`);
		return genreScenes;
	} else {
		console.log("No scenes found for the specified genre.");
	}
};
