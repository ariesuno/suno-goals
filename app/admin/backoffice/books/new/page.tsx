'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, ArrowLeft, ArrowRight, Save } from 'lucide-react';
import BookStep1Info from '@/components/backoffice/book-wizard/BookStep1Info';
import BookStep2Indicators from '@/components/backoffice/book-wizard/BookStep2Indicators';
import BookStep3Goals from '@/components/backoffice/book-wizard/BookStep3Goals';
import BookStep4Review from '@/components/backoffice/book-wizard/BookStep4Review';
import { BookOwnerType, MonthlyGoals } from '@/types/backoffice';

type BookFormData = {
  name: string;
  year: number;
  owner_type: BookOwnerType;
  owner_id: string;
  owner_name: string;
  owner_email?: string;
  owner_role?: string;
  description?: string;
  selected_indicators: {
    indicator_id: string;
    indicator_name: string;
    indicator_format: any;
    indicator_direction: 'up' | 'down';
    goals: MonthlyGoals;
  }[];
};

export default function NewBookPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<BookFormData>({
    name: '',
    year: 2025,
    owner_type: 'person',
    owner_id: '',
    owner_name: '',
    owner_email: undefined,
    owner_role: undefined,
    description: '',
    selected_indicators: [],
  });

  const steps = [
    { number: 1, title: 'Informações', component: BookStep1Info },
    { number: 2, title: 'Indicadores', component: BookStep2Indicators },
    { number: 3, title: 'Metas', component: BookStep3Goals },
    { number: 4, title: 'Revisão', component: BookStep4Review },
  ];

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.name && formData.owner_id && formData.owner_name;
      case 2:
        return formData.selected_indicators.length >= 1 && formData.selected_indicators.length <= 6;
      case 3:
        return true; // Metas são opcionais
      case 4:
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (currentStep < 4 && canProceed()) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleSaveDraft = () => {
    // TODO: Salvar rascunho no localStorage ou backend
    console.log('Salvando rascunho...', formData);
    alert('Rascunho salvo com sucesso!');
  };

  const handleCancel = () => {
    if (confirm('Deseja realmente cancelar? Todas as alterações não salvas serão perdidas.')) {
      router.push('/admin/backoffice/books');
    }
  };

  const handleSubmit = () => {
    // TODO: Enviar para o backend
    console.log('Criando book...', formData);
    alert('Book criado com sucesso!');
    router.push('/admin/backoffice/books');
  };

  const CurrentStepComponent = steps[currentStep - 1].component;

  return (
    <div className="min-h-screen bg-neutral-1">
      {/* Header */}
      <div className="bg-white border-b border-neutral-2 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="font-display font-bold text-2xl text-neutral-10">
              Criar Novo Book
            </h1>
            <div className="flex items-center gap-3">
              <button
                onClick={handleSaveDraft}
                className="flex items-center gap-2 px-4 py-2 text-neutral-10 hover:bg-neutral-1 rounded-lg transition-colors"
              >
                <Save className="w-4 h-4" />
                <span className="hidden sm:inline">Salvar Rascunho</span>
              </button>
              <button
                onClick={handleCancel}
                className="p-2 text-neutral-8 hover:bg-neutral-1 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center flex-1">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${
                      currentStep === step.number
                        ? 'bg-suno-red text-white'
                        : currentStep > step.number
                        ? 'bg-green-600 text-white'
                        : 'bg-neutral-2 text-neutral-5'
                    }`}
                  >
                    {currentStep > step.number ? '✓' : step.number}
                  </div>
                  <div className="hidden md:block">
                    <p
                      className={`text-sm font-medium ${
                        currentStep === step.number ? 'text-neutral-10' : 'text-neutral-5'
                      }`}
                    >
                      {step.title}
                    </p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-4 rounded transition-colors ${
                      currentStep > step.number ? 'bg-green-600' : 'bg-neutral-2'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <CurrentStepComponent formData={formData} setFormData={setFormData} />
      </div>

      {/* Footer Navigation */}
      <div className="bg-white border-t border-neutral-2 sticky bottom-0 z-20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={handleBack}
              disabled={currentStep === 1}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                currentStep === 1
                  ? 'text-neutral-5 cursor-not-allowed'
                  : 'text-neutral-10 hover:bg-neutral-1'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </button>

            <div className="flex items-center gap-3">
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-neutral-10 hover:bg-neutral-1 rounded-lg transition-colors"
              >
                Cancelar
              </button>

              {currentStep === 4 ? (
                <button
                  onClick={handleSubmit}
                  disabled={!canProceed()}
                  className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                    canProceed()
                      ? 'bg-suno-red text-white hover:bg-red-700'
                      : 'bg-neutral-3 text-neutral-5 cursor-not-allowed'
                  }`}
                >
                  Criar Book
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  disabled={!canProceed()}
                  className={`flex items-center gap-2 px-6 py-2 rounded-lg font-semibold transition-colors ${
                    canProceed()
                      ? 'bg-suno-red text-white hover:bg-red-700'
                      : 'bg-neutral-3 text-neutral-5 cursor-not-allowed'
                  }`}
                >
                  Próximo
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

