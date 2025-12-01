import React, { useState } from 'react';
import { AppStep, BillData, SolarCalculation, LeadData } from './types';
import { analyzeBillImage } from './services/geminiService';
import UploadScreen from './components/UploadScreen';
import ProcessingScreen from './components/ProcessingScreen';
import ResultsScreen from './components/ResultsScreen';
import LeadForm from './components/LeadForm';
import SuccessScreen from './components/SuccessScreen';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfUse from './components/TermsOfUse';
import { Lightbulb, Lock, ShieldCheck } from 'lucide-react';

export default function App() {
  const [step, setStep] = useState<AppStep>(AppStep.UPLOAD);
  const [billData, setBillData] = useState<BillData | null>(null);
  const [solarCalc, setSolarCalc] = useState<SolarCalculation | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  // Helper to convert File to Base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = error => reject(error);
    });
  };
  
  // Função Centralizada para Webhook com Título Dinâmico
  const sendWebhookEvent = async (tituloNotificacao: string, eventBillData: BillData | null, leadDetails?: LeadData) => {
    const dataToUse = eventBillData || billData;

    const valorFormatado = dataToUse?.valor_total 
      ? `R$ ${dataToUse.valor_total.toFixed(2).replace('.', ',')}` 
      : "R$ 0,00";
      
    const consumoFormatado = dataToUse?.consumo_kwh 
      ? `${dataToUse.consumo_kwh}kwh` 
      : "0kwh";

    const mesReferencia = dataToUse?.mes_referencia || "Não identificado";
    const nomeTitular = dataToUse?.nome_titular || "Não identificado";

    const payload = {
      titulo_notificacao: tituloNotificacao,
      evento: tituloNotificacao.replace(/\s+/g, '_').toUpperCase(),
      "Nome do Titular": nomeTitular,
      "Nome completo": leadDetails?.nome || "N/A",
      "whatsapp": leadDetails?.whatsapp || "N/A",
      "cep": leadDetails?.cep || "N/A",
      "UF": leadDetails?.estado || "N/A",
      "valor da conta": valorFormatado,
      "referencia das conta": mesReferencia,
      "consumo em kwh da conta": consumoFormatado
    };

    try {
      await fetch('https://webhooks-mvp.crescimentoespiritual.com.br/webhook/contaexplicada', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } catch (error) {
      console.error(`Erro ao enviar evento '${tituloNotificacao}' para webhook:`, error);
    }
  };


  const handleFileSelected = async (file: File) => {
    setStep(AppStep.PROCESSING);
    try {
      const base64 = await fileToBase64(file);
      const mimeType = file.type;
      
      const data = await analyzeBillImage(base64, mimeType);
      
      // Envia o evento de análise concluída ANTES de mostrar os resultados
      await sendWebhookEvent(`Análise Concluída: ${data.nome_titular || 'Titular não encontrado'}`, data);

      setBillData(data);
      setStep(AppStep.RESULTS);

    } catch (error: any) {
      alert(error.message || "Não foi possível ler a conta com clareza. Por favor, tente uma foto mais nítida e bem iluminada.");
      setStep(AppStep.UPLOAD);
      console.error(error);
    }
  };

  const handleContinueToLead = (calc: SolarCalculation) => {
    setSolarCalc(calc);
    // Evento: Usuário demonstrou interesse
    sendWebhookEvent("Usuário clicou em: 'Sim, quero a simulação completa'", billData);
    setStep(AppStep.LEAD_CAPTURE);
  };

  const handleLeadSubmit = async (leadData: LeadData) => {
    setIsSubmitting(true);
    // Evento: Usuário preencheu e enviou o formulário
    await sendWebhookEvent("Novo Lead Qualificado (Formulário Preenchido)", billData, leadData);
    setIsSubmitting(false);
    setStep(AppStep.SUCCESS);
  };

  const handleReset = () => {
    setBillData(null);
    setSolarCalc(null);
    setStep(AppStep.UPLOAD);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col">
      {/* Header Profissional */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm/50 backdrop-blur-md bg-white/90">
        <div className="max-w-5xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={handleReset}>
            <div className="bg-brand-primary p-2 rounded-lg text-white shadow-lg shadow-brand-primary/20">
              <Lightbulb size={24} strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="font-bold text-2xl text-slate-900 tracking-tight leading-none">ContaExplicada</h1>
            </div>
          </div>
          <nav className="hidden md:flex gap-6 text-sm font-medium text-slate-600">
            <button onClick={handleReset} className="hover:text-brand-primary transition-colors">Nova Análise</button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full flex-grow relative">
        {step === AppStep.UPLOAD && (
          <UploadScreen onFileSelected={handleFileSelected} />
        )}
        
        {step === AppStep.PROCESSING && (
          <ProcessingScreen />
        )}

        {step === AppStep.RESULTS && billData && (
          <ResultsScreen 
            data={billData} 
            onContinue={handleContinueToLead} 
            onReset={handleReset}
          />
        )}

        {step === AppStep.LEAD_CAPTURE && billData && (
          <LeadForm 
            onSubmit={handleLeadSubmit} 
            isSubmitting={isSubmitting} 
            initialName={billData.nome_titular || ''}
            initialCep={billData.cep || ''}
          />
        )}

        {step === AppStep.SUCCESS && (
          <SuccessScreen onReset={handleReset} />
        )}

        {/* Modal de Privacidade */}
        {showPrivacy && (
          <PrivacyPolicy onClose={() => setShowPrivacy(false)} />
        )}

        {/* Modal de Termos */}
        {showTerms && (
          <TermsOfUse onClose={() => setShowTerms(false)} />
        )}
      </main>

      {/* Footer LGPD & Profissional */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800 mt-auto">
        <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-2">
            <h4 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
              <ShieldCheck size={20} className="text-brand-primary" />
              ContaExplicada
            </h4>
            <p className="text-sm leading-relaxed max-w-sm mb-4">
              Nossa missão é trazer transparência para o setor elétrico brasileiro, traduzindo faturas complexas em informações úteis e acionáveis.
            </p>
          </div>
          
          <div>
            <h5 className="text-white font-semibold mb-3">Legal</h5>
            <ul className="space-y-2 text-sm">
              <li>
                <button 
                  onClick={() => setShowPrivacy(true)}
                  className="hover:text-white transition-colors text-left"
                >
                  Política de Privacidade
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setShowTerms(true)}
                  className="hover:text-white transition-colors text-left"
                >
                  Termos de Uso
                </button>
              </li>
              <li><button onClick={() => setShowPrivacy(true)} className="hover:text-white transition-colors text-left">Compliance</button></li>
            </ul>
          </div>

          <div>
            <h5 className="text-white font-semibold mb-3">Segurança</h5>
            <div className="flex items-start gap-2 text-xs leading-relaxed bg-slate-800 p-3 rounded-lg border border-slate-700">
              <Lock size={14} className="mt-0.5 text-brand-primary flex-shrink-0" />
              <p>Seguimos rigorosamente a <strong>LGPD (Lei nº 13.709)</strong>. Seus dados são utilizados apenas para a finalidade de análise e não são compartilhados sem consentimento.</p>
            </div>
          </div>
        </div>
        
        <div className="max-w-5xl mx-auto px-6 pt-8 border-t border-slate-800 text-xs text-center md:text-left flex flex-col md:flex-row justify-between items-center">
          <p>© {new Date().getFullYear()} ContaExplicada. Uma ferramenta exclusiva <strong>RC Solar</strong>. Todos os direitos reservados.</p>
          <p className="mt-2 md:mt-0 opacity-60">Tecnologia de OCR e IA processada via Google Cloud.</p>
        </div>
      </footer>
    </div>
  );
}