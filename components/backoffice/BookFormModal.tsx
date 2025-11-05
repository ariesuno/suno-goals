import { BackofficeBook, BookOwnerType, MonthlyGoals } from '@/types/backoffice';
import { X, ChevronLeft, ChevronRight, User, Users, AlertCircle, Search } from 'lucide-react';
import { useState, useMemo } from 'react';
import { mockIndicators } from '@/lib/mockIndicators';
import { mockUsers, mockTeams } from '@/lib/mockUsers';
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
  const [ownerSearchTerm, setOwnerSearchTerm] = useState('');
  const [showOwnerDropdown, setShowOwnerDropdown] = useState(false);

  // Filtrar pessoas ou times baseado no tipo selecionado e busca
  const filteredOwners = useMemo(() => {
    if (formData.owner_type === 'person') {
      return mockUsers
        .filter(u => u.role !== 'admin') // Admins não recebem books
        .filter(u => !u.team_id) // Pessoas em times não podem ter book individual
        .filter(u => {
          if (!ownerSearchTerm) return true;
          const search = ownerSearchTerm.toLowerCase();
          return (
            u.full_name.toLowerCase().includes(search) ||
            u.email_prefix.toLowerCase().includes(search) ||
            (u.department && u.department.toLowerCase().includes(search))
          );
        });
    } else {
      return mockTeams
        .filter(t => t.is_active)
        .filter(t => {
          if (!ownerSearchTerm) return true;
          const search = ownerSearchTerm.toLowerCase();
          return (
            t.name.toLowerCase().includes(search) ||
            t.manager_name.toLowerCase().includes(search) ||
            (t.department && t.department.toLowerCase().includes(search))
          );
        });
    }
  }, [formData.owner_type, ownerSearchTerm]);

  const handleSelectOwner = (owner: any) => {
    if (formData.owner_type === 'person') {
      setFormData({
        ...formData,
        owner_id: owner.id,
        owner_name: owner.full_name,
        owner_email: owner.email_prefix + '@suno.com.br',
        owner_role: owner.department,
      });
    } else {
      setFormData({
        ...formData,
        owner_id: owner.id,
        owner_name: owner.name,
        owner_role: owner.department,
      });
    }
    setShowOwnerDropdown(false);
    setOwnerSearchTerm('');
  };

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
                      onClick={() => {
                        setFormData({ 
                          ...formData, 
                          owner_type: 'person',
                          owner_id: '',
                          owner_name: '',
                          owner_email: undefined,
                          owner_role: undefined,
                        });
                        setOwnerSearchTerm('');
                        setShowOwnerDropdown(false);
                      }}
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
                      onClick={() => {
                        setFormData({ 
                          ...formData, 
                          owner_type: 'team',
                          owner_id: '',
                          owner_name: '',
                          owner_email: undefined,
                          owner_role: undefined,
                        });
                        setOwnerSearchTerm('');
                        setShowOwnerDropdown(false);
                      }}
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

                {/* Seletor de Owner (Pessoa ou Time) */}
                <div className="relative">
                  <label className="block text-sm font-medium text-neutral-10 mb-2">
                    {formData.owner_type === 'person' ? 'Selecionar Pessoa *' : 'Selecionar Time *'}
                  </label>
                  
                  {/* Owner Selecionado (Preview) */}
                  {formData.owner_id && formData.owner_name ? (
                    <div className="mb-3 p-4 bg-neutral-1 border border-neutral-2 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-neutral-2 rounded-full flex items-center justify-center">
                            {formData.owner_type === 'person' ? (
                              <User className="w-5 h-5 text-neutral-8" />
                            ) : (
                              <Users className="w-5 h-5 text-neutral-8" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-neutral-10">{formData.owner_name}</p>
                            {formData.owner_role && (
                              <p className="text-sm text-neutral-8">{formData.owner_role}</p>
                            )}
                            {formData.owner_email && (
                              <p className="text-xs text-neutral-5 font-mono">{formData.owner_email}</p>
                            )}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setFormData({
                              ...formData,
                              owner_id: '',
                              owner_name: '',
                              owner_email: undefined,
                              owner_role: undefined,
                            });
                            setShowOwnerDropdown(true);
                          }}
                          className="text-sm text-suno-red hover:underline"
                        >
                          Alterar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setShowOwnerDropdown(!showOwnerDropdown)}
                      className="w-full px-3 py-2 border border-neutral-3 rounded-lg text-left text-neutral-5 hover:border-neutral-5 transition-colors flex items-center justify-between"
                    >
                      <span>
                        {formData.owner_type === 'person' 
                          ? 'Clique para selecionar uma pessoa...' 
                          : 'Clique para selecionar um time...'}
                      </span>
                      <Search className="w-4 h-4" />
                    </button>
                  )}

                  {/* Dropdown com busca */}
                  {showOwnerDropdown && (
                    <div className="absolute z-10 w-full mt-2 bg-white border border-neutral-3 rounded-lg shadow-lg max-h-80 overflow-hidden flex flex-col">
                      {/* Campo de busca */}
                      <div className="p-3 border-b border-neutral-2">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-5" />
                          <input
                            type="text"
                            value={ownerSearchTerm}
                            onChange={(e) => setOwnerSearchTerm(e.target.value)}
                            placeholder={formData.owner_type === 'person' ? 'Buscar pessoa...' : 'Buscar time...'}
                            className="w-full pl-10 pr-3 py-2 border border-neutral-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-suno-red text-sm"
                            autoFocus
                          />
                        </div>
                      </div>

                      {/* Lista de opções */}
                      <div className="overflow-y-auto">
                        {filteredOwners.length === 0 ? (
                          <div className="p-4 text-center text-sm text-neutral-5">
                            {formData.owner_type === 'person' 
                              ? 'Nenhuma pessoa encontrada' 
                              : 'Nenhum time encontrado'}
                          </div>
                        ) : (
                          filteredOwners.map((owner: any) => (
                            <button
                              key={owner.id}
                              type="button"
                              onClick={() => handleSelectOwner(owner)}
                              className="w-full p-3 hover:bg-neutral-1 transition-colors text-left border-b border-neutral-1 last:border-b-0"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-neutral-2 rounded-full flex items-center justify-center flex-shrink-0">
                                  {formData.owner_type === 'person' ? (
                                    <User className="w-5 h-5 text-neutral-8" />
                                  ) : (
                                    <Users className="w-5 h-5 text-neutral-8" />
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium text-neutral-10 truncate">
                                    {formData.owner_type === 'person' ? owner.full_name : owner.name}
                                  </p>
                                  {formData.owner_type === 'person' ? (
                                    <>
                                      {owner.department && (
                                        <p className="text-sm text-neutral-8 truncate">{owner.department}</p>
                                      )}
                                      <p className="text-xs text-neutral-5 font-mono truncate">
                                        {owner.email_prefix}@suno.com.br
                                      </p>
                                    </>
                                  ) : (
                                    <>
                                      <p className="text-sm text-neutral-8 truncate">
                                        Manager: {owner.manager_name}
                                      </p>
                                      <p className="text-xs text-neutral-5">
                                        {owner.member_count} {owner.member_count === 1 ? 'membro' : 'membros'}
                                      </p>
                                    </>
                                  )}
                                </div>
                              </div>
                            </button>
                          ))
                        )}
                      </div>

                      {/* Botão para fechar */}
                      <div className="p-2 border-t border-neutral-2 bg-neutral-1">
                        <button
                          type="button"
                          onClick={() => {
                            setShowOwnerDropdown(false);
                            setOwnerSearchTerm('');
                          }}
                          className="w-full px-3 py-2 text-sm text-neutral-8 hover:bg-neutral-2 rounded-lg transition-colors"
                        >
                          Fechar
                        </button>
                      </div>
                    </div>
                  )}
                </div>

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

