import { GoogleGenAI } from "@google/genai";
import { EXTRACT_PLAN_PROMPT } from "./prompts";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export type ExtractedPlanItem = {
  serviceName: string;
  toothNumber: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
};

export type ExtractedTreatmentPlan = {
  patientName: string;
  clinicName: string;
  insurance: string;
  items: ExtractedPlanItem[];
  totalAmount: number;
};

function cleanJsonResponse(value: string) {
  return value
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();
}

function normalizePlan(plan: Partial<ExtractedTreatmentPlan>): ExtractedTreatmentPlan {
  const items = Array.isArray(plan.items) ? plan.items : [];

  const normalizedItems = items.map((item) => {
    const quantity = Number(item.quantity) || 1;
    const unitPrice = Number(item.unitPrice) || 0;
    const totalPrice = Number(item.totalPrice) || unitPrice * quantity;

    return {
      serviceName: item.serviceName || "Dental Service",
      toothNumber: item.toothNumber || "",
      quantity,
      unitPrice,
      totalPrice,
    };
  });

  const calculatedTotal = normalizedItems.reduce(
    (sum, item) => sum + item.totalPrice,
    0
  );

  return {
    patientName: plan.patientName || "",
    clinicName: plan.clinicName || "",
    insurance: plan.insurance || "",
    items: normalizedItems,
    totalAmount: Number(plan.totalAmount) || calculatedTotal,
  };
}

export async function extractTreatmentPlanFromText(
  text: string
): Promise<ExtractedTreatmentPlan> {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [
      {
        role: "user",
        parts: [
          {
            text: `${EXTRACT_PLAN_PROMPT}

Treatment Plan Text:
${text}`,
          },
        ],
      },
    ],
  });

  const cleaned = cleanJsonResponse(response.text || "{}");
  const parsed = JSON.parse(cleaned);

  return normalizePlan(parsed);
}

export async function extractTreatmentPlanFromFile(
  file: File
): Promise<ExtractedTreatmentPlan> {
  const arrayBuffer = await file.arrayBuffer();
  const base64 = Buffer.from(arrayBuffer).toString("base64");

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [
      {
        role: "user",
        parts: [
          {
            text: EXTRACT_PLAN_PROMPT,
          },
          {
            inlineData: {
              mimeType: file.type,
              data: base64,
            },
          },
        ],
      },
    ],
  });

  console.log(response.text);
  const cleaned = cleanJsonResponse(response.text || "{}");
  const parsed = JSON.parse(cleaned);
  console.log("GEMINI RAW RESPONSE:", response.text);
  console.log("PARSED PLAN:", parsed);
  return normalizePlan(parsed);
}