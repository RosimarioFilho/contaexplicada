import React, { useState, useEffect, useRef } from 'react';
import { LeadData } from '../types';
import { CheckCircle } from 'lucide-react';

interface LeadFormProps {
  onSubmit: (data: LeadData) => void;
  isSubmitting: boolean;
  initialName?: string;
  initialCep?: string;
}

const LeadForm: React.FC<LeadFormProps> = ({ onSubmit, isSubmitting, initialName = '', initialCep = '' }) => {
  const [formData, setFormData] = useState<LeadData>({
    nome: initialName,
    whatsapp: '',
    cep: '',
    estado: ''
  });

  const [validationErrors, setValidationErrors] = useState<Partial<LeadData>>({});
  const whatsappInputRef = useRef<HTMLInputElement>(null);

  // Efeito para focar automaticamente no campo de WhatsApp
  useEffect(() => {
    if (whatsappInputRef.current) {
      whatsappInputRef.current.focus();
    }
  }, []);


  // Funções de formatação (Máscaras)
  const formatPhone = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{4})\d+?$/, '$1');
  };

  const formatCep = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{3})\d+?$/, '$1');
  };

  const fetchCep = async (cepRaw: string) => {
    const cleanCep = cepRaw.replace(/\D/g, '');
    
    if (cleanCep.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
        const data = await response.json();
        if (!data.erro) {
            setFormData(prev => ({ ...prev, estado: data.uf }));
        } else {
            setFormData(prev => ({ ...prev, estado: '' }));
            setValidationErrors(prev => ({...prev, cep: 'CEP não encontrado.'}))
        }
      } catch (e) {
        console.error("Erro ao buscar CEP", e);
        setFormData(prev => ({ ...prev, estado: '' }));
      }
    }
  };

  // Efeito para pré-preencher CEP e buscar UF
  useEffect(() => {
    if (initialCep) {
      const formattedCep = formatCep(initialCep);
      setFormData(prev => ({ ...prev, cep: formattedCep }));
      fetchCep(formattedCep);
    }
  }, [initialCep]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let finalValue = value;

    if (name === 'whatsapp') {
      finalValue = formatPhone(value);
    } else if (name === 'cep') {
      finalValue = formatCep(value);
      if(validationErrors.cep && finalValue.replace(/\D/g, '').length === 8) {
        setValidationErrors(prev => ({...prev, cep: ''}));
      }
      fetchCep(finalValue);
    }

    setFormData(prev => ({ ...prev, [name]: finalValue }));
    if(validationErrors[name as keyof LeadData] && value.trim() !== '') {
        setValidationErrors(prev => ({...prev, [name]: ''}));
    }
  };

  const validateForm = (): boolean => {
    const errors: Partial<LeadData> = {};
    if (!formData.nome.trim()) {
      errors.nome = 'O nome completo é obrigatório.';
    }
    if (formData.whatsapp.replace(/\D/g, '').length < 11) {
      errors.whatsapp = 'Por favor, insira um WhatsApp válido com DDD.';
    }
    if (formData.cep.replace(/\D/g, '').length < 8) {
      errors.cep = 'Por favor, insira um CEP válido.';
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };
  
  const getBorderColor = (field: keyof LeadData) => {
      return validationErrors[field] ? 'border-red-500' : 'border-slate-300';
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-slate-200">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full text-green-600 mb-4">
            <CheckCircle size={24} />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">Quase lá!</h2>
          <p className="text-slate-500 mt-2">
            Para onde devemos enviar seu estudo de viabilidade técnica?
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Nome Completo</label>
            <input
              type="text"
              name="nome"
              className={`w-full p-3 bg-white border ${getBorderColor('nome')} rounded-lg text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-all outline-none font-medium`}
              placeholder="Ex: João Silva"
              value={formData.nome}
              onChange={handleChange}
            />
            {validationErrors.nome && <p className="text-red-500 text-xs mt-1">{validationErrors.nome}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">WhatsApp</label>
            <input
              ref={whatsappInputRef}
              type="tel"
              name="whatsapp"
              className={`w-full p-3 bg-white border ${getBorderColor('whatsapp')} rounded-lg text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-all outline-none font-medium`}
              placeholder="(11) 99999-9999"
              value={formData.whatsapp}
              onChange={handleChange}
              maxLength={15}
            />
             {validationErrors.whatsapp && <p className="text-red-500 text-xs mt-1">{validationErrors.whatsapp}</p>}
          </div>

          <div className="flex gap-4">
            <div className="w-2/3">
              <label className="block text-sm font-semibold text-slate-700 mb-1">CEP</label>
              <input
                type="text"
                name="cep"
                className={`w-full p-3 bg-white border ${getBorderColor('cep')} rounded-lg text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-all outline-none font-medium`}
                placeholder="00000-000"
                value={formData.cep}
                onChange={handleChange}
                maxLength={9}
              />
               {validationErrors.cep && <p className="text-red-500 text-xs mt-1">{validationErrors.cep}</p>}
            </div>
            <div className="w-1/3">
              <label className="block text-sm font-semibold text-slate-700 mb-1">UF</label>
              <input
                type="text"
                name="estado"
                className="w-full p-3 bg-slate-100 border border-slate-300 rounded-lg text-slate-900 font-bold text-center cursor-not-allowed"
                value={formData.estado}
                readOnly
                placeholder="--"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-6 py-4 bg-solar hover:bg-solar-hover text-brand-dark font-bold text-lg rounded-xl shadow-lg shadow-yellow-500/20 transition-all transform active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <span className="inline-block w-5 h-5 border-2 border-brand-dark border-t-transparent rounded-full animate-spin"></span>
            ) : (
              'Receber Simulação Gratuita'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LeadForm;