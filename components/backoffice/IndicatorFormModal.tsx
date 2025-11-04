import { BackofficeIndicator, IndicatorStatus, IndicatorFormat, IndicatorAggregationType } from '@/types/backoffice';
import { X } from 'lucide-react';
import { useState } from 'react';

type IndicatorFormModalProps = {
  indicator: BackofficeIndicator | null;
  onSave: (indicator: BackofficeIndicator) => void;
  onClose: () => void;
};

const availableTags = [
  { id: '1', name: 'Operacional', color: '#666666' },
  { id: '2', name: 'Vendas', color: '#d42126' },
  { id: '3', name: 'Financeiro', color: '#d42126' },
  { id: '4', name: 'Estratégico', color: '#4b4b4b' },
  { id: '5', name: 'Qualidade', color: '#999999' },
  { id: '6', name: 'Tech', color: '#666666' },
  { id: '7', name: 'RH', color: '#666666' },
  { id: '8', name: 'Projetos', color: '#4b4b4b' },
];

export default function IndicatorFormModal({ indicator, onSave, onClose }: IndicatorFormModalProps) {
  const [formData, setFormData] = useState<Partial<BackofficeIndicator>>({
    name: indicator?.name || '',
    description: indicator?.description || '',
    notes: indicator?.notes || '',
    format: indicator?.format || 'number',
    direction: indicator?.direction || 'up',
    status: indicator?.status || 'in_construction',
    aggregation_type: indicator?.aggregation_type || 'none',
    tags: indicator?.tags || [],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newIndicator: BackofficeIndicator = {
      id: indicator?.id || Date.now().toString(),
      name: formData.name!,
      description: formData.description!,
      notes: formData.notes,
      format: formData.format!,
      direction: formData.direction!,
      status: formData.status!,
      aggregation_type: formData.aggregation_type!,
      tags: formData.tags!,
      created_by: indicator?.created_by || 'admin-1',
      created_by_name: indicator?.created_by_name || 'Admin FP&A',
      created_at: indicator?.created_at || new Date(),
      updated_at: new Date(),
      total_books: indicator?.total_books || 0,
      average_achievement: indicator?.average_achievement || 0,
    };

    onSave(newIndicator);
  };

  const toggleTag = (tagId: string) => {
    const currentTags = formData.tags || [];
    const tag = availableTags.find(t => t.id === tagId);
    if (!tag) return;

    const hasTag = currentTags.some(t => t.id === tagId);
    const newTags = hasTag
      ? currentTags.filter(t => t.id !== tagId)
      : [...currentTags, tag];
    
    setFormData({ ...formData, tags: newTags });
  };

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={onClose}>
        {/* Modal */}
        <div
          className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-neutral-2 p-4 md:p-6 flex items-center justify-between">
            <h2 className="font-display font-bold text-xl text-neutral-10">
              {indicator ? 'Editar Indicador' : 'Novo Indicador'}
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-neutral-1 rounded-lg transition-colors">
              <X className="w-5 h-5 text-neutral-8" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-4">
            {/* Nome */}
            <div>
              <label className="block text-sm font-medium text-neutral-10 mb-1.5">
                Nome do Indicador *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-neutral-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-suno-red focus:border-suno-red text-sm"
                placeholder="Ex: Leads Qualificados"
              />
            </div>

            {/* Descrição */}
            <div>
              <label className="block text-sm font-medium text-neutral-10 mb-1.5">
                Descrição *
              </label>
              <textarea
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-neutral-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-suno-red focus:border-suno-red text-sm resize-none"
                placeholder="Descreva o que este indicador mede..."
              />
            </div>

            {/* Notas */}
            <div>
              <label className="block text-sm font-medium text-neutral-10 mb-1.5">
                Notas (opcional)
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={2}
                className="w-full px-3 py-2 border border-neutral-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-suno-red focus:border-suno-red text-sm resize-none"
                placeholder="Observações adicionais..."
              />
            </div>

            {/* Grid: Formato, Direção, Status */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Formato */}
              <div>
                <label className="block text-sm font-medium text-neutral-10 mb-1.5">
                  Formato *
                </label>
                <select
                  value={formData.format}
                  onChange={(e) => setFormData({ ...formData, format: e.target.value as IndicatorFormat })}
                  className="w-full px-3 py-2 border border-neutral-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-suno-red focus:border-suno-red text-sm"
                >
                  <option value="percentage">Percentual (%)</option>
                  <option value="number">Número (#)</option>
                  <option value="currency">Financeiro (R$)</option>
                  <option value="boolean">Booleano (✓/✗)</option>
                  <option value="hours">Horas (H)</option>
                </select>
              </div>

              {/* Direção */}
              <div>
                <label className="block text-sm font-medium text-neutral-10 mb-1.5">
                  Direção *
                </label>
                <select
                  value={formData.direction}
                  onChange={(e) => setFormData({ ...formData, direction: e.target.value as 'up' | 'down' })}
                  className="w-full px-3 py-2 border border-neutral-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-suno-red focus:border-suno-red text-sm"
                >
                  <option value="up">↑ Maior é melhor</option>
                  <option value="down">↓ Menor é melhor</option>
                </select>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-neutral-10 mb-1.5">
                  Status *
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as IndicatorStatus })}
                  className="w-full px-3 py-2 border border-neutral-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-suno-red focus:border-suno-red text-sm"
                >
                  <option value="in_construction">Em Construção</option>
                  <option value="under_review">Em Revisão</option>
                  <option value="validated">Validado</option>
                </select>
              </div>
            </div>

            {/* Agregação */}
            <div>
              <label className="block text-sm font-medium text-neutral-10 mb-1.5">
                Tipo de Agregação
              </label>
              <select
                value={formData.aggregation_type}
                onChange={(e) => setFormData({ ...formData, aggregation_type: e.target.value as IndicatorAggregationType })}
                className="w-full px-3 py-2 border border-neutral-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-suno-red focus:border-suno-red text-sm"
              >
                <option value="none">Nenhuma</option>
                <option value="average">Média de outros indicadores</option>
                <option value="sum">Soma de outros indicadores</option>
                <option value="count">Contagem de outros indicadores</option>
              </select>
              <p className="text-xs text-neutral-5 mt-1">
                Use quando este indicador for calculado a partir de outros
              </p>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-neutral-10 mb-2">
                Tags
              </label>
              <div className="flex flex-wrap gap-2">
                {availableTags.map((tag) => {
                  const isSelected = formData.tags?.some(t => t.id === tag.id);
                  return (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => toggleTag(tag.id)}
                      className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                        isSelected
                          ? 'bg-neutral-10 text-white'
                          : 'bg-neutral-1 text-neutral-8 hover:bg-neutral-2'
                      }`}
                      style={isSelected ? { borderLeft: `3px solid ${tag.color}` } : {}}
                    >
                      {tag.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-neutral-10 hover:bg-neutral-1 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-suno-red text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition-colors"
              >
                {indicator ? 'Salvar Alterações' : 'Criar Indicador'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

