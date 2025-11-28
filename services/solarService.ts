import { BillData, SolarCalculation } from "../types";

export const calculateSolarSavings = (data: BillData): SolarCalculation => {
  const consumo = data.consumo_kwh || 0;
  const valorTotal = data.valor_total || 0;
  const iluminacaoPublica = data.outros_itens?.iluminacao_publica || 0;

  // Heuristics for Brazilian Market
  // Average solar generation factor ~ 150 kWh/kWp/month (varies by region, avg used here)
  const fatorGeracao = 130; 
  
  // Taxa Mínima (Disponibilidade) - estimating bifasico usually 50kWh cost equivalent
  // Approximating minimum bill cost to ~ R$ 50.00 + Ilum Pub if not provided
  const custoMinimoEstimado = 50 + iluminacaoPublica;

  const economiaMensalEstimada = Math.max(0, valorTotal - custoMinimoEstimado);
  
  // System Size
  const tamanhoSistema = Number((consumo / fatorGeracao).toFixed(2));

  return {
    tamanho_sistema_kwp: tamanhoSistema,
    economia_mensal: Number(economiaMensalEstimada.toFixed(2)),
    economia_anual: Number((economiaMensalEstimada * 12).toFixed(2)),
    economia_5anos: Number((economiaMensalEstimada * 12 * 5).toFixed(2)),
    economia_25anos: Number((economiaMensalEstimada * 12 * 25).toFixed(2)),
    nova_conta_estimada: Number(custoMinimoEstimado.toFixed(2))
  };
};
