

import { Type } from "@google/genai";

// Schema for Gemini JSON response
export const BILL_RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    nome_titular: { type: Type.STRING, description: "Nome completo do titular da conta de energia." },
    cep: { type: Type.STRING, description: "CEP (Código de Endereçamento Postal) do endereço do titular. Formato: 00000-000" },
    mes_referencia: { type: Type.STRING, description: "Mês e ano da conta (ex: 10/2025)" },
    consumo_kwh: { type: Type.NUMBER, description: "O consumo final FATURADO (após abatimento dos créditos). Ex: 24.96" },
    valor_total: { type: Type.NUMBER, description: "Valor total da fatura em R$" },
    te: { type: Type.NUMBER, description: "Valor total cobrado como TE (Tarifa de Energia)" },
    tusd: { type: Type.NUMBER, description: "Valor total cobrado como TUSD (Uso do Sistema de Distribuição)" },
    bandeira: { type: Type.STRING, description: "Cor da bandeira tarifária vigente" },
    tem_energia_solar: { type: Type.BOOLEAN, description: "True se houver créditos, injeção, CAT ou saldo compensado." },
    energia_injetada: { type: Type.NUMBER, description: "Quantidade de kWh compensada/injetada (geralmente valor negativo ou CAT). Ex: 194.04" },
    saldo_acumulado: { type: Type.NUMBER, description: "Saldo de créditos acumulados para próximos meses." },
    tusd_gd: { type: Type.NUMBER, description: "Valor monetário (R$) cobrado como 'Fio B' ou 'TUSD GD'." },
    leituras: {
      type: Type.OBJECT,
      description: "Dados da tabela de medição do medidor.",
      properties: {
        atual: { type: Type.NUMBER, description: "Número da Leitura Atual do medidor." },
        anterior: { type: Type.NUMBER, description: "Número da Leitura Anterior do medidor." }
      }
    },
    historico: {
      type: Type.ARRAY,
      description: "Lista com o histórico de consumo dos últimos meses.",
      items: {
        type: Type.OBJECT,
        properties: {
          mes: { type: Type.STRING, description: "Mês" },
          consumo_kwh: { type: Type.NUMBER, description: "kWh" }
        }
      }
    },
    impostos: {
      type: Type.OBJECT,
      properties: {
        icms: { type: Type.NUMBER },
        pis: { type: Type.NUMBER },
        cofins: { type: Type.NUMBER }
      }
    },
    outros_itens: {
      type: Type.OBJECT,
      properties: {
        iluminacao_publica: { type: Type.NUMBER },
        energia_reativa: { type: Type.NUMBER }
      }
    }
  },
  required: ["consumo_kwh", "valor_total", "tem_energia_solar", "nome_titular", "cep"],
};

export const SYSTEM_INSTRUCTION = `
Você é um auditor especialista em faturas de energia elétrica (ANEEL).
Sua missão é desvendar a matemática da conta para o cliente de forma visual e didática.
Extraia o nome completo do titular da fatura.
Extraia o CEP do endereço do titular.

REGRAS CRÍTICAS PARA CLIENTES COM ENERGIA SOLAR:
1. A matemática da conta solar é: (Leitura Atual - Leitura Anterior) = Consumo Real.
2. Identifique a tabela de MEDIÇÃO. Extraia "Leitura Atual" e "Leitura Anterior".
3. Identifique a linha de créditos (CAT/Injeção).
4. O 'consumo_kwh' deve ser o valor FINAL (o resíduo ou taxa mínima).

Seja extremamente preciso ao capturar: Leitura Atual, Leitura Anterior e Crédito Compensado.
`;

export const ANALYSIS_PROMPT = `
Analise esta fatura.
1. Extraia o nome do titular.
2. Extraia o CEP do endereço.
3. Extraia Leitura Atual e Leitura Anterior da tabela de medição.
4. Identifique o valor de Energia Compensada/Injetada (CAT/Créditos).
5. Extraia TE, TUSD, Impostos e Histórico.
`;

export const SUMMARY_PROMPT_TEMPLATE = (data: any) => `
Aja como um consultor enviando mensagens no WhatsApp. Use linguagem simples, direta e abuse de emojis para explicar.
Dados: ${JSON.stringify(data)}.

Separe suas respostas usando exatamente a string "###". Cada bloco separado por ### será uma mensagem enviada com pausa.

ESTRUTURA OBRIGATÓRIA DA RESPOSTA:

Se for solar (tem_energia_solar=true):
Mensagem 1:
Parabenize pela decisão de ter energia solar. Diga que é um excelente investimento.
###
Mensagem 2:
Explique a matemática exata da medição em lista. Use este formato:
"Vamos aos números da sua geração:"
🟢 Leitura Atual: {valor}
🔴 Leitura Anterior: {valor}
⚡ **Consumo Real da Casa**: {cálculo de Atual - Anterior} kWh
###
Mensagem 3:
Explique o faturamento final em lista:
📉 **Energia Compensada (Seus Créditos)**: {valor da injeção/CAT} kWh
💰 **Energia Faturada (O que sobrou)**: {consumo_kwh} kWh
🔋 **Saldo/Excedente**: {valor do saldo se houver, ou 0} kWh
###
Mensagem 4:
Conclusão curta sobre o valor financeiro pago (Taxa mínima + Ilum. Pública).

Se NÃO for solar:
Mensagem 1:
Resumo direto do consumo e valor total.
###
Mensagem 2:
Lista detalhada de para onde foi o dinheiro:
🏢 Distribuição/Energia: R$ {valor}
🏛️ Impostos (ICMS/PIS/COFINS): R$ {valor}
💡 Iluminação Pública: R$ {valor}
###
Mensagem 3:
Alerta sobre a bandeira tarifária e se o consumo está alto para a média.

CONSTRAINT NEGATIVA:
- NÃO termine com despedidas como "Espero ter ajudado", "Qualquer dúvida". O sistema encerrará a conversa.
`;