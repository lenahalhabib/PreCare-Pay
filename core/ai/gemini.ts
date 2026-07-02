import { GoogleGenAI } from "@google/genai";
import { EXTRACT_PLAN_PROMPT } from "./prompts";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export async function extractTreatmentPlan(text: string) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `
${EXTRACT_PLAN_PROMPT}

Treatment Plan:

${text}
`,
  });

  return response.text;
}