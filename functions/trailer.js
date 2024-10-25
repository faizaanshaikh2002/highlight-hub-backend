import { client } from "../services/openai.js";
import fs from "fs";

function readTranscription(filePath) {
  try {
    const data = fs.readFileSync(filePath, "utf8");
    return data;
  } catch (err) {
    console.error("Error reading the file:", err);
    return null;
  }
}

async function extractScenesForGenre(transcription, genre) {
  const messages = [
    {
      role: "system",
      content:
        "You are a helpful assistant that extracts scenes from movie transcriptions based on genre.",
    },
    {
      role: "user",
      content: `Extract all ${genre}-related scenes from the following transcription. Each scene should be provided as a JSON object with "start" and "duration" fields, formatted as follows:\n\n[{ start: "00:00:10", duration: 15 }, { start: "00:01:00", duration: 20 }]\n\nTranscription:\n\n${transcription}`,
    },
  ];

  try {
    const response = await client.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: messages,
      max_tokens: 1500,
      temperature: 0.7,
    });
    console.log({ response });

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

export const createTrailerForGenre = async (genre) => {
  const transcriptionFile = "../Transcription.txt";
  const transcription = readTranscription(transcriptionFile);

  if (!transcription) {
    console.error("Transcription not found.");
    return;
  }

  console.log(`Generating ${genre} trailer...`);

  const genreScenes = await extractScenesForGenre(transcription, genre);

  if (genreScenes) {
    console.log(`Trailer script for ${genre} genre:\n`, genreScenes);

    // Save the trailer script to a JSON file
    fs.writeFileSync(
      "./trailerScript.json",
      JSON.stringify({ genre, scenes: genreScenes }, null, 2)
    );
    console.log(`Trailer script saved to trailerScript.json`);
  } else {
    console.log("No scenes found for the specified genre.");
  }
};

// createTrailerForGenre("romcom");
