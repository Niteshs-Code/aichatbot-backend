import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

export async function getAIReply(message) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: message
    });

    return response.text || "No AI response";

  } catch (error) {
    console.log("AI Error:", error);
    return "AI service error";
  }
}


