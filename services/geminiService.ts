import { GoogleGenAI, Type, HarmCategory, HarmBlockThreshold } from "@google/genai";
import { BillData } from "../types";
import { BILL_RESPONSE_SCHEMA, SYSTEM_INSTRUCTION, ANALYSIS_PROMPT, SUMMARY_PROMPT_TEMPLATE } from "../constants";

// Função robusta para capturar a API Key em diferentes ambientes (Vite, Vercel, Local)
const getApiKey = (): string => {
  // 1. Tenta pegar via import.meta.env (Padrão Vite)
  try {
    // Cast para 'any' para evitar erros de TS se o compilador não reconhecer 'env'
    const meta = import.meta as any;
    // Verifica se meta.env existe antes de tentar acessar a propriedade
    if (meta && meta.env && meta.env.VITE_API_KEY) {
      return meta.env.VITE_API_KEY;
    }
  } catch (e) {
    // Silencia erros de acesso ao import.meta
  }

  // 2. Tenta pegar via process.env (Fallback para Node/Alguns ambientes de Build)
  try {
    // Acessa via globalThis para evitar erro TS2580 (Cannot find name 'process') sem @types/node
    const globalEnv = globalThis as any;
    if (globalEnv.process && globalEnv.process.env && globalEnv.process.env.VITE_API_KEY) {
      return globalEnv.process.env.VITE_API_KEY;
    }
  } catch (e) {
    // Silencia erros
  }

  return '';
};

const apiKey = getApiKey();

// Se não tiver chave, não quebra a inicialização do app, mas vai falhar ao tentar usar
const ai = apiKey ? new GoogleGenAI({ apiKey: apiKey }) : null;

if (!apiKey) {
  console.warn("⚠️ VITE_API_KEY não encontrada. O upload falhará se não for configurada na Vercel.");
}

export const analyzeBillImage = async (base64Image: string, mimeType: string): Promise<BillData> => {
  // Validação explícita na hora da chamada
  if (!ai || !apiKey) {
    throw new Error("Chave de API não configurada. Configure a variável de ambiente VITE_API_KEY no painel da Vercel.");
  }

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
        // Safety Settings Permissivos para evitar bloqueio de leitura de documentos
        // Usando Enums corretos do @google/genai
        safetySettings: [
           { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
           { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
           { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
           { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE }
        ]
      },
    });

    const jsonText = dataResponse.text;
    if (!jsonText) throw new Error("Falha ao extrair dados da conta (Resposta vazia da IA).");
    
    // Limpeza de sanitização caso a IA mande markdown ```json
    const cleanJson = jsonText.replace(/```json/g, '').replace(/```/g, '').trim();

    const billData = JSON.parse(cleanJson);

    // 2. Generate Friendly Summary (Text Generation)
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

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    // Repassa mensagem de erro mais amigável
    if (error.message && error.message.includes("API Key")) {
        throw new Error("Erro de configuração de API Key.");
    }
    throw new Error(error.message || "Erro ao processar a imagem. Tente novamente com uma foto mais nítida.");
  }
};