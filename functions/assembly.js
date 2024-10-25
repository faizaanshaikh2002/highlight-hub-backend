import { AssemblyAI } from "assemblyai";
import { writeFile } from "fs/promises";

const client = new AssemblyAI({
  apiKey: "raaa",
});

const audioUrl = "./uploads/output.mp3";

const config = {
  audio_url: audioUrl,
};

const run = async () => {
  const transcript = await client.transcripts.transcribe({
    audio: audioUrl,
  });
  // throw error if transcript status is error
  if (transcript.status === "error") {
    throw new Error(transcript.error);
  }
  // generate SRT subtitles
  const srt = await client.transcripts.subtitles(transcript.id, "srt");
  await writeFile("./subtitles.srt", srt);

  //   console.log(transcript.text);
};

run();
