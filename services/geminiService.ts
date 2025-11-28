import { GoogleGenAI, HarmCategory, HarmBlockThreshold } from "@google/genai";
import { BillData } from "../types";
import { BILL_RESPONSE_SCHEMA, SYSTEM_INSTRUCTION, ANALYSIS_PROMPT, SUMMARY_PROMPT_TEMPLATE } from "../constants";

// Inicialização segura: O Vite substituirá process.env.API_KEY pelo valor real no build
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("Aviso: API_KEY não detectada nas variáveis de ambiente. Verifique o arquivo .env ou as configurações da Vercel.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY || '' });

export const analyzeBillImage = async (base64Image: string, mimeType: string): Promise<BillData> => {
  try {
    const modelId = "gemini-2.5-flash"; // Modelo rápido e eficiente

    // 1. Extração de Dados (OCR + Visão)
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
        temperature: 0.1,
        // Configurações de segurança permissivas para leitura de documentos
        safetySettings: [
           { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
           { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
           { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
           { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE }
        ]
      },
    });

    const jsonText = dataResponse.text;
    if (!jsonText) throw new Error("A IA retornou uma resposta vazia.");
    
    // Limpeza de sanitização para remover blocos de código Markdown
    const cleanJson = jsonText.replace(/```json/g, '').replace(/```/g, '').trim();

    const billData = JSON.parse(cleanJson);

    // 2. Geração de Resumo (Texto Criativo)
    const summaryResponse = await ai.models.generateContent({
      model: modelId,
      contents: SUMMARY_PROMPT_TEMPLATE(billData),
      config: {
        temperature: 0.7,
      }
    });

    return {
      ...billData,
      analise_informal: summaryResponse.text || "Resumo indisponível.",
    };

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    if (error.message?.includes("API Key")) {
        throw new Error("Erro de autenticação da API. Verifique a chave VITE_API_KEY na Vercel.");
    }
    throw new Error(error.message || "Falha ao processar a conta. Tente uma imagem mais clara.");
  }
};