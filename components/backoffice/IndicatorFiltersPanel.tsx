import { IndicatorFilters, IndicatorStatus, IndicatorFormat } from '@/types/backoffice';
import { X } from 'lucide-react';

type IndicatorFiltersPanelProps = {
  filters: IndicatorFilters;
  onFiltersChange: (filters: IndicatorFilters) => void;
  onClose: () => void;
};

const statusOptions: { value: IndicatorStatus; label: string }[] = [
  { value: 'validated', label: 'Validado' },
  { value: 'in_construction', label: 'Em Construção' },
  { value: 'under_review', label: 'Em Revisão' },
];

const formatOptions: { value: IndicatorFormat; label: string }[] = [
  { value: 'percentage', label: 'Percentual (%)' },
  { value: 'number', label: 'Número (#)' },
  { value: 'currency', label: 'Financeiro (R$)' },
  { value: 'boolean', label: 'Booleano (✓)' },
  { value: 'hours', label: 'Horas (H)' },
];

const tagOptions = [
  { id: '1', name: 'Operacional', color: '#666666' },
  { id: '2', name: 'Vendas', color: '#d42126' },
  { id: '3', name: 'Financeiro', color: '#d42126' },
  { id: '4', name: 'Estratégico', color: '#4b4b4b' },
  { id: '5', name: 'Qualidade', color: '#999999' },
  { id: '6', name: 'Tech', color: '#666666' },
  { id: '7', name: 'RH', color: '#666666' },
  { id: '8', name: 'Projetos', color: '#4b4b4b' },
];

export default function IndicatorFiltersPanel({ filters, onFiltersChange, onClose }: IndicatorFiltersPanelProps) {
  const toggleStatus = (status: IndicatorStatus) => {
    const current = filters.status || [];
    const newStatus = current.includes(status)
      ? current.filter(s => s !== status)
      : [...current, status];
    onFiltersChange({ ...filters, status: newStatus.length > 0 ? newStatus : undefined });
  };

  const toggleFormat = (format: IndicatorFormat) => {
    const current = filters.format || [];
    const newFormat = current.includes(format)
      ? current.filter(f => f !== format)
      : [...current, format];
    onFiltersChange({ ...filters, format: newFormat.length > 0 ? newFormat : undefined });
  };

  const toggleTag = (tagId: string) => {
    const current = filters.tags || [];
    const newTags = current.includes(tagId)
      ? current.filter(t => t !== tagId)
      : [...current, tagId];
    onFiltersChange({ ...filters, tags: newTags.length > 0 ? newTags : undefined });
  };

  const toggleHasBooks = () => {
    if (filters.has_books === undefined) {
      onFiltersChange({ ...filters, has_books: true });
    } else if (filters.has_books === true) {
      onFiltersChange({ ...filters, has_books: false });
    } else {
      onFiltersChange({ ...filters, has_books: undefined });
    }
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  const hasActiveFilters = 
    (filters.status?.length || 0) + 
    (filters.format?.length || 0) + 
    (filters.tags?.length || 0) + 
    (filters.has_books !== undefined ? 1 : 0) > 0;

  return (
    <div className="bg-white border border-neutral-2 rounded-xl p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-semibold text-sm text-neutral-10">
          Filtros
        </h3>
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-xs text-suno-red hover:underline"
            >
              Limpar tudo
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1 hover:bg-neutral-1 rounded transition-colors"
          >
            <X className="w-4 h-4 text-neutral-8" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Status */}
        <div>
          <label className="block text-xs font-medium text-neutral-8 mb-2">
            Status
          </label>
          <div className="space-y-1.5">
            {statusOptions.map((option) => (
              <label
                key={option.value}
                className="flex items-center gap-2 cursor-pointer group"
              >
                <input
                  type="checkbox"
                  checked={filters.status?.includes(option.value) || false}
                  onChange={() => toggleStatus(option.value)}
                  className="w-4 h-4 rounded border-neutral-3 text-suno-red focus:ring-suno-red cursor-pointer"
                />
                <span className="text-sm text-neutral-10 group-hover:text-suno-red transition-colors">
                  {option.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Formato */}
        <div>
          <label className="block text-xs font-medium text-neutral-8 mb-2">
            Formato
          </label>
          <div className="space-y-1.5">
            {formatOptions.map((option) => (
              <label
                key={option.value}
                className="flex items-center gap-2 cursor-pointer group"
              >
                <input
                  type="checkbox"
                  checked={filters.format?.includes(option.value) || false}
                  onChange={() => toggleFormat(option.value)}
                  className="w-4 h-4 rounded border-neutral-3 text-suno-red focus:ring-suno-red cursor-pointer"
                />
                <span className="text-sm text-neutral-10 group-hover:text-suno-red transition-colors">
                  {option.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-xs font-medium text-neutral-8 mb-2">
            Tags
          </label>
          <div className="space-y-1.5">
            {tagOptions.map((tag) => (
              <label
                key={tag.id}
                className="flex items-center gap-2 cursor-pointer group"
              >
                <input
                  type="checkbox"
                  checked={filters.tags?.includes(tag.id) || false}
                  onChange={() => toggleTag(tag.id)}
                  className="w-4 h-4 rounded border-neutral-3 text-suno-red focus:ring-suno-red cursor-pointer"
                />
                <span className="text-sm text-neutral-10 group-hover:text-suno-red transition-colors flex items-center gap-1.5">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: tag.color }}
                  />
                  {tag.name}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Outros */}
        <div>
          <label className="block text-xs font-medium text-neutral-8 mb-2">
            Outros
          </label>
          <div className="space-y-1.5">
            <button
              onClick={toggleHasBooks}
              className={`w-full px-3 py-2 text-left text-sm rounded-lg border transition-colors ${
                filters.has_books === true
                  ? 'border-suno-red bg-red-50 text-suno-red'
                  : filters.has_books === false
                  ? 'border-neutral-3 bg-neutral-1 text-neutral-8'
                  : 'border-neutral-3 bg-white text-neutral-10 hover:border-neutral-5'
              }`}
            >
              {filters.has_books === true
                ? '✓ Com books'
                : filters.has_books === false
                ? '✗ Sem books'
                : 'Todos'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

