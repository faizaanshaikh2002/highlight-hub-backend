import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

console.log({ api: process.env.OPENAI_API_KEY });

export const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
