'use client';

import { useState } from 'react';
import { Plus, Search, Filter, X } from 'lucide-react';
import { mockIndicators } from '@/lib/mockIndicators';
import { BackofficeIndicator, IndicatorFilters, IndicatorStatus, IndicatorFormat } from '@/types/backoffice';
import IndicatorCard from '@/components/backoffice/IndicatorCard';
import IndicatorDrawer from '@/components/backoffice/IndicatorDrawer';
import IndicatorFormModal from '@/components/backoffice/IndicatorFormModal';
import IndicatorFiltersPanel from '@/components/backoffice/IndicatorFiltersPanel';

export default function IndicatorsPage() {
  const [indicators, setIndicators] = useState<BackofficeIndicator[]>(mockIndicators);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<IndicatorFilters>({});
  const [showFilters, setShowFilters] = useState(false);
  const [selectedIndicator, setSelectedIndicator] = useState<BackofficeIndicator | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingIndicator, setEditingIndicator] = useState<BackofficeIndicator | null>(null);

  // Filtrar indicadores
  const filteredIndicators = indicators.filter(indicator => {
    // Busca por nome ou descrição
    if (searchTerm && !indicator.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !indicator.description.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }

    // Filtro por status
    if (filters.status && filters.status.length > 0 && !filters.status.includes(indicator.status)) {
      return false;
    }

    // Filtro por formato
    if (filters.format && filters.format.length > 0 && !filters.format.includes(indicator.format)) {
      return false;
    }

    // Filtro por tags
    if (filters.tags && filters.tags.length > 0) {
      const indicatorTagIds = indicator.tags.map(t => t.id);
      const hasTag = filters.tags.some(tagId => indicatorTagIds.includes(tagId));
      if (!hasTag) return false;
    }

    // Filtro por "tem books"
    if (filters.has_books !== undefined) {
      const hasBooks = (indicator.total_books || 0) > 0;
      if (filters.has_books !== hasBooks) return false;
    }

    return true;
  });

  const handleCreateIndicator = () => {
    setEditingIndicator(null);
    setShowForm(true);
  };

  const handleEditIndicator = (indicator: BackofficeIndicator) => {
    // Atualizar o indicador no estado
    setIndicators(prev => prev.map(i => i.id === indicator.id ? indicator : i));
    // Atualizar o indicador selecionado para refletir as mudanças no drawer
    setSelectedIndicator(indicator);
  };

  const handleSaveIndicator = (indicator: BackofficeIndicator) => {
    // Criar novo indicador
    setIndicators(prev => [...prev, { ...indicator, id: Date.now().toString() }]);
    setShowForm(false);
    setEditingIndicator(null);
  };

  const handleDeleteIndicator = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este indicador?')) {
      setIndicators(prev => prev.filter(i => i.id !== id));
      setSelectedIndicator(null);
    }
  };

  const activeFiltersCount = 
    (filters.status?.length || 0) + 
    (filters.format?.length || 0) + 
    (filters.tags?.length || 0) + 
    (filters.has_books !== undefined ? 1 : 0);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-display font-bold text-2xl md:text-3xl text-neutral-10 mb-1">
            Indicadores
          </h1>
          <p className="text-sm text-neutral-8">
            {filteredIndicators.length} de {indicators.length} indicadores
          </p>
        </div>
        <button
          onClick={handleCreateIndicator}
          className="flex items-center gap-2 px-4 py-2.5 bg-suno-red text-white font-semibold text-sm rounded-lg hover:bg-red-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Novo Indicador
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-2">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-5" />
          <input
            type="text"
            placeholder="Buscar por nome ou descrição..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-neutral-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-suno-red focus:border-suno-red text-sm"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-5 hover:text-neutral-10"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Button */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-2.5 border rounded-lg font-medium text-sm transition-colors ${
            showFilters || activeFiltersCount > 0
              ? 'border-suno-red bg-red-50 text-suno-red'
              : 'border-neutral-3 bg-white text-neutral-10 hover:border-neutral-5'
          }`}
        >
          <Filter className="w-4 h-4" />
          Filtros
          {activeFiltersCount > 0 && (
            <span className="px-1.5 py-0.5 bg-suno-red text-white text-xs font-bold rounded-full">
              {activeFiltersCount}
            </span>
          )}
        </button>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <IndicatorFiltersPanel
          filters={filters}
          onFiltersChange={setFilters}
          onClose={() => setShowFilters(false)}
        />
      )}

      {/* Indicators Grid */}
      {filteredIndicators.length === 0 ? (
        <div className="bg-white border border-neutral-2 rounded-xl p-12 text-center">
          <p className="text-neutral-8 mb-2">Nenhum indicador encontrado</p>
          <p className="text-sm text-neutral-5">
            {searchTerm || activeFiltersCount > 0
              ? 'Tente ajustar os filtros de busca'
              : 'Crie seu primeiro indicador para começar'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredIndicators.map((indicator) => (
            <IndicatorCard
              key={indicator.id}
              indicator={indicator}
              onClick={() => setSelectedIndicator(indicator)}
            />
          ))}
        </div>
      )}

      {/* Drawer de Detalhes */}
      {selectedIndicator && (
        <IndicatorDrawer
          indicator={selectedIndicator}
          onClose={() => setSelectedIndicator(null)}
          onEdit={handleEditIndicator}
          onDelete={handleDeleteIndicator}
        />
      )}

      {/* Modal de Formulário */}
      {showForm && (
        <IndicatorFormModal
          indicator={editingIndicator}
          onSave={handleSaveIndicator}
          onClose={() => {
            setShowForm(false);
            setEditingIndicator(null);
          }}
        />
      )}
    </div>
  );
}
