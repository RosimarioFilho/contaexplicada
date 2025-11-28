import { GoogleGenAI, Type } from "@google/genai";
import { BillData } from "../types";
import { BILL_RESPONSE_SCHEMA, SYSTEM_INSTRUCTION, ANALYSIS_PROMPT, SUMMARY_PROMPT_TEMPLATE } from "../constants";

// Initialize Gemini Client
// In a real production app, ensure API_KEY is set in environment variables.
// For this generated code, we assume process.env.API_KEY is available.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const analyzeBillImage = async (base64Image: string, mimeType: string): Promise<BillData> => {
  try {
    const modelId = "gemini-2.5-flash"; // High performance, low latency

    // 1. Extract Data (OCR + Interpretation)
    const dataResponse = await ai.models.generateContent({
      model: modelId,
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Image,
              mimeType: mimeType,
            },
          },
          {
            text: ANALYSIS_PROMPT,
          },
        ],
      },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: BILL_RESPONSE_SCHEMA,
        temperature: 0.1, // Low temperature for factual extraction
      },
    });

    const jsonText = dataResponse.text;
    if (!jsonText) throw new Error("Falha ao extrair dados da conta.");
    
    const billData = JSON.parse(jsonText);

    // 2. Generate Friendly Summary (Text Generation)
    // We do a second lighter call or chain it. Here distinct for clarity.
    const summaryResponse = await ai.models.generateContent({
      model: modelId,
      contents: SUMMARY_PROMPT_TEMPLATE(billData),
      config: {
        temperature: 0.7, // Higher for creative/friendly tone
      }
    });

    return {
      ...billData,
      analise_informal: summaryResponse.text || "Não foi possível gerar o resumo.",
    };

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Erro ao processar a imagem. Tente novamente com uma foto mais nítida.");
  }
};
