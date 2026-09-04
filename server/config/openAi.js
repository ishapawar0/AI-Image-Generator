import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env") });

if (!process.env.GEMINI_API_KEY) {
  console.error("❌ GEMINI_API_KEY is undefined in process.env");
} else {
  console.log("✅ GEMINI_API_KEY detected in openAi.js!");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export default genAI;