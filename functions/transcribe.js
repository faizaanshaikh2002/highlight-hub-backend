import { AssemblyAI } from "assemblyai";
import { writeFile } from "fs/promises";
import dotenv from "dotenv";
dotenv.config();

const client = new AssemblyAI({
	apiKey: process.env.ASSEMBLY_API_KEY,
});

export const transcribeAudio = async (audioPath) => {
	const transcript = await client.transcripts.transcribe({
		audio: audioPath,
	});

	if (transcript.status === "error") {
		throw new Error(transcript.error);
	}

	const srt = await client.transcripts.subtitles(transcript.id, "srt");
	console.log("----SRT Generated----");

	return srt;

	// await writeFile("./subtitles.srt", srt);
};
