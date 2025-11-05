'use client';

import { useState, useMemo } from 'react';
import { Search, Check, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';
import { mockIndicators } from '@/lib/mockIndicators';

type BookStep2IndicatorsProps = {
  formData: any;
  setFormData: (data: any) => void;
};

export default function BookStep2Indicators({ formData, setFormData }: BookStep2IndicatorsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Extrair todas as tags únicas
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    mockIndicators.forEach(ind => {
      ind.tags.forEach(tag => tags.add(tag.name));
    });
    return Array.from(tags).sort();
  }, []);

  // Filtrar indicadores
  const filteredIndicators = useMemo(() => {
    return mockIndicators.filter(indicator => {
      // Busca
      if (searchTerm) {
        const search = searchTerm.toLowerCase();
        if (
          !indicator.name.toLowerCase().includes(search) &&
          !indicator.description.toLowerCase().includes(search)
        ) {
          return false;
        }
      }

      // Tags
      if (selectedTags.length > 0) {
        const indicatorTags = indicator.tags.map(t => t.name);
        if (!selectedTags.some(tag => indicatorTags.includes(tag))) {
          return false;
        }
      }

      return true;
    });
  }, [searchTerm, selectedTags]);

  const toggleIndicator = (indicatorId: string) => {
    const indicator = mockIndicators.find(i => i.id === indicatorId);
    if (!indicator) return;

    const isSelected = formData.selected_indicators.some((i: any) => i.indicator_id === indicatorId);

    if (isSelected) {
      setFormData({
        ...formData,
        selected_indicators: formData.selected_indicators.filter((i: any) => i.indicator_id !== indicatorId),
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

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-neutral-2 p-6">
        <h2 className="font-display font-bold text-xl text-neutral-10 mb-2">
          Selecionar Indicadores
        </h2>
        <p className="text-sm text-neutral-8 mb-4">
          Escolha entre 1 e 6 indicadores para este book
        </p>

        {/* Contador */}
        <div className="flex items-center gap-3">
          <div
            className={`px-4 py-2 rounded-lg font-semibold ${
              formData.selected_indicators.length === 0
                ? 'bg-neutral-2 text-neutral-5'
                : formData.selected_indicators.length <= 6
                ? 'bg-green-50 text-green-700'
                : 'bg-red-50 text-suno-red'
            }`}
          >
            {formData.selected_indicators.length} de 6 selecionados
          </div>
          {formData.selected_indicators.length === 0 && (
            <p className="text-sm text-neutral-5">Selecione pelo menos 1 indicador</p>
          )}
          {formData.selected_indicators.length === 6 && (
            <p className="text-sm text-neutral-8">Limite máximo atingido</p>
          )}
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl border border-neutral-2 p-6">
        {/* Busca */}
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar indicadores por nome ou descrição..."
              className="w-full pl-12 pr-4 py-3 border border-neutral-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-suno-red"
            />
          </div>
        </div>

        {/* Tags */}
        <div>
          <p className="text-xs font-medium text-neutral-5 uppercase tracking-wide mb-3">
            Filtrar por Tags
          </p>
          <div className="flex flex-wrap gap-2">
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                  selectedTags.includes(tag)
                    ? 'bg-suno-red text-white'
                    : 'bg-neutral-1 text-neutral-8 hover:bg-neutral-2'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid de Indicadores */}
      {filteredIndicators.length === 0 ? (
        <div className="bg-white rounded-xl border border-neutral-2 p-12 text-center">
          <AlertCircle className="w-12 h-12 text-neutral-3 mx-auto mb-3" />
          <p className="text-neutral-8 mb-2">Nenhum indicador encontrado</p>
          <p className="text-sm text-neutral-5">Tente ajustar os filtros de busca</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredIndicators.map(indicator => {
            const isSelected = formData.selected_indicators.some(
              (i: any) => i.indicator_id === indicator.id
            );

            return (
              <button
                key={indicator.id}
                onClick={() => toggleIndicator(indicator.id)}
                className={`relative p-5 rounded-xl border-2 text-left transition-all ${
                  isSelected
                    ? 'border-suno-red bg-red-50 shadow-md'
                    : 'border-neutral-2 bg-white hover:border-neutral-3 hover:shadow-sm'
                }`}
              >
                {/* Checkbox */}
                <div
                  className={`absolute top-4 right-4 w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors ${
                    isSelected
                      ? 'bg-suno-red border-suno-red'
                      : 'bg-white border-neutral-3'
                  }`}
                >
                  {isSelected && <Check className="w-4 h-4 text-white" />}
                </div>

                {/* Conteúdo */}
                <div className="pr-8">
                  <div className="flex items-start gap-2 mb-2">
                    {indicator.direction === 'up' ? (
                      <TrendingUp className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    ) : (
                      <TrendingDown className="w-5 h-5 text-suno-red flex-shrink-0 mt-0.5" />
                    )}
                    <h3 className="font-semibold text-neutral-10 line-clamp-2">
                      {indicator.name}
                    </h3>
                  </div>

                  <p className="text-sm text-neutral-8 line-clamp-2 mb-3">
                    {indicator.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1">
                    {indicator.tags.slice(0, 2).map(tag => (
                      <span
                        key={tag.name}
                        className="px-2 py-0.5 bg-neutral-1 text-neutral-8 text-xs rounded"
                      >
                        {tag.name}
                      </span>
                    ))}
                    {indicator.tags.length > 2 && (
                      <span className="px-2 py-0.5 bg-neutral-1 text-neutral-5 text-xs rounded">
                        +{indicator.tags.length - 2}
                      </span>
                    )}
                  </div>

                  {/* Formato */}
                  <div className="mt-3 pt-3 border-t border-neutral-2">
                    <p className="text-xs text-neutral-5">
                      Formato:{' '}
                      <span className="text-neutral-8 font-medium">
                        {indicator.format === 'percentage' && 'Percentual'}
                        {indicator.format === 'number' && 'Número'}
                        {indicator.format === 'currency' && 'Financeiro'}
                        {indicator.format === 'boolean' && 'Sim/Não'}
                      </span>
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

