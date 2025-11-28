import React from 'react';
import { ScanSearch } from 'lucide-react';

const ProcessingScreen: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-brand-primary rounded-full blur-2xl opacity-10 animate-pulse"></div>
        <div className="relative bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
          <ScanSearch className="text-brand-primary w-12 h-12 animate-pulse" strokeWidth={1.5} />
        </div>
      </div>
      
      <h2 className="text-2xl font-bold text-slate-900 mb-3">Auditando sua fatura...</h2>
      
      <div className="max-w-md w-full text-center space-y-2">
        <p className="text-slate-500 text-sm">Separando TUSD (Fio) de TE (Energia)...</p>
        <p className="text-slate-500 text-sm">Identificando impostos e bandeiras...</p>
      </div>

      <div className="mt-8 w-48 h-1 bg-slate-100 rounded-full overflow-hidden">
        <div className="h-full bg-brand-primary animate-[loading_1.5s_ease-in-out_infinite]"></div>
      </div>
      
      <style>{`
        @keyframes loading {
          0% { width: 0%; margin-left: 0; }
          50% { width: 100%; margin-left: 0; }
          100% { width: 0%; margin-left: 100%; }
        }
      `}</style>
    </div>
  );
};

export default ProcessingScreen;