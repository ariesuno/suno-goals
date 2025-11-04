import { BackofficeBook } from '@/types/backoffice';
import { X, Edit2, Trash2, User, Users, Calendar, TrendingUp, AlertCircle, CheckCircle, History, Plus } from 'lucide-react';
import { useState } from 'react';

type BookDrawerProps = {
  book: BackofficeBook;
  onClose: () => void;
  onEdit: (book: BackofficeBook) => void;
  onDelete: (id: string) => void;
};

const performanceLevelConfig = {
  excellent: { label: 'Ótimo', color: 'text-neutral-10', bg: 'bg-neutral-1' },
  good: { label: 'Bom', color: 'text-neutral-10', bg: 'bg-neutral-1' },
  regular: { label: 'Regular', color: 'text-neutral-8', bg: 'bg-neutral-1' },
  critical: { label: 'Crítico', color: 'text-suno-red', bg: 'bg-red-50' },
};

const formatLabels = {
  percentage: '%',
  number: '#',
  currency: 'R$',
  boolean: '✓',
  hours: 'H',
};

const monthLabels = {
  jan: 'Jan', feb: 'Fev', mar: 'Mar', apr: 'Abr',
  may: 'Mai', jun: 'Jun', jul: 'Jul', aug: 'Ago',
  sep: 'Set', oct: 'Out', nov: 'Nov', dec: 'Dez',
};

export default function BookDrawer({ book, onClose, onEdit, onDelete }: BookDrawerProps) {
  const [activeTab, setActiveTab] = useState<'info' | 'indicators' | 'history' | 'performance'>('info');
  const [isEditing, setIsEditing] = useState(false);

  const performanceConfig = book.performance_level 
    ? performanceLevelConfig[book.performance_level]
    : null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed top-0 right-0 bottom-0 w-full max-w-3xl bg-white z-50 shadow-xl overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-neutral-2 p-4 md:p-6 z-10">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h2 className="font-display font-bold text-xl md:text-2xl text-neutral-10 mb-2">
                {book.name}
              </h2>
              <div className="flex items-center gap-2 text-sm text-neutral-8">
                {book.owner.type === 'person' ? (
                  <User className="w-4 h-4" />
                ) : (
                  <Users className="w-4 h-4" />
                )}
                <span className="font-medium">{book.owner.name}</span>
                {book.owner.role && (
                  <span className="text-neutral-5">• {book.owner.role}</span>
                )}
                {book.owner.team_members_count && (
                  <span className="text-neutral-5">• {book.owner.team_members_count} membros</span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {!isEditing && (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="p-2 hover:bg-neutral-1 rounded-lg transition-colors"
                    title="Editar"
                  >
                    <Edit2 className="w-5 h-5 text-neutral-8" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Tem certeza que deseja excluir este book?')) {
                        onDelete(book.id);
                      }
                    }}
                    className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                    title="Excluir"
                  >
                    <Trash2 className="w-5 h-5 text-suno-red" />
                  </button>
                </>
              )}
              <button
                onClick={onClose}
                className="p-2 hover:bg-neutral-1 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-neutral-8" />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mt-4 border-b border-neutral-2">
            <button
              onClick={() => setActiveTab('info')}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === 'info'
                  ? 'text-suno-red border-b-2 border-suno-red'
                  : 'text-neutral-8 hover:text-neutral-10'
              }`}
            >
              Informações
            </button>
            <button
              onClick={() => setActiveTab('indicators')}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === 'indicators'
                  ? 'text-suno-red border-b-2 border-suno-red'
                  : 'text-neutral-8 hover:text-neutral-10'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              Indicadores ({book.total_indicators})
              {book.indicators_with_missing_goals > 0 && (
                <span className="px-1.5 py-0.5 bg-suno-red text-white text-xs font-bold rounded-full">
                  {book.indicators_with_missing_goals}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('performance')}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === 'performance'
                  ? 'text-suno-red border-b-2 border-suno-red'
                  : 'text-neutral-8 hover:text-neutral-10'
              }`}
            >
              Performance
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === 'history'
                  ? 'text-suno-red border-b-2 border-suno-red'
                  : 'text-neutral-8 hover:text-neutral-10'
              }`}
            >
              <History className="w-4 h-4" />
              Histórico
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 md:p-6">
          {activeTab === 'info' && (
            <div className="space-y-6">
              {/* Ano */}
              <div>
                <label className="block text-sm font-medium text-neutral-8 mb-2">
                  Ano
                </label>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-neutral-5" />
                  <span className="text-neutral-10">{book.year}</span>
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-neutral-8 mb-2">
                  Status
                </label>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium ${
                  book.is_active
                    ? 'bg-neutral-1 text-neutral-10'
                    : 'bg-neutral-1 text-neutral-5'
                }`}>
                  {book.is_active ? (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Ativo
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-4 h-4" />
                      Inativo
                    </>
                  )}
                </span>
              </div>

              {/* Quarters Ativos */}
              <div>
                <label className="block text-sm font-medium text-neutral-8 mb-2">
                  Quarters Ativos
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4].map((q) => (
                    <div
                      key={q}
                      className={`flex items-center justify-center w-12 h-12 rounded-lg font-semibold text-sm ${
                        book.active_quarters.includes(q)
                          ? 'bg-neutral-10 text-white'
                          : 'bg-neutral-1 text-neutral-5'
                      }`}
                    >
                      Q{q}
                    </div>
                  ))}
                </div>
                <p className="text-xs text-neutral-5 mt-2">
                  {book.active_quarters.length === 4
                    ? 'Ativo o ano todo'
                    : `Ativo em ${book.active_quarters.length} quarter${book.active_quarters.length > 1 ? 's' : ''}`}
                </p>
              </div>

              {/* Descrição */}
              {book.description && (
                <div>
                  <label className="block text-sm font-medium text-neutral-8 mb-2">
                    Descrição
                  </label>
                  <p className="text-sm text-neutral-10 bg-neutral-1 p-3 rounded-lg">
                    {book.description}
                  </p>
                </div>
              )}

              {/* Meta Info */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-neutral-2">
                <div>
                  <label className="block text-xs text-neutral-5 mb-1">
                    Criado por
                  </label>
                  <p className="text-sm font-medium text-neutral-10">
                    {book.created_by_name}
                  </p>
                </div>
                <div>
                  <label className="block text-xs text-neutral-5 mb-1">
                    Criado em
                  </label>
                  <p className="text-sm font-medium text-neutral-10">
                    {new Date(book.created_at).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'indicators' && (
            <div className="space-y-4">
              {book.indicators.map((indicator, index) => (
                <div
                  key={indicator.id}
                  className="bg-white border border-neutral-2 rounded-lg p-4 hover:border-neutral-5 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-neutral-5">#{index + 1}</span>
                        <h4 className="font-medium text-sm text-neutral-10">
                          {indicator.indicator_name}
                        </h4>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        <span className="text-xs text-neutral-5">
                          {formatLabels[indicator.indicator_format]} • {indicator.indicator_direction === 'up' ? '↑' : '↓'}
                        </span>
                        {indicator.indicator_tags.slice(0, 2).map((tag) => (
                          <span
                            key={tag.id}
                            className="px-2 py-0.5 bg-neutral-1 text-neutral-8 text-xs rounded"
                            style={{ borderLeft: `2px solid ${tag.color}` }}
                          >
                            {tag.name}
                          </span>
                        ))}
                      </div>
                    </div>
                    {indicator.has_missing_goals ? (
                      <div className="flex items-center gap-1.5 text-xs font-medium text-suno-red whitespace-nowrap">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {indicator.missing_goals_count} sem meta
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-xs font-medium text-neutral-8 whitespace-nowrap">
                        <CheckCircle className="w-3.5 h-3.5" />
                        Todas ok
                      </div>
                    )}
                  </div>

                  {/* Metas Preview */}
                  {!indicator.has_missing_goals && (
                    <div className="mt-3 pt-3 border-t border-neutral-2">
                      <p className="text-xs text-neutral-5 mb-2">Metas 2025:</p>
                      <div className="grid grid-cols-4 gap-2 text-xs">
                        <div>
                          <span className="text-neutral-5">Q1:</span>
                          <span className="ml-1 font-medium text-neutral-10">
                            {indicator.goals.jan && indicator.goals.feb && indicator.goals.mar
                              ? `${indicator.goals.jan}-${indicator.goals.mar}`
                              : '—'}
                          </span>
                        </div>
                        <div>
                          <span className="text-neutral-5">Q2:</span>
                          <span className="ml-1 font-medium text-neutral-10">
                            {indicator.goals.apr && indicator.goals.may && indicator.goals.jun
                              ? `${indicator.goals.apr}-${indicator.goals.jun}`
                              : '—'}
                          </span>
                        </div>
                        <div>
                          <span className="text-neutral-5">Q3:</span>
                          <span className="ml-1 font-medium text-neutral-10">
                            {indicator.goals.jul && indicator.goals.aug && indicator.goals.sep
                              ? `${indicator.goals.jul}-${indicator.goals.sep}`
                              : '—'}
                          </span>
                        </div>
                        <div>
                          <span className="text-neutral-5">Q4:</span>
                          <span className="ml-1 font-medium text-neutral-10">
                            {indicator.goals.oct && indicator.goals.nov && indicator.goals.dec
                              ? `${indicator.goals.oct}-${indicator.goals.dec}`
                              : '—'}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Performance */}
                  {indicator.current_performance !== undefined && (
                    <div className="mt-3 pt-3 border-t border-neutral-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-neutral-5">Performance Atual:</span>
                        <span className={`font-bold ${
                          indicator.is_achieving ? 'text-neutral-10' : 'text-suno-red'
                        }`}>
                          {indicator.current_performance}%
                          {indicator.is_achieving ? ' ✓' : ' ✗'}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="mt-3 pt-3 border-t border-neutral-2 flex gap-2">
                    <button className="flex-1 px-3 py-1.5 text-xs font-medium text-neutral-10 bg-neutral-1 rounded hover:bg-neutral-2 transition-colors">
                      Editar Metas
                    </button>
                    <button className="px-3 py-1.5 text-xs font-medium text-suno-red hover:bg-red-50 rounded transition-colors">
                      Remover
                    </button>
                  </div>
                </div>
              ))}

              {/* Add More */}
              {book.total_indicators < 6 && (
                <button className="w-full py-3 border-2 border-dashed border-neutral-3 rounded-lg text-sm font-medium text-neutral-8 hover:border-neutral-5 hover:text-neutral-10 transition-colors flex items-center justify-center gap-2">
                  <Plus className="w-4 h-4" />
                  Adicionar Indicador ({book.total_indicators}/6)
                </button>
              )}
            </div>
          )}

          {activeTab === 'performance' && performanceConfig && (
            <div className="space-y-6">
              {/* Overall Performance */}
              <div className="bg-neutral-1 rounded-xl p-6 text-center">
                <p className="text-sm text-neutral-5 mb-2">Atingimento Acumulado</p>
                <div className="text-5xl font-bold text-neutral-10 mb-2">
                  {book.overall_performance}%
                </div>
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${performanceConfig.bg}`}>
                  <span className={`text-sm font-semibold ${performanceConfig.color}`}>
                    {performanceConfig.label}
                  </span>
                </div>
              </div>

              {/* Indicators Achieving */}
              <div>
                <p className="text-sm font-medium text-neutral-8 mb-3">
                  Indicadores Batendo Meta: {book.indicators_achieving}/{book.total_indicators} ({Math.round((book.indicators_achieving! / book.total_indicators) * 100)}%)
                </p>
                <div className="w-full h-2 bg-neutral-1 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-neutral-10 transition-all"
                    style={{ width: `${(book.indicators_achieving! / book.total_indicators) * 100}%` }}
                  />
                </div>
              </div>

              {/* Detalhamento */}
              <div>
                <p className="text-sm font-medium text-neutral-8 mb-3">Detalhamento:</p>
                <div className="space-y-2">
                  {book.indicators.map((indicator) => (
                    <div
                      key={indicator.id}
                      className="flex items-center justify-between p-3 bg-neutral-1 rounded-lg"
                    >
                      <span className="text-sm text-neutral-10">
                        {indicator.indicator_name}
                      </span>
                      <span className={`text-sm font-bold ${
                        indicator.is_achieving ? 'text-neutral-10' : 'text-suno-red'
                      }`}>
                        {indicator.current_performance}%
                        {indicator.is_achieving ? ' ✓' : ' ✗'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-3">
              {book.history && book.history.length > 0 ? (
                book.history.map((entry) => (
                  <div
                    key={`${entry.quarter}-${entry.year}`}
                    className="bg-neutral-1 rounded-lg p-4"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                        <History className="w-4 h-4 text-neutral-8" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm text-neutral-10 mb-1">
                          Q{entry.quarter} {entry.year}
                        </h4>
                        <p className="text-xs text-neutral-8">
                          {entry.indicators.length} indicadores
                        </p>
                        {entry.changes && (
                          <div className="mt-2 space-y-1">
                            {entry.changes.added && entry.changes.added.length > 0 && (
                              <p className="text-xs text-neutral-10">
                                ✚ Adicionado: {entry.changes.added.length} indicador(es)
                              </p>
                            )}
                            {entry.changes.removed && entry.changes.removed.length > 0 && (
                              <p className="text-xs text-suno-red">
                                ✖ Removido: {entry.changes.removed.length} indicador(es)
                              </p>
                            )}
                          </div>
                        )}
                        <p className="text-xs text-neutral-5 mt-2">
                          {new Date(entry.changed_at).toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <History className="w-12 h-12 text-neutral-3 mx-auto mb-3" />
                  <p className="text-sm text-neutral-8">
                    Nenhuma mudança registrada ainda
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

