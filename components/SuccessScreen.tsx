import React from 'react';
import { Send, Check, RotateCcw } from 'lucide-react';

interface SuccessScreenProps {
  onReset: () => void;
}

const SuccessScreen: React.FC<SuccessScreenProps> = ({ onReset }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center animate-reveal">
      <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center text-white mb-8 shadow-green-200 shadow-2xl animate-[bounce_1s_infinite]">
        <Check size={48} strokeWidth={3} />
      </div>

      <h1 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight">Solicitação Confirmada</h1>
      
      <p className="text-slate-600 max-w-md mb-10 text-lg leading-relaxed">
        Recebemos seus dados. Em breve, um especialista enviará o estudo de viabilidade detalhado para seu WhatsApp.
      </p>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm max-w-sm w-full mb-12">
        <div className="flex items-center gap-4 text-left">
          <div className="bg-green-50 p-3 rounded-full text-green-600">
            <Send size={24} />
          </div>
          <div>
            <p className="font-bold text-slate-800">Próximo Passo</p>
            <p className="text-sm text-slate-500">Aguarde o PDF no seu WhatsApp em ~30 min.</p>
          </div>
        </div>
      </div>
      
      <button 
        onClick={onReset}
        className="text-brand-primary font-medium hover:text-brand-dark transition-colors flex items-center gap-2 py-2 px-4 rounded-lg hover:bg-blue-50"
      >
        <RotateCcw size={18} />
        Analisar nova conta
      </button>
    </div>
  );
};

export default SuccessScreen;