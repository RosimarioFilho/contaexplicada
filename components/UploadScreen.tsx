import React, { useCallback, useState } from 'react';
import { Upload, Camera, FileText, ShieldCheck, Search, FileJson, Sparkles, BrainCircuit, CheckCircle2 } from 'lucide-react';

interface UploadScreenProps {
  onFileSelected: (file: File) => void;
}

const UploadScreen: React.FC<UploadScreenProps> = ({ onFileSelected }) => {
  const [dragActive, setDragActive] = useState(false);

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

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-6 py-12 bg-slate-50">
      
      {/* Hero Section */}
      <div className="text-center mb-10 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-brand-primary text-xs font-bold uppercase tracking-wider mb-4 border border-blue-100">
          <Sparkles size={14} />
          Tecnologia RC Solar
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight leading-tight">
          Sua conta de energia,<br/> 
          <span className="text-brand-primary">finalmente explicada.</span>
        </h1>
        <p className="text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
          Use nossa IA para entender exatamente o que você paga e descubra se existe uma forma mais inteligente de consumir energia.
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
            <p className="text-slate-500">Ou escolha uma opção abaixo</p>
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
      <div className="w-full max-w-6xl grid md:grid-cols-3 gap-8">
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

      <div className="mt-16 flex items-center gap-2 text-xs text-slate-400 font-medium bg-slate-100 px-4 py-2 rounded-full">
        <ShieldCheck size={14} className="text-green-500" />
        <span>Seus dados são processados de forma anônima e segura.</span>
      </div>
    </div>
  );
};

export default UploadScreen;