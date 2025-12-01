

export interface BillData {
  nome_titular: string | null;
  mes_referencia: string | null;
  consumo_kwh: number | null; // Consumo Faturado (Final)
  valor_total: number | null;
  cep: string | null; // CEP extraído da conta
  te: number | null;
  tusd: number | null;
  bandeira: string | null;
  tem_energia_solar: boolean; 
  
  // Campos específicos de Solar (Geração Distribuída)
  energia_injetada: number | null; // O valor do crédito (ex: 194.04)
  saldo_acumulado: number | null;
  tusd_gd: number | null; 
  
  // Medição / Leitura
  leituras: {
    atual: number | null;
    anterior: number | null;
  };

  historico: Array<{ mes: string; consumo_kwh: number }>;
  
  impostos: {
    icms: number | null;
    pis: number | null;
    cofins: number | null;
  };
  outros_itens: {
    iluminacao_publica: number | null;
    energia_reativa: number | null;
  };
  analise_informal?: string;
}

export interface SolarCalculation {
  economia_mensal: number;
  economia_anual: number;
  economia_5anos: number;
  economia_25anos: number;
  tamanho_sistema_kwp: number;
  nova_conta_estimada: number;
}

export interface LeadData {
  nome: string;
  whatsapp: string;
  cep: string;
  estado: string;
}

export enum AppStep {
  UPLOAD = 'UPLOAD',
  PROCESSING = 'PROCESSING',
  RESULTS = 'RESULTS',
  LEAD_CAPTURE = 'LEAD_CAPTURE',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}