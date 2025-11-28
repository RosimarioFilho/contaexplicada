
import React, { useCallback, useState } from 'react';
import { Upload, Camera, FileText, ShieldCheck, Search, FileJson, Sparkles, BrainCircuit, CheckCircle2, ChevronDown, Zap } from 'lucide-react';

interface UploadScreenProps {
  onFileSelected: (file: File) => void;
}

const UploadScreen: React.FC<UploadScreenProps> = ({ onFileSelected }) => {
  const [dragActive, setDragActive] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileSelected(e.dataTransfer.files[0]);
    }
  }, [onFileSelected]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      onFileSelected(e.target.files[0]);
    }
  };

  const steps = [
    {
      icon: <FileText className="w-8 h-8 text-brand-primary" strokeWidth={1.5} />,
      title: "Envie sua conta",
      desc: "Basta tirar uma foto ou enviar o PDF da fatura. Aceitamos de todas as distribuidoras."
    },
    {
      icon: <BrainCircuit className="w-8 h-8 text-brand-primary" strokeWidth={1.5} />,
      title: "Nossa IA Analista",
      desc: "Nossa inteligência artificial audita cada linha, separando impostos, TUSD e consumo real."
    },
    {
      icon: <CheckCircle2 className="w-8 h-8 text-brand-primary" strokeWidth={1.5} />,
      title: "Você entende tudo",
      desc: "Receba um relatório mastigado, simples e direto. Sem 'economês' ou termos técnicos difíceis."
    }
  ];

  const faqs = [
    {
      q: "O que é TUSD na conta de luz?",
      a: "TUSD significa Tarifa de Uso do Sistema de Distribuição. Basicamente, é o valor que você paga pelo transporte da energia até a sua casa (fios, postes e transformadores), não pela energia em si. Ela compõe grande parte da sua conta de luz."
    },
    {
      q: "O que é TE na conta de energia?",
      a: "TE significa Tarifa de Energia. É o valor cobrado pela energia que você efetivamente consumiu em sua residência. Diferente da TUSD (transporte), a TE refere-se ao produto 'eletricidade' gerado nas usinas."
    },
    {
      q: "O que é Energia Consumida?",
      a: "É a quantidade total de eletricidade que sua residência puxou da rede da distribuidora (concessionária). Para quem tem energia solar, isso geralmente ocorre à noite ou em dias muito nublados, quando a geração dos painéis não supre toda a demanda da casa."
    },
    {
      q: "O que é Energia Injetada?",
      a: "É o excedente de energia que seu sistema solar produziu e sua casa não consumiu na hora. Essa sobra é enviada para a rede da concessionária e se transforma em créditos energéticos para abater o seu consumo da rede."
    },
    {
      q: "O que é Energia Excedente?",
      a: "Ocorre quando você injeta mais energia na rede do que consome dentro do mesmo ciclo de faturamento. Esse saldo positivo fica acumulado na distribuidora e pode ser usado para abater contas dos próximos meses (validade de até 60 meses)."
    },
    {
      q: "O que é Energia Faturada?",
      a: "É a quantidade de kWh que você efetivamente paga após a compensação dos créditos solares. O cálculo básico é: (Consumo da Rede) - (Energia Injetada). Se seus créditos zerarem o consumo, você paga apenas o Custo de Disponibilidade (Taxa Mínima) ou a TUSD GD."
    },
    {
      q: "O que é GD II (Taxa) pelo uso da rede?",
      a: "Refere-se à regra da Lei 14.300 (Marco Legal da Geração Distribuída). É uma cobrança proporcional sobre a energia que você injeta na rede e depois consome de volta (compensação). Essa taxa remunera a distribuidora pelo uso da infraestrutura (Fio B) para transportar sua energia solar."
    },
    {
      q: "Como analisar minha 2ª via de conta de luz?",
      a: "Antes de pagar a 2ª via da sua conta de luz, é fundamental verificar se os valores estão corretos. Nossa ferramenta lê seu PDF ou foto e detalha se houve cobrança indevida ou se o consumo está acima da média, te ajudando a economizar nas próximas."
    },
    {
      q: "Como funciona a leitura de conta com IA?",
      a: "Utilizamos inteligência artificial avançada para fazer o OCR (leitura óptica) da sua conta de energia. O sistema identifica automaticamente campos como Leitura Atual, Bandeira Tarifária, PIS, COFINS e ICMS, entregando um resumo simples em segundos."
    }
  ];

  const distributors = [
    "Enel", "CPFL", "Cemig", "Light", "Copel", "Neoenergia", "Equatorial", "RGE", "Energisa", "Coelba", "Elektro"
  ];

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] bg-slate-50">
      
      {/* Hero Section */}
      <div className="w-full max-w-5xl px-6 py-12 flex flex-col items-center">
        <div className="text-center mb-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-brand-primary text-xs font-bold uppercase tracking-wider mb-4 border border-blue-100">
            <Sparkles size={14} />
            Tecnologia RC Solar
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight leading-tight">
            Análise Inteligente da sua<br/> 
            <span className="text-brand-primary">Conta de Energia</span>
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Vai emitir a <strong>2ª via da conta</strong>? Antes de pagar, use nossa IA para auditar erros, entender o que é TUSD/TE e descobrir se você está pagando impostos a mais.
          </p>
        </div>

        {/* Upload Area */}
        <div 
          className={`w-full max-w-2xl p-10 rounded-3xl border-2 border-dashed transition-all duration-300 bg-white shadow-xl shadow-slate-200/50 mb-16 group relative overflow-hidden ${dragActive ? 'border-brand-primary bg-blue-50/50 scale-[1.02]' : 'border-slate-300 hover:border-brand-primary/50'}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="relative z-10 flex flex-col items-center gap-6">
            <div className="p-6 bg-slate-50 rounded-full text-slate-400 group-hover:text-brand-primary group-hover:bg-blue-100 transition-all duration-500">
              <Upload size={48} strokeWidth={1.5} />
            </div>
            
            <div className="text-center">
              <p className="font-bold text-2xl text-slate-800 mb-2">Arraste seu PDF ou Foto aqui</p>
              <p className="text-slate-500">Analise faturas de qualquer distribuidora</p>
            </div>

            <div className="flex flex-col sm:flex-row w-full gap-4 max-w-md mt-4">
              <label className="flex-1 flex items-center justify-center py-4 px-6 bg-brand-primary hover:bg-blue-800 text-white rounded-xl cursor-pointer font-bold transition-all shadow-lg shadow-blue-900/20 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0">
                <FileText className="mr-2" size={20} />
                Buscar Arquivo
                <input type="file" className="hidden" accept="image/*,.pdf" onChange={handleChange} />
              </label>

              <label className="flex-1 flex items-center justify-center py-4 px-6 bg-white border-2 border-slate-100 hover:border-brand-primary/30 text-slate-700 rounded-xl cursor-pointer font-bold transition-all hover:bg-slate-50 hover:text-brand-primary">
                <Camera className="mr-2" size={20} />
                Tirar Foto
                <input type="file" className="hidden" accept="image/*" capture="environment" onChange={handleChange} />
              </label>
            </div>
          </div>
        </div>

        {/* Improved Cards Section */}
        <div className="w-full grid md:grid-cols-3 gap-8 mb-20">
          {steps.map((step, idx) => (
            <div key={idx} className="relative group bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
              {/* Step Number Background */}
              <div className="absolute top-0 right-0 p-4 opacity-5 text-6xl font-black text-brand-primary group-hover:opacity-10 transition-opacity select-none font-mono">
                0{idx + 1}
              </div>
              
              <div className="w-16 h-16 bg-blue-50 group-hover:bg-brand-primary text-brand-primary group-hover:text-white rounded-2xl flex items-center justify-center mb-6 transition-colors duration-300 shadow-inner">
                {React.cloneElement(step.icon as React.ReactElement<any>, { className: "w-8 h-8 transition-colors duration-300" })}
              </div>
              
              <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-brand-primary transition-colors">
                {step.title}
              </h3>
              <p className="text-slate-600 leading-relaxed text-sm font-medium">
                {step.desc}
              </p>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400 font-medium bg-slate-100 px-4 py-2 rounded-full mb-12">
          <ShieldCheck size={14} className="text-green-500" />
          <span>Seus dados são processados de forma anônima e segura.</span>
        </div>

        {/* SEO: Supported Distributors Section */}
        <section className="w-full max-w-4xl mb-20 text-center">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Compatível com contas de todo o Brasil</h3>
            <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-4">
                {distributors.map((dist, i) => {
                    const isNeoenergia = dist === "Neoenergia";
                    return (
                        <span 
                            key={i} 
                            className={`text-lg transition-all duration-300 cursor-default flex items-center justify-center
                                ${isNeoenergia 
                                    ? "font-black text-green-700 opacity-100 scale-110 bg-green-50 px-4 py-1.5 rounded-full border border-green-200 shadow-sm" 
                                    : "font-semibold text-slate-400 opacity-50 grayscale hover:grayscale-0 hover:text-brand-primary hover:opacity-100"
                                }
                            `}
                        >
                            {dist}
                        </span>
                    );
                })}
            </div>
        </section>

        {/* SEO FAQ Section */}
        <section className="w-full max-w-3xl">
          <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">Dúvidas Frequentes sobre Conta de Luz</h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-brand-primary/30 transition-colors">
                <button 
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center justify-between p-5 text-left font-semibold text-slate-800 focus:outline-none"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`text-slate-400 transition-transform duration-300 ${openFaq === index ? 'rotate-180 text-brand-primary' : ''}`} />
                </button>
                <div 
                  className={`px-5 text-slate-600 leading-relaxed text-sm transition-all duration-300 ease-in-out ${openFaq === index ? 'max-h-60 pb-5 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}
                >
                  {faq.a}
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
};

export default UploadScreen;
