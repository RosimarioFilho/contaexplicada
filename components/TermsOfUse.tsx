import React from 'react';
import { X, FileText } from 'lucide-react';

interface TermsOfUseProps {
  onClose: () => void;
}

const TermsOfUse: React.FC<TermsOfUseProps> = ({ onClose }) => {
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
            <FileText className="text-brand-primary" size={24} />
            <h2 className="text-xl font-bold">Termos de Uso</h2>
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
            <h3 className="text-lg font-bold text-slate-800 mb-3">1. Termos</h3>
            <p>
              Ao acessar ao site <span className="font-semibold text-brand-primary">ContaExplicada</span>, concorda em cumprir estes termos de serviço, todas as leis e regulamentos aplicáveis ​​e concorda que é responsável pelo cumprimento de todas as leis locais aplicáveis. Se você não concordar com algum desses termos, está proibido de usar ou acessar este site. Os materiais contidos neste site são protegidos pelas leis de direitos autorais e marcas comerciais aplicáveis.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-bold text-slate-800 mb-3">2. Uso de Licença</h3>
            <p className="mb-3">
              É concedida permissão para baixar temporariamente uma cópia dos materiais (informações ou software) no site ContaExplicada, apenas para visualização transitória pessoal e não comercial. Esta é a concessão de uma licença, não uma transferência de título e, sob esta licença, você não pode:
            </p>
            <ul className="list-disc pl-5 space-y-2 marker:text-brand-primary mb-3">
              <li>Modificar ou copiar os materiais;</li>
              <li>Usar os materiais para qualquer finalidade comercial ou para exibição pública (comercial ou não comercial);</li>
              <li>Tentar descompilar ou fazer engenharia reversa de qualquer software contido no site ContaExplicada;</li>
              <li>Remover quaisquer direitos autorais ou outras notações de propriedade dos materiais; ou</li>
              <li>Transferir os materiais para outra pessoa ou 'espelhe' os materiais em qualquer outro servidor.</li>
            </ul>
            <p>
              Esta licença será automaticamente rescindida se você violar alguma dessas restrições e poderá ser rescindida por ContaExplicada a qualquer momento. Ao encerrar a visualização desses materiais ou após o término desta licença, você deve apagar todos os materiais baixados em sua posse, seja em formato eletrónico ou impresso.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-bold text-slate-800 mb-3">3. Isenção de responsabilidade</h3>
            <p className="mb-3">
              Os materiais no site da ContaExplicada são fornecidos 'como estão'. ContaExplicada não oferece garantias, expressas ou implícitas, e, por este meio, isenta e nega todas as outras garantias, incluindo, sem limitação, garantias implícitas ou condições de comercialização, adequação a um fim específico ou não violação de propriedade intelectual ou outra violação de direitos.
            </p>
            <p>
              Além disso, o ContaExplicada não garante ou faz qualquer representação relativa à precisão, aos resultados prováveis ​​ou à confiabilidade do uso dos materiais em seu site ou de outra forma relacionado a esses materiais ou em sites vinculados a este site.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-bold text-slate-800 mb-3">4. Limitações</h3>
            <p>
              Em nenhum caso o ContaExplicada ou seus fornecedores serão responsáveis ​​por quaisquer danos (incluindo, sem limitação, danos por perda de dados ou lucro ou devido a interrupção dos negócios) decorrentes do uso ou da incapacidade de usar os materiais em ContaExplicada, mesmo que ContaExplicada ou um representante autorizado da ContaExplicada tenha sido notificado oralmente ou por escrito da possibilidade de tais danos. Como algumas jurisdições não permitem limitações em garantias implícitas, ou limitações de responsabilidade por danos conseqüentes ou incidentais, essas limitações podem não se aplicar a você.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-bold text-slate-800 mb-3">5. Precisão dos materiais</h3>
            <p>
              Os materiais exibidos no site da ContaExplicada podem incluir erros técnicos, tipográficos ou fotográficos. ContaExplicada não garante que qualquer material em seu site seja preciso, completo ou atual. ContaExplicada pode fazer alterações nos materiais contidos em seu site a qualquer momento, sem aviso prévio. No entanto, ContaExplicada não se compromete a atualizar os materiais.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-bold text-slate-800 mb-3">6. Links</h3>
            <p>
              O ContaExplicada não analisou todos os sites vinculados ao seu site e não é responsável pelo conteúdo de nenhum site vinculado. A inclusão de qualquer link não implica endosso por ContaExplicada do site. O uso de qualquer site vinculado é por conta e risco do usuário.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-bold text-slate-800 mb-3">Modificações</h3>
            <p>
              O ContaExplicada pode revisar estes termos de serviço do site a qualquer momento, sem aviso prévio. Ao usar este site, você concorda em ficar vinculado à versão atual desses termos de serviço.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-bold text-slate-800 mb-3">Lei aplicável</h3>
            <p>
              Estes termos e condições são regidos e interpretados de acordo com as leis do ContaExplicada e você se submete irrevogavelmente à jurisdição exclusiva dos tribunais naquele estado ou localidade.
            </p>
          </section>

        </div>
        
        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 rounded-b-2xl flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-brand-primary hover:bg-blue-800 text-white font-bold rounded-lg transition-colors"
          >
            Concordo
          </button>
        </div>

      </div>
    </div>
  );
};

export default TermsOfUse;