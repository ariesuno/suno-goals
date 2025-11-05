'use client';

import { useState, useMemo } from 'react';
import { Search, TrendingUp, TrendingDown, X } from 'lucide-react';
import { mockIndicators } from '@/lib/mockIndicators';

type BookWizardStep2Props = {
  formData: any;
  setFormData: (data: any) => void;
};

export default function BookWizardStep2({ formData, setFormData }: BookWizardStep2Props) {
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
      if (searchTerm) {
        const search = searchTerm.toLowerCase();
        if (
          !indicator.name.toLowerCase().includes(search) &&
          !indicator.description.toLowerCase().includes(search)
        ) {
          return false;
        }
      }

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

  const removeIndicator = (indicatorId: string) => {
    setFormData({
      ...formData,
      selected_indicators: formData.selected_indicators.filter((i: any) => i.indicator_id !== indicatorId),
    });
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => (prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]));
  };

  return (
    <div className="space-y-6">
      {/* Indicadores Selecionados - Chips no topo */}
      {formData.selected_indicators.length > 0 && (
        <div className="p-4 bg-green-50 border-2 border-green-200 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-green-900">
              {formData.selected_indicators.length} de 6 indicadores selecionados
            </p>
            {formData.selected_indicators.length === 6 && (
              <span className="text-xs text-green-700 bg-green-100 px-2 py-1 rounded">
                Limite máximo
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.selected_indicators.map((ind: any) => (
              <div
                key={ind.indicator_id}
                className="flex items-center gap-2 px-3 py-1.5 bg-white border border-green-300 rounded-lg text-sm"
              >
                <span className="font-medium text-neutral-10">{ind.indicator_name}</span>
                <button
                  onClick={() => removeIndicator(ind.indicator_id)}
                  className="text-neutral-5 hover:text-suno-red transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Busca */}
      <div>
        <label className="block text-sm font-semibold text-neutral-10 mb-3">
          Buscar Indicadores
        </label>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Digite o nome ou descrição do indicador..."
            className="w-full pl-12 pr-4 py-3 border-2 border-neutral-3 rounded-lg focus:outline-none focus:border-suno-red transition-colors"
          />
        </div>
      </div>

      {/* Filtros por Tags */}
      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedTags.map(tag => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-suno-red text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
            >
              {tag}
              <X className="w-3.5 h-3.5" />
            </button>
          ))}
        </div>
      )}

      {/* Tags disponíveis */}
      <details className="group">
        <summary className="text-sm font-semibold text-neutral-10 cursor-pointer hover:text-suno-red transition-colors list-none flex items-center gap-2">
          <span>Filtrar por Tags</span>
          <span className="text-neutral-5 group-open:rotate-180 transition-transform">▼</span>
        </summary>
        <div className="flex flex-wrap gap-2 mt-3">
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
      </details>

      {/* Lista de Indicadores */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-semibold text-neutral-10">
            Selecione os Indicadores
          </label>
          <span className="text-xs text-neutral-5">
            {filteredIndicators.length} {filteredIndicators.length === 1 ? 'indicador' : 'indicadores'}
          </span>
        </div>

        <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2 -mr-2">
          {filteredIndicators.length === 0 ? (
            <div className="text-center py-12 text-neutral-5">
              <Search className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm">Nenhum indicador encontrado</p>
            </div>
          ) : (
            filteredIndicators.map(indicator => {
              const isSelected = formData.selected_indicators.some(
                (i: any) => i.indicator_id === indicator.id
              );
              const canSelect = formData.selected_indicators.length < 6 || isSelected;

              return (
                <button
                  key={indicator.id}
                  type="button"
                  onClick={() => canSelect && toggleIndicator(indicator.id)}
                  disabled={!canSelect}
                  className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                    isSelected
                      ? 'border-suno-red bg-red-50'
                      : canSelect
                      ? 'border-neutral-2 bg-white hover:border-neutral-3 hover:shadow-sm'
                      : 'border-neutral-2 bg-neutral-1 opacity-50 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Ícone de direção */}
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        isSelected
                          ? indicator.direction === 'up'
                            ? 'bg-green-100'
                            : 'bg-red-100'
                          : 'bg-neutral-1'
                      }`}
                    >
                      {indicator.direction === 'up' ? (
                        <TrendingUp
                          className={`w-5 h-5 ${isSelected ? 'text-green-700' : 'text-green-600'}`}
                        />
                      ) : (
                        <TrendingDown
                          className={`w-5 h-5 ${isSelected ? 'text-red-700' : 'text-suno-red'}`}
                        />
                      )}
                    </div>

                    {/* Conteúdo */}
                    <div className="flex-1 min-w-0">
                      <h3
                        className={`font-semibold mb-1 ${
                          isSelected ? 'text-suno-red' : 'text-neutral-10'
                        }`}
                      >
                        {indicator.name}
                      </h3>
                      <p className="text-sm text-neutral-8 line-clamp-2 mb-2">
                        {indicator.description}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1 mb-2">
                        {indicator.tags.slice(0, 3).map(tag => (
                          <span
                            key={tag.name}
                            className="px-2 py-0.5 bg-neutral-1 text-neutral-8 text-xs rounded"
                          >
                            {tag.name}
                          </span>
                        ))}
                        {indicator.tags.length > 3 && (
                          <span className="px-2 py-0.5 bg-neutral-1 text-neutral-5 text-xs rounded">
                            +{indicator.tags.length - 3}
                          </span>
                        )}
                      </div>

                      {/* Formato */}
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

                    {/* Checkmark */}
                    {isSelected && (
                      <div className="w-6 h-6 bg-suno-red rounded-full flex items-center justify-center flex-shrink-0">
                        <svg
                          className="w-4 h-4 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

