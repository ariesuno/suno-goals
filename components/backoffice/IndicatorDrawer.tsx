import { BackofficeIndicator } from '@/types/backoffice';
import { X, Edit2, Trash2, TrendingUp, TrendingDown, BookOpen, Clock, AlertCircle, CheckCircle, History } from 'lucide-react';
import { useState } from 'react';

type IndicatorDrawerProps = {
  indicator: BackofficeIndicator;
  onClose: () => void;
  onEdit: (indicator: BackofficeIndicator) => void;
  onDelete: (id: string) => void;
};

const formatLabels = {
  percentage: 'Percentual (%)',
  number: 'Número (#)',
  currency: 'Financeiro (R$)',
  boolean: 'Booleano (✓/✗)',
  hours: 'Horas (H)',
};

const statusConfig = {
  validated: { label: 'Validado', icon: CheckCircle, color: 'text-neutral-8', bg: 'bg-neutral-1' },
  in_construction: { label: 'Em Construção', icon: Clock, color: 'text-neutral-5', bg: 'bg-neutral-1' },
  under_review: { label: 'Em Revisão', icon: AlertCircle, color: 'text-suno-red', bg: 'bg-red-50' },
};

const aggregationLabels = {
  none: 'Nenhuma',
  average: 'Média',
  sum: 'Soma',
  count: 'Contagem',
};

export default function IndicatorDrawer({ indicator, onClose, onEdit, onDelete }: IndicatorDrawerProps) {
  const [activeTab, setActiveTab] = useState<'details' | 'books' | 'history'>('details');
  const StatusIcon = statusConfig[indicator.status].icon;
  const DirectionIcon = indicator.direction === 'up' ? TrendingUp : TrendingDown;

  // Mock history
  const mockHistory = [
    {
      id: '1',
      user_name: 'Admin FP&A',
      action: 'updated',
      field_changed: 'status',
      old_value: 'in_construction',
      new_value: 'validated',
      created_at: new Date('2025-01-15T10:30:00'),
    },
    {
      id: '2',
      user_name: 'Admin FP&A',
      action: 'created',
      created_at: new Date('2025-01-01T09:00:00'),
    },
  ];

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed top-0 right-0 bottom-0 w-full max-w-2xl bg-white z-50 shadow-xl overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-neutral-2 p-4 md:p-6 z-10">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h2 className="font-display font-bold text-xl md:text-2xl text-neutral-10 mb-2">
                {indicator.name}
              </h2>
              <div className="flex flex-wrap items-center gap-2">
                {/* Status */}
                <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${statusConfig[indicator.status].bg} ${statusConfig[indicator.status].color}`}>
                  <StatusIcon className="w-3.5 h-3.5" />
                  {statusConfig[indicator.status].label}
                </span>

                {/* Formato */}
                <span className="px-2.5 py-1 bg-neutral-1 text-neutral-8 text-xs font-medium rounded-lg">
                  {formatLabels[indicator.format]}
                </span>

                {/* Direção */}
                <span className="flex items-center gap-1 px-2.5 py-1 bg-neutral-1 text-neutral-8 text-xs font-medium rounded-lg">
                  <DirectionIcon className="w-3.5 h-3.5" />
                  {indicator.direction === 'up' ? 'Maior é melhor' : 'Menor é melhor'}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => onEdit(indicator)}
                className="p-2 hover:bg-neutral-1 rounded-lg transition-colors"
                title="Editar"
              >
                <Edit2 className="w-5 h-5 text-neutral-8" />
              </button>
              <button
                onClick={() => onDelete(indicator.id)}
                className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                title="Excluir"
              >
                <Trash2 className="w-5 h-5 text-suno-red" />
              </button>
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
              onClick={() => setActiveTab('details')}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === 'details'
                  ? 'text-suno-red border-b-2 border-suno-red'
                  : 'text-neutral-8 hover:text-neutral-10'
              }`}
            >
              Detalhes
            </button>
            <button
              onClick={() => setActiveTab('books')}
              className={`px-4 py-2 text-sm font-medium transition-colors flex items-center gap-1.5 ${
                activeTab === 'books'
                  ? 'text-suno-red border-b-2 border-suno-red'
                  : 'text-neutral-8 hover:text-neutral-10'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              Books ({indicator.total_books || 0})
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-4 py-2 text-sm font-medium transition-colors flex items-center gap-1.5 ${
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
          {activeTab === 'details' && (
            <div className="space-y-6">
              {/* Descrição */}
              <div>
                <label className="block text-sm font-medium text-neutral-8 mb-2">
                  Descrição
                </label>
                <p className="text-sm text-neutral-10">
                  {indicator.description}
                </p>
              </div>

              {/* Notas */}
              {indicator.notes && (
                <div>
                  <label className="block text-sm font-medium text-neutral-8 mb-2">
                    Notas
                  </label>
                  <p className="text-sm text-neutral-10 bg-neutral-1 p-3 rounded-lg">
                    {indicator.notes}
                  </p>
                </div>
              )}

              {/* Agregação */}
              {indicator.aggregation_type !== 'none' && (
                <div>
                  <label className="block text-sm font-medium text-neutral-8 mb-2">
                    Tipo de Agregação
                  </label>
                  <p className="text-sm text-neutral-10">
                    {aggregationLabels[indicator.aggregation_type]}
                  </p>
                  {indicator.aggregated_indicators && indicator.aggregated_indicators.length > 0 && (
                    <p className="text-xs text-neutral-5 mt-1">
                      Agrega {indicator.aggregated_indicators.length} indicadores
                    </p>
                  )}
                </div>
              )}

              {/* Tags */}
              {indicator.tags.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-neutral-8 mb-2">
                    Tags
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {indicator.tags.map((tag) => (
                      <span
                        key={tag.id}
                        className="px-3 py-1.5 bg-neutral-1 text-neutral-10 text-sm font-medium rounded-lg"
                        style={{ borderLeft: `3px solid ${tag.color}` }}
                      >
                        {tag.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Meta Info */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-neutral-2">
                <div>
                  <label className="block text-xs text-neutral-5 mb-1">
                    Criado por
                  </label>
                  <p className="text-sm font-medium text-neutral-10">
                    {indicator.created_by_name}
                  </p>
                </div>
                <div>
                  <label className="block text-xs text-neutral-5 mb-1">
                    Criado em
                  </label>
                  <p className="text-sm font-medium text-neutral-10">
                    {new Date(indicator.created_at).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'books' && (
            <div className="space-y-3">
              {indicator.books && indicator.books.length > 0 ? (
                indicator.books.map((book) => (
                  <div
                    key={book.book_id}
                    className="bg-white border border-neutral-2 rounded-lg p-4 hover:border-neutral-5 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm text-neutral-10 mb-1">
                          {book.owner_name}
                        </h4>
                        <p className="text-xs text-neutral-8">
                          {book.book_name}
                        </p>
                        <span className={`inline-block mt-2 px-2 py-0.5 text-xs font-medium rounded ${
                          book.is_manager
                            ? 'bg-neutral-1 text-neutral-10'
                            : 'bg-neutral-1 text-neutral-5'
                        }`}>
                          {book.is_manager ? 'Gestor' : 'Visualizador'}
                        </span>
                      </div>
                      <span className={`text-sm font-bold ${
                        book.achievement_rate >= 100 ? 'text-neutral-10' : 'text-suno-red'
                      }`}>
                        {book.achievement_rate}%
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <BookOpen className="w-12 h-12 text-neutral-3 mx-auto mb-3" />
                  <p className="text-sm text-neutral-8">
                    Este indicador ainda não está em nenhum book
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-3">
              {mockHistory.map((log) => (
                <div
                  key={log.id}
                  className="bg-neutral-1 rounded-lg p-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                      <History className="w-4 h-4 text-neutral-8" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-neutral-10 mb-1">
                        <strong>{log.user_name}</strong>{' '}
                        {log.action === 'created' && 'criou o indicador'}
                        {log.action === 'updated' && log.field_changed && (
                          <>
                            alterou <strong>{log.field_changed}</strong> de{' '}
                            <code className="px-1.5 py-0.5 bg-white rounded text-xs">
                              {log.old_value}
                            </code>{' '}
                            para{' '}
                            <code className="px-1.5 py-0.5 bg-white rounded text-xs">
                              {log.new_value}
                            </code>
                          </>
                        )}
                      </p>
                      <p className="text-xs text-neutral-5">
                        {new Date(log.created_at).toLocaleString('pt-BR')}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

