

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { BillData, SolarCalculation } from '../types';
import { calculateSolarSavings } from '../services/solarService';
import { ArrowRight, Bot, User, ArrowDown, Check, RotateCcw, Info, Zap, DollarSign } from 'lucide-react';

interface ResultsScreenProps {
  data: BillData;
  onContinue: (calculation: SolarCalculation) => void;
  onReset: () => void;
}

const ResultsScreen: React.FC<ResultsScreenProps> = ({ data, onContinue, onReset }) => {
  const [calculation, setCalculation] = useState<SolarCalculation | null>(null);
  
  // Chat State
  const [messages, setMessages] = useState<string[]>([]);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [displayedCurrentMessage, setDisplayedCurrentMessage] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [isThinking, setIsThinking] = useState(false);
  
  // Funnel State
  const [typingComplete, setTypingComplete] = useState(false);
  const [showSalesPitch, setShowSalesPitch] = useState(false);
  const [showQuestion, setShowQuestion] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [userResponse, setUserResponse] = useState<'sim' | 'nao' | null>(null);
  
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const rawMessagesRef = useRef<string[]>([]);

  // Initialize Calculation
  useEffect(() => {
    if (data) {
      setCalculation(calculateSolarSavings(data));
      // Split AI text by the delimiter to create separate bubbles
      if (data.analise_informal) {
        rawMessagesRef.current = data.analise_informal.split('###').map(s => s.trim()).filter(s => s.length > 0);
      }
    }
  }, [data]);

  // Value Reinforcement Calculation for Solar Users
  const valorEstimadoSemSolar = useMemo(() => {
    if (!data.tem_energia_solar || !data.leituras?.atual || !data.leituras?.anterior) {
      return null;
    }
    const consumoReal = data.leituras.atual - data.leituras.anterior;
    if (consumoReal <= 0) return null;
    return consumoReal * 1.15;
  }, [data]);


  // Scroll Helper
  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  // Complex Typewriter Effect (Message by Message)
  useEffect(() => {
    if (rawMessagesRef.current.length === 0) return;
    if (currentMessageIndex >= rawMessagesRef.current.length) {
      setTypingComplete(true);
      setIsTyping(false);
      
      // Trigger funnel after chat ends
      if (!data.tem_energia_solar) {
         setTimeout(() => setShowSalesPitch(true), 800);
      } else {
         setTimeout(scrollToBottom, 500);
      }
      return;
    }

    const currentFullText = rawMessagesRef.current[currentMessageIndex];
    let charIndex = 0;
    
    setIsTyping(true);
    setIsThinking(false);

    const typeInterval = setInterval(() => {
      setDisplayedCurrentMessage(currentFullText.slice(0, charIndex + 1));
      charIndex++;
      scrollToBottom();

      if (charIndex >= currentFullText.length) {
        clearInterval(typeInterval);
        
        // Message finished typing
        setMessages(prev => [...prev, currentFullText]);
        setDisplayedCurrentMessage('');
        setIsTyping(false);
        setIsThinking(true); // Pause/Think before next message

        // Delay before starting next message
        setTimeout(() => {
          setCurrentMessageIndex(prev => prev + 1);
        }, 1500); // 1.5s pause between messages
      }
    }, 25); // Typing speed

    return () => clearInterval(typeInterval);
  }, [currentMessageIndex, data.tem_energia_solar]);

  // Sequence Controller for Non-Solar Users
  useEffect(() => {
    if (showSalesPitch) {
       setTimeout(() => {
         setShowQuestion(true);
         scrollToBottom();
       }, 1500);
    }
  }, [showSalesPitch]);

  useEffect(() => {
    if (showQuestion) {
      setTimeout(() => {
        setShowOptions(true);
        scrollToBottom();
      }, 1000);
    }
  }, [showQuestion]);

  // Handler for User Interaction
  const handleResponse = (response: 'sim' | 'nao') => {
    setUserResponse(response);
    setTimeout(scrollToBottom, 100);
  };

  if (!calculation) return null;

  const isSolarUser = data.tem_energia_solar;

  // Helper to format text with bold logic
  const renderFormattedText = (text: string) => {
    // Replace markdown bold (**text**) with HTML bold
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index} className="text-slate-900 font-bold">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  return (
    <div className="max-w-2xl mx-auto min-h-[calc(100vh-80px)] bg-slate-50 flex flex-col relative">
      
      {/* Chat Container */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-6 pb-32 scroll-smooth"
      >
        
        {/* Header Avatar */}
        <div className="flex justify-center mb-6">
          <div className="bg-white p-2 rounded-full shadow-sm border border-slate-100 flex items-center gap-2 px-4">
             <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
             <span className="text-xs font-bold text-slate-600 uppercase">Analista Virtual Conectado</span>
          </div>
        </div>

        {/* 1. History Messages (Completed Bubbles) */}
        {messages.map((msg, idx) => (
          <div key={idx} className="flex gap-3 animate-reveal">
            <div className="w-10 h-10 rounded-full bg-brand-primary flex items-center justify-center flex-shrink-0 text-white shadow-md mt-auto">
              <Bot size={20} />
            </div>
            <div className="bg-white p-4 rounded-2xl rounded-bl-none shadow-sm border border-slate-200 max-w-[85%]">
              <p className="text-slate-700 leading-relaxed whitespace-pre-line text-sm">
                {renderFormattedText(msg)}
              </p>
            </div>
          </div>
        ))}

        {/* 2. Current Typing Message */}
        {isTyping && (
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-full bg-brand-primary flex items-center justify-center flex-shrink-0 text-white shadow-md mt-auto">
              <Bot size={20} />
            </div>
            <div className="bg-white p-4 rounded-2xl rounded-bl-none shadow-sm border border-slate-200 max-w-[85%]">
              <p className="text-slate-700 leading-relaxed whitespace-pre-line text-sm">
                {renderFormattedText(displayedCurrentMessage)}
                <span className="inline-block w-1.5 h-4 ml-1 bg-brand-primary animate-pulse align-middle"></span>
              </p>
            </div>
          </div>
        )}

        {/* 3. Thinking Indicator (Between Messages) */}
        {isThinking && (
          <div className="flex gap-3">
             <div className="w-8 h-8 rounded-full bg-brand-primary/50 flex items-center justify-center flex-shrink-0 text-white mt-auto animate-pulse">
               <Bot size={16} />
             </div>
             <div className="flex items-center gap-1 bg-slate-100 px-4 py-3 rounded-2xl rounded-bl-none">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-200"></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-300"></div>
             </div>
          </div>
        )}

        {/* =========================================================
            SOLAR USER EXCLUSIVE CONTENT
           ========================================================= */}
        {isSolarUser && typingComplete && (
          <>
            {/* TUSD GD EXPLANATION */}
            <div className="flex gap-3 animate-reveal delay-100">
              <div className="w-10 h-10 rounded-full bg-solar flex items-center justify-center flex-shrink-0 text-brand-dark shadow-md border border-yellow-300 mt-auto">
                <Zap size={20} fill="currentColor" />
              </div>
              <div className="bg-orange-50 p-5 rounded-2xl rounded-bl-none border border-orange-200 max-w-[90%] text-slate-800 shadow-sm">
                <h4 className="font-bold text-orange-800 mb-3 flex items-center gap-2 text-base">
                  <Info size={18} className="text-orange-600"/> 
                  Entendendo a "Taxa do Sol" (TUSD GD)
                </h4>
                
                <div className="space-y-3 text-sm leading-relaxed text-slate-700">
                  <p>
                    Percebi que você tem energia solar! É comum surgir dúvidas sobre a cobrança da <strong>TUSD G</strong> ou <strong>Fio B</strong> na sua fatura.
                  </p>
                  
                  <div className="bg-white/60 p-3 rounded-lg border border-orange-100">
                    <p className="font-medium text-orange-900 mb-1">O que é isso?</p>
                    <p>
                      Não é uma taxa extra arbitrária. É a remuneração pelo uso da rede da distribuidora (postes, fios, transformadores) que você usa para injetar sua energia excedente.
                    </p>
                  </div>

                  <p>
                    Isso foi regulamentado pela <strong>Lei 14.300 (Marco Legal)</strong> e pela ANEEL. Basicamente, é como pagar um "pedágio" apenas pelo transporte da energia que você envia para a rua.
                  </p>
                </div>
              </div>
            </div>

            {/* VALUE REINFORCEMENT CARD */}
            {valorEstimadoSemSolar && (
              <div className="flex gap-3 animate-reveal delay-300">
                <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center flex-shrink-0 text-white shadow-md border border-green-400 mt-auto">
                  <DollarSign size={20} />
                </div>
                <div className="bg-green-50 p-5 rounded-2xl rounded-bl-none border border-green-200 max-w-[90%] text-slate-800 shadow-sm">
                  <h4 className="font-bold text-green-800 mb-3 flex items-center gap-2 text-base">
                    Reforço de Valor: Sua Economia Real
                  </h4>
                  
                  <div className="space-y-3 text-sm leading-relaxed text-slate-700">
                    <p>
                      Com base no seu consumo real de <strong>{((data.leituras?.atual ?? 0) - (data.leituras?.anterior ?? 0)).toFixed(0)} kWh</strong>,
                      estimamos que sua conta de luz, sem o sistema solar, seria de aproximadamente:
                    </p>

                    <div className="text-center bg-white/60 p-3 rounded-lg border border-green-100 my-2">
                      <p className="text-3xl font-bold text-green-700">
                        R$ {valorEstimadoSemSolar.toFixed(2).replace('.', ',')}
                      </p>
                    </div>

                    <p>
                      Em vez disso, você pagou apenas <strong>R$ {data.valor_total?.toFixed(2).replace('.', ',')}</strong>. Um excelente investimento!
                    </p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* =========================================================
            NON-SOLAR FUNNEL (SALES PITCH)
           ========================================================= */}

        {/* 2. Injected Sales Pitch (Logic) */}
        {showSalesPitch && !isSolarUser && (
          <div className="flex gap-3 animate-reveal">
            <div className="w-10 h-10 rounded-full bg-brand-primary flex items-center justify-center flex-shrink-0 text-white shadow-md mt-auto">
              <Bot size={20} />
            </div>
            <div className="bg-white p-5 rounded-2xl rounded-bl-none shadow-sm border-l-4 border-brand-primary max-w-[85%]">
              <p className="text-slate-800 leading-relaxed">
                Se você tivesse energia solar, sua conta cairia de <br/>
                <span className="font-bold text-red-500">R$ {data.valor_total?.toFixed(2)}</span> → <span className="font-bold text-green-600">R$ {calculation.nova_conta_estimada.toFixed(2)}</span>
              </p>
              <p className="mt-3 font-bold text-slate-800 text-lg">
                Você economizaria R$ {calculation.economia_mensal.toFixed(2)} por mês.
              </p>
            </div>
          </div>
        )}

        {/* 3. The Question */}
        {showQuestion && !isSolarUser && (
          <div className="flex gap-3 animate-reveal">
             <div className="w-10 h-10 rounded-full bg-brand-primary flex items-center justify-center flex-shrink-0 text-white shadow-md mt-auto">
               <Bot size={20} />
             </div>
             <div className="bg-blue-50 p-5 rounded-2xl rounded-bl-none border border-blue-100 max-w-[85%]">
                <p className="font-bold text-slate-800">
                   Quer saber de graça a quantidade de placas solares necessárias para a sua casa?
                </p>
             </div>
          </div>
        )}

        {/* 4. User Interaction (Buttons) */}
        {showOptions && !userResponse && !isSolarUser && (
          <div className="flex flex-col items-end gap-3 animate-reveal">
            <button 
              onClick={() => handleResponse('sim')}
              className="bg-brand-primary text-white px-6 py-3 rounded-2xl rounded-br-none shadow-md hover:bg-blue-700 transition-transform active:scale-95 font-medium flex items-center gap-2"
            >
              Sim, quero a simulação completa <ArrowRight size={18} />
            </button>
            <button 
              onClick={() => handleResponse('nao')}
              className="bg-white text-slate-500 border border-slate-200 px-6 py-3 rounded-2xl rounded-br-none hover:bg-slate-50 transition-colors text-sm"
            >
              Não agora
            </button>
          </div>
        )}

        {/* 5. User Selection Bubble */}
        {userResponse === 'sim' && (
           <div className="flex justify-end gap-3 animate-reveal">
              <div className="bg-brand-primary p-4 rounded-2xl rounded-br-none shadow-sm text-white max-w-[80%]">
                 <p>Sim, quero a simulação completa</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0 text-slate-500 shadow-sm mt-auto">
                <User size={20} />
              </div>
           </div>
        )}

        {/* 6. PHASE 2 - REVEALED CARD (Comparison) */}
        {userResponse === 'sim' && (
          <div className="mt-8 animate-reveal pb-8">
            <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-xl transition-shadow relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-primary to-solar"></div>
               
               <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                   <Check size={20} className="text-green-500" />
                   Cenário Personalizado
               </h3>
               
               <div className="flex items-center justify-between gap-2 mb-6 relative">
                 <div className="text-center w-1/3">
                   <p className="text-xs text-slate-400 font-semibold uppercase mb-1">Hoje</p>
                   <p className="text-lg font-bold text-red-400 line-through decoration-red-400 decoration-2">
                     R$ {data.valor_total?.toFixed(0)}
                   </p>
                 </div>
                 
                 <div className="flex flex-col items-center justify-center text-brand-primary w-1/3">
                   <ArrowRight size={24} />
                 </div>

                 <div className="text-center w-1/3">
                   <p className="text-xs text-green-600 font-semibold uppercase mb-1">Com Solar</p>
                   <p className="text-3xl font-bold text-slate-800">
                     R$ {calculation.nova_conta_estimada.toFixed(0)}
                   </p>
                 </div>
               </div>

               <div className="bg-green-50 text-green-700 p-4 rounded-xl flex items-center gap-3 mb-6">
                  <ArrowDown size={20} className="flex-shrink-0" />
                  <p className="text-sm font-medium leading-tight">
                    Economia anual estimada: <span className="font-bold text-lg">R$ {calculation.economia_anual.toLocaleString('pt-BR')}</span>
                  </p>
               </div>

               <button 
                   onClick={() => onContinue(calculation)}
                   className="w-full py-4 px-4 bg-solar hover:bg-solar-hover text-brand-dark font-bold rounded-xl shadow-lg transition-all transform hover:-translate-y-1"
               >
                   Gerar Relatório em PDF no WhatsApp
               </button>
               
               <p className="text-xs text-center text-slate-400 mt-4">
                 Simulação baseada na irradiação solar da sua região (CEP).
               </p>
            </div>
          </div>
        )}

        {/* Handling "Não" response or Solar User Reset */}
        {(userResponse === 'nao' || (isSolarUser && typingComplete)) && (
           <div className="flex justify-center mt-8 animate-reveal pb-8">
              <button 
                 onClick={onReset}
                 className="flex items-center gap-2 text-slate-500 hover:text-brand-primary transition-colors text-sm py-2 px-4 rounded-lg border border-transparent hover:bg-slate-100"
              >
                <RotateCcw size={16} />
                Reiniciar Análise
              </button>
           </div>
        )}
      </div>

    </div>
  );
};

export default ResultsScreen;