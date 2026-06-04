import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Ensure .env is loaded if this file is imported early
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error('CRITICAL ERROR: GEMINI_API_KEY is not defined in the environment variables.');
  console.error('Please ensure that you have added it to your backend/.env file.');
  process.exit(1);
}

// Initialize and export the configured GoogleGenAI instance
const ai = new GoogleGenAI({ apiKey });

export default ai;
