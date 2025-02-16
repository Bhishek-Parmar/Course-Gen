/*
 * Install the Generative AI SDK
 *
 * $ npm install @google/generative-ai
 */

const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
};

// Export both models with different configurations
export const GenerateCourseLayout_AI = model.startChat({
  generationConfig,
  history: [] // Remove the specific history for more generic responses
});

export const GenerateChapterContent_AI = model.startChat({
  generationConfig,
  history: [] // Clean history for chapter content
});
