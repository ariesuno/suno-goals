import { BackofficeBook, BookOwnerType, MonthlyGoals } from '@/types/backoffice';
import { X, ChevronLeft, ChevronRight, User, Users, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { mockIndicators } from '@/lib/mockIndicators';
import BookGoalsEditor from './BookGoalsEditor';

type BookFormModalProps = {
  book?: BackofficeBook | null;
  onSave: (book: Partial<BackofficeBook>) => void;
  onClose: () => void;
};

type FormData = {
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

export default function BookFormModal({ book, onSave, onClose }: BookFormModalProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    name: book?.name || '',
    year: book?.year || 2025,
    owner_type: book?.owner.type || 'person',
    owner_id: book?.owner.id || '',
    owner_name: book?.owner.name || '',
    owner_email: book?.owner.email,
    owner_role: book?.owner.role,
    description: book?.description,
    selected_indicators: [],
  });

  const [currentGoalIndex, setCurrentGoalIndex] = useState(0);

  const canProceed = () => {
    if (step === 1) {
      return formData.name && formData.owner_id && formData.owner_name;
    }
    if (step === 2) {
      return formData.selected_indicators.length >= 1 && formData.selected_indicators.length <= 6;
    }
    if (step === 3) {
      return true; // Metas são opcionais
    }
    return true;
  };

  const handleNext = () => {
    if (step < 4) {
      if (step === 2 && formData.selected_indicators.length > 0) {
        setStep(3);
        setCurrentGoalIndex(0);
      } else if (step === 3 && currentGoalIndex < formData.selected_indicators.length - 1) {
        setCurrentGoalIndex(currentGoalIndex + 1);
      } else {
        setStep(step + 1);
      }
    }
  };

  const handleBack = () => {
    if (step === 3 && currentGoalIndex > 0) {
      setCurrentGoalIndex(currentGoalIndex - 1);
    } else if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSkipGoals = () => {
    setStep(4);
  };

  const handleSubmit = () => {
    // TODO: Transform formData to BackofficeBook format
    onSave(formData as any);
    onClose();
  };

  const toggleIndicator = (indicatorId: string) => {
    const indicator = mockIndicators.find(i => i.id === indicatorId);
    if (!indicator) return;

    const isSelected = formData.selected_indicators.some(i => i.indicator_id === indicatorId);
    
    if (isSelected) {
      setFormData({
        ...formData,
        selected_indicators: formData.selected_indicators.filter(i => i.indicator_id !== indicatorId),
      });
    } else {
      if (formData.selected_indicators.length >= 6) {
        alert('Máximo de 6 indicadores por book');
        return;
      }
      setFormData({
        ...formData,
        selected_indicators: [
          ...formData.selected_indicators,
          {
            indicator_id: indicator.id,
            indicator_name: indicator.name,
            indicator_format: indicator.format,
            indicator_direction: indicator.direction,
            goals: {},
          },
        ],
      });
    }
  };

  const updateIndicatorGoals = (index: number, goals: MonthlyGoals) => {
    const newIndicators = [...formData.selected_indicators];
    newIndicators[index].goals = goals;
    setFormData({ ...formData, selected_indicators: newIndicators });
  };

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-neutral-2">
            <div>
              <h2 className="font-display font-bold text-xl text-neutral-10">
                {book ? 'Editar Book' : 'Criar Novo Book'}
              </h2>
              <p className="text-sm text-neutral-5 mt-1">
                Passo {step === 3 ? `3 (${currentGoalIndex + 1}/${formData.selected_indicators.length})` : step} de 4
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-neutral-1 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-neutral-8" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="flex">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`flex-1 h-1 ${
                  s <= step ? 'bg-suno-red' : 'bg-neutral-2'
                }`}
              />
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Step 1: Informações Básicas */}
            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-10 mb-2">
                    Nome do Book *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ex: Book Allan Silva - 2025"
                    className="w-full px-3 py-2 border border-neutral-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-suno-red"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-10 mb-2">
                    Ano *
                  </label>
                  <select
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-neutral-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-suno-red"
                  >
                    <option value={2025}>2025</option>
                    <option value={2026}>2026</option>
                    <option value={2027}>2027</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-10 mb-2">
                    Atribuir a: *
                  </label>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, owner_type: 'person' })}
                      className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 rounded-lg font-medium transition-colors ${
                        formData.owner_type === 'person'
                          ? 'border-suno-red bg-red-50 text-suno-red'
                          : 'border-neutral-3 text-neutral-8 hover:border-neutral-5'
                      }`}
                    >
                      <User className="w-5 h-5" />
                      Pessoa
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, owner_type: 'team' })}
                      className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 rounded-lg font-medium transition-colors ${
                        formData.owner_type === 'team'
                          ? 'border-suno-red bg-red-50 text-suno-red'
                          : 'border-neutral-3 text-neutral-8 hover:border-neutral-5'
                      }`}
                    >
                      <Users className="w-5 h-5" />
                      Time
                    </button>
                  </div>
                </div>

                {formData.owner_type === 'person' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-neutral-10 mb-2">
                        Nome da Pessoa *
                      </label>
                      <input
                        type="text"
                        value={formData.owner_name}
                        onChange={(e) => setFormData({ ...formData, owner_name: e.target.value, owner_id: e.target.value.toLowerCase().replace(/\s/g, '-') })}
                        placeholder="Ex: Allan Silva"
                        className="w-full px-3 py-2 border border-neutral-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-suno-red"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-10 mb-2">
                        Cargo (opcional)
                      </label>
                      <input
                        type="text"
                        value={formData.owner_role || ''}
                        onChange={(e) => setFormData({ ...formData, owner_role: e.target.value })}
                        placeholder="Ex: Head de Dados e CRM"
                        className="w-full px-3 py-2 border border-neutral-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-suno-red"
                      />
                    </div>
                  </>
                )}

                {formData.owner_type === 'team' && (
                  <div>
                    <label className="block text-sm font-medium text-neutral-10 mb-2">
                      Nome do Time *
                    </label>
                    <input
                      type="text"
                      value={formData.owner_name}
                      onChange={(e) => setFormData({ ...formData, owner_name: e.target.value, owner_id: e.target.value.toLowerCase().replace(/\s/g, '-') })}
                      placeholder="Ex: Time de Dados"
                      className="w-full px-3 py-2 border border-neutral-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-suno-red"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-neutral-10 mb-2">
                    Descrição (opcional)
                  </label>
                  <textarea
                    value={formData.description || ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Adicione uma descrição para este book..."
                    rows={3}
                    className="w-full px-3 py-2 border border-neutral-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-suno-red resize-none"
                  />
                </div>
              </div>
            )}

            {/* Step 2: Selecionar Indicadores */}
            {step === 2 && (
              <div className="space-y-4">
                <div className="bg-neutral-1 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-neutral-10">
                      Indicadores Selecionados
                    </h3>
                    <span className={`text-sm font-bold ${
                      formData.selected_indicators.length >= 1 && formData.selected_indicators.length <= 6
                        ? 'text-neutral-10'
                        : 'text-suno-red'
                    }`}>
                      {formData.selected_indicators.length}/6
                    </span>
                  </div>
                  {formData.selected_indicators.length === 0 ? (
                    <p className="text-sm text-neutral-5">
                      Nenhum indicador selecionado ainda
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {formData.selected_indicators.map((ind, idx) => (
                        <div
                          key={ind.indicator_id}
                          className="flex items-center justify-between bg-white p-2 rounded"
                        >
                          <span className="text-sm text-neutral-10">
                            {idx + 1}. {ind.indicator_name}
                          </span>
                          <button
                            onClick={() => toggleIndicator(ind.indicator_id)}
                            className="text-suno-red hover:bg-red-50 p-1 rounded"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="font-semibold text-neutral-10 mb-3">
                    Disponíveis ({mockIndicators.length} indicadores)
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                    {mockIndicators.map((indicator) => {
                      const isSelected = formData.selected_indicators.some(i => i.indicator_id === indicator.id);
                      return (
                        <button
                          key={indicator.id}
                          onClick={() => toggleIndicator(indicator.id)}
                          disabled={!isSelected && formData.selected_indicators.length >= 6}
                          className={`text-left p-3 border-2 rounded-lg transition-colors ${
                            isSelected
                              ? 'border-suno-red bg-red-50'
                              : 'border-neutral-2 hover:border-neutral-5 disabled:opacity-50 disabled:cursor-not-allowed'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-sm text-neutral-10 mb-1">
                                {indicator.name}
                              </h4>
                              <p className="text-xs text-neutral-5 line-clamp-2">
                                {indicator.description}
                              </p>
                            </div>
                            {isSelected && (
                              <div className="flex-shrink-0 w-5 h-5 bg-suno-red rounded-full flex items-center justify-center">
                                <span className="text-white text-xs">✓</span>
                              </div>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Definir Metas */}
            {step === 3 && formData.selected_indicators.length > 0 && (
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-semibold text-neutral-10">
                    Definir Metas - Indicador {currentGoalIndex + 1} de {formData.selected_indicators.length}
                  </h3>
                  <button
                    onClick={handleSkipGoals}
                    className="text-sm text-neutral-5 hover:text-neutral-10"
                  >
                    Pular todas →
                  </button>
                </div>
                <BookGoalsEditor
                  indicatorName={formData.selected_indicators[currentGoalIndex].indicator_name}
                  indicatorFormat={formData.selected_indicators[currentGoalIndex].indicator_format}
                  goals={formData.selected_indicators[currentGoalIndex].goals}
                  onChange={(goals) => updateIndicatorGoals(currentGoalIndex, goals)}
                />
              </div>
            )}

            {/* Step 4: Revisão */}
            {step === 4 && (
              <div className="space-y-4">
                <div className="bg-neutral-1 rounded-lg p-4">
                  <h3 className="font-semibold text-neutral-10 mb-3">Revisar Book</h3>
                  
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="text-neutral-5">Nome:</span>
                      <p className="font-medium text-neutral-10">{formData.name}</p>
                    </div>
                    <div>
                      <span className="text-neutral-5">Atribuído a:</span>
                      <p className="font-medium text-neutral-10">
                        {formData.owner_type === 'person' ? '👤' : '👥'} {formData.owner_name}
                        {formData.owner_role && ` (${formData.owner_role})`}
                      </p>
                    </div>
                    <div>
                      <span className="text-neutral-5">Ano:</span>
                      <p className="font-medium text-neutral-10">{formData.year}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-neutral-1 rounded-lg p-4">
                  <h3 className="font-semibold text-neutral-10 mb-3">
                    {formData.selected_indicators.length} Indicadores Selecionados
                  </h3>
                  <div className="space-y-2">
                    {formData.selected_indicators.map((ind, idx) => {
                      const missingGoals = Object.values(ind.goals).filter(v => v === undefined || v === null).length;
                      const hasAllGoals = missingGoals === 0;
                      
                      return (
                        <div
                          key={ind.indicator_id}
                          className="flex items-center justify-between bg-white p-3 rounded"
                        >
                          <span className="text-sm text-neutral-10">
                            {idx + 1}. {ind.indicator_name}
                          </span>
                          {hasAllGoals ? (
                            <span className="text-xs text-neutral-8 flex items-center gap-1">
                              <span className="text-neutral-10">✓</span> Metas ok
                            </span>
                          ) : (
                            <span className="text-xs text-suno-red flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" />
                              {12 - missingGoals > 0 ? `${12 - missingGoals}/12 meses` : 'Sem metas'}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {formData.selected_indicators.some(i => Object.values(i.goals).filter(v => v !== undefined && v !== null).length < 12) && (
                  <div className="bg-red-50 border border-suno-red rounded-lg p-4">
                    <div className="flex gap-3">
                      <AlertCircle className="w-5 h-5 text-suno-red flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-suno-red mb-1">
                          Atenção: Indicadores sem metas
                        </h4>
                        <p className="text-sm text-neutral-10">
                          Alguns indicadores não têm todas as metas definidas. Você pode salvar assim e definir as metas depois.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-neutral-2">
            <button
              onClick={handleBack}
              disabled={step === 1 || (step === 3 && currentGoalIndex === 0)}
              className="flex items-center gap-2 px-4 py-2 text-neutral-10 hover:bg-neutral-1 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Voltar
            </button>

            <div className="flex gap-2">
              {step === 3 && currentGoalIndex < formData.selected_indicators.length - 1 && (
                <button
                  onClick={() => setCurrentGoalIndex(currentGoalIndex + 1)}
                  className="px-4 py-2 text-neutral-10 hover:bg-neutral-1 rounded-lg transition-colors"
                >
                  Pular
                </button>
              )}
              
              {step < 4 ? (
                <button
                  onClick={handleNext}
                  disabled={!canProceed()}
                  className="flex items-center gap-2 px-6 py-2 bg-suno-red text-white font-semibold rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {step === 3 && currentGoalIndex < formData.selected_indicators.length - 1 ? 'Próximo Indicador' : 'Próximo'}
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  className="px-6 py-2 bg-suno-red text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
                >
                  Salvar Book
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

