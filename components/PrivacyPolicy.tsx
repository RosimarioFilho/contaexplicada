import React from 'react';
import { X, Shield } from 'lucide-react';

interface PrivacyPolicyProps {
  onClose: () => void;
}

const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[85vh] shadow-2xl relative z-10 flex flex-col animate-reveal">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50 rounded-t-2xl">
          <div className="flex items-center gap-2 text-slate-800">
            <Shield className="text-brand-primary" size={24} />
            <h2 className="text-xl font-bold">Política de Privacidade</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500 hover:text-slate-800"
          >
            <X size={24} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-8 overflow-y-auto text-slate-600 leading-relaxed space-y-6 text-sm md:text-base">
          
          <section>
            <p className="mb-4">
              A sua privacidade é importante para nós. É política do <strong>ContaExplicada</strong> respeitar a sua privacidade em relação a qualquer informação sua que possamos coletar no site <a href="#" className="text-brand-primary hover:underline">ContaExplicada</a>, e outros sites que possuímos e operamos.
            </p>
            <p className="mb-4">
              Solicitamos informações pessoais apenas quando realmente precisamos delas para lhe fornecer um serviço. Fazemo-lo por meios justos e legais, com o seu conhecimento e consentimento. Também informamos por que estamos coletando e como será usado.
            </p>
            <p className="mb-4">
              Apenas retemos as informações coletadas pelo tempo necessário para fornecer o serviço solicitado. Quando armazenamos dados, protegemos dentro de meios comercialmente aceitáveis para evitar perdas e roubos, bem como acesso, divulgação, cópia, uso ou modificação não autorizados.
            </p>
            <p className="mb-4">
              Não compartilhamos informações de identificação pessoal publicamente ou com terceiros, exceto quando exigido por lei.
            </p>
            <p className="mb-4">
              O nosso site pode ter links para sites externos que não são operados por nós. Esteja ciente de que não temos controle sobre o conteúdo e práticas desses sites e não podemos aceitar responsabilidade por suas respectivas políticas de privacidade.
            </p>
            <p className="mb-4">
              Você é livre para recusar a nossa solicitação de informações pessoais, entendendo que talvez não possamos fornecer alguns dos serviços desejados.
            </p>
            <p>
              O uso continuado de nosso site será considerado como aceitação de nossas práticas em torno de privacidade e informações pessoais. Se você tiver alguma dúvida sobre como lidamos com dados do usuário e informações pessoais, entre em contacto connosco.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-bold text-slate-800 mb-3">Compromisso do Usuário</h3>
            <p className="mb-3">
              O usuário se compromete a fazer uso adequado dos conteúdos e da informação que o ContaExplicada oferece no site e com caráter enunciativo, mas não limitativo:
            </p>
            <ul className="list-disc pl-5 space-y-2 marker:text-brand-primary">
              <li>A) Não se envolver em atividades que sejam ilegais ou contrárias à boa fé a à ordem pública;</li>
              <li>B) Não difundir propaganda ou conteúdo de natureza racista, xenofóbica, jogos de sorte ou azar, qualquer tipo de pornografia ilegal, de apologia ao terrorismo ou contra os direitos humanos;</li>
              <li>C) Não causar danos aos sistemas físicos (hardwares) e lógicos (softwares) do ContaExplicada, de seus fornecedores ou terceiros, para introduzir ou disseminar vírus informáticos ou quaisquer outros sistemas de hardware ou software que sejam capazes de causar danos anteriormente mencionados.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-bold text-slate-800 mb-3">Mais informações</h3>
            <p className="mb-4">
              Esperemos que esteja esclarecido e, como mencionado anteriormente, se houver algo que você não tem certeza se precisa ou não, geralmente é mais seguro deixar os cookies ativados, caso interaja com um dos recursos que você usa em nosso site.
            </p>
            <p className="text-xs text-slate-400 border-t border-slate-100 pt-4 mt-6">
              Esta política é efetiva a partir de 28 November 2025 07:24
            </p>
          </section>

        </div>
        
        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 rounded-b-2xl flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-brand-primary hover:bg-blue-800 text-white font-bold rounded-lg transition-colors"
          >
            Entendido
          </button>
        </div>

      </div>
    </div>
  );
};

export default PrivacyPolicy;