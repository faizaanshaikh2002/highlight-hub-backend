import express from "express";
import { createTrailerForGenre } from "./functions/trailer.js";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());

// Basic route
app.get("/", async (req, res) => {
	await createTrailerForGenre("romcom");
	res.send("Welcome to the Express CRUD API!");
});

app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});
