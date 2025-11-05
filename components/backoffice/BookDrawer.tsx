import { BackofficeBook, MonthlyGoals } from '@/types/backoffice';
import { X, Edit2, Trash2, User, Users, Calendar, TrendingUp, AlertCircle, CheckCircle, History, Plus, Eye } from 'lucide-react';
import { useState } from 'react';
import EditGoalsModal from './EditGoalsModal';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import { useRouter } from 'next/navigation';

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
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'info' | 'indicators' | 'history' | 'performance'>('info');
  const [isEditing, setIsEditing] = useState(false);
  const [editingGoalsIndex, setEditingGoalsIndex] = useState<number | null>(null);
  const [bookData, setBookData] = useState(book);
  const [showDeleteBookModal, setShowDeleteBookModal] = useState(false);
  const [indicatorToDelete, setIndicatorToDelete] = useState<{ id: string; name: string } | null>(null);

  const handleViewAsUser = () => {
    // Abre a visualização do usuário em uma nova aba
    // TODO: Implementar rota específica com ID do book
    const url = `/?preview=true&bookId=${bookData.id}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleConfirmDeleteBook = () => {
    onDelete(book.id);
    onClose();
  };

  const performanceConfig = bookData.performance_level 
    ? performanceLevelConfig[bookData.performance_level]
    : null;

  const handleSaveGoals = (indicatorIndex: number, goals: MonthlyGoals) => {
    const updatedIndicators = [...bookData.indicators];
    updatedIndicators[indicatorIndex].goals = goals;
    
    // Recalcular missing goals
    const monthKeys: (keyof MonthlyGoals)[] = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
    const missingCount = monthKeys.filter(month => goals[month] === undefined || goals[month] === null).length;
    updatedIndicators[indicatorIndex].has_missing_goals = missingCount > 0;
    updatedIndicators[indicatorIndex].missing_goals_count = missingCount;

    const newBookData = {
      ...bookData,
      indicators: updatedIndicators,
      indicators_with_missing_goals: updatedIndicators.filter(i => i.has_missing_goals).length,
    };

    setBookData(newBookData);
    onEdit(newBookData);
  };

  const handleRemoveIndicator = (indicatorId: string, indicatorName: string) => {
    if (bookData.total_indicators <= 1) {
      alert('O book precisa ter pelo menos 1 indicador');
      return;
    }

    setIndicatorToDelete({ id: indicatorId, name: indicatorName });
  };

  const handleConfirmDeleteIndicator = () => {
    if (!indicatorToDelete) return;

    const updatedIndicators = bookData.indicators.filter(i => i.indicator_id !== indicatorToDelete.id);
    const newBookData = {
      ...bookData,
      indicators: updatedIndicators,
      total_indicators: updatedIndicators.length,
      indicators_with_missing_goals: updatedIndicators.filter(i => i.has_missing_goals).length,
    };
    setBookData(newBookData);
    onEdit(newBookData);
    setIndicatorToDelete(null);
  };

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
                {bookData.name}
              </h2>
              <div className="flex items-center gap-2 text-sm text-neutral-8">
                {bookData.owner.type === 'person' ? (
                  <User className="w-4 h-4" />
                ) : (
                  <Users className="w-4 h-4" />
                )}
                <span className="font-medium">{bookData.owner.name}</span>
                {bookData.owner.role && (
                  <span className="text-neutral-5">• {bookData.owner.role}</span>
                )}
                {bookData.owner.team_members_count && (
                  <span className="text-neutral-5">• {bookData.owner.team_members_count} membros</span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {!isEditing && (
                <>
                  <button
                    onClick={handleViewAsUser}
                    className="flex items-center gap-2 px-3 py-2 bg-neutral-1 hover:bg-neutral-2 text-neutral-10 font-medium text-sm rounded-lg transition-colors"
                    title="Ver como o usuário vê"
                  >
                    <Eye className="w-4 h-4" />
                    <span className="hidden sm:inline">Ver como Usuário</span>
                  </button>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="p-2 hover:bg-neutral-1 rounded-lg transition-colors"
                    title="Editar"
                  >
                    <Edit2 className="w-5 h-5 text-neutral-8" />
                  </button>
                  <button
                    onClick={() => setShowDeleteBookModal(true)}
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
              Indicadores ({bookData.total_indicators})
              {bookData.indicators_with_missing_goals > 0 && (
                <span className="px-1.5 py-0.5 bg-suno-red text-white text-xs font-bold rounded-full">
                  {bookData.indicators_with_missing_goals}
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
                  <span className="text-neutral-10">{bookData.year}</span>
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-neutral-8 mb-2">
                  Status
                </label>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium ${
                  bookData.is_active
                    ? 'bg-neutral-1 text-neutral-10'
                    : 'bg-neutral-1 text-neutral-5'
                }`}>
                  {bookData.is_active ? (
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
                        bookData.active_quarters.includes(q)
                          ? 'bg-neutral-10 text-white'
                          : 'bg-neutral-1 text-neutral-5'
                      }`}
                    >
                      Q{q}
                    </div>
                  ))}
                </div>
                <p className="text-xs text-neutral-5 mt-2">
                  {bookData.active_quarters.length === 4
                    ? 'Ativo o ano todo'
                    : `Ativo em ${bookData.active_quarters.length} quarter${bookData.active_quarters.length > 1 ? 's' : ''}`}
                </p>
              </div>

              {/* Descrição */}
              {bookData.description && (
                <div>
                  <label className="block text-sm font-medium text-neutral-8 mb-2">
                    Descrição
                  </label>
                  <p className="text-sm text-neutral-10 bg-neutral-1 p-3 rounded-lg">
                    {bookData.description}
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
              {bookData.indicators.map((indicator, index) => (
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

                  {/* Metas Mês a Mês */}
                  <div className="mt-3 pt-3 border-t border-neutral-2">
                    <p className="text-xs font-medium text-neutral-8 mb-3 uppercase tracking-wide">
                      Metas {bookData.year}
                    </p>
                    
                    {/* Grid de Meses */}
                    <div className="grid grid-cols-6 gap-2 mb-3">
                      {Object.entries(monthLabels).map(([key, label]) => {
                        const value = indicator.goals[key as keyof MonthlyGoals];
                        const hasMeta = value !== undefined && value !== null;
                        return (
                          <div
                            key={key}
                            className={`px-2 py-1.5 rounded text-center transition-colors ${
                              hasMeta
                                ? 'bg-neutral-1 hover:bg-neutral-2'
                                : 'bg-red-50 border border-red-200'
                            }`}
                          >
                            <p className={`text-xs font-medium mb-0.5 ${
                              hasMeta ? 'text-neutral-5' : 'text-suno-red'
                            }`}>
                              {label}
                            </p>
                            <p className={`text-sm font-bold ${
                              hasMeta ? 'text-neutral-10' : 'text-suno-red'
                            }`}>
                              {hasMeta ? value : '—'}
                            </p>
                          </div>
                        );
                      })}
                    </div>

                    {/* Resumo por Quarter (secundário) */}
                    <div className="flex items-center gap-2 text-xs text-neutral-5">
                      <span className="font-medium">Por Quarter:</span>
                      {[
                        { q: 1, months: ['jan', 'feb', 'mar'] as (keyof MonthlyGoals)[] },
                        { q: 2, months: ['apr', 'may', 'jun'] as (keyof MonthlyGoals)[] },
                        { q: 3, months: ['jul', 'aug', 'sep'] as (keyof MonthlyGoals)[] },
                        { q: 4, months: ['oct', 'nov', 'dec'] as (keyof MonthlyGoals)[] },
                      ].map(({ q, months }) => {
                        const allFilled = months.every(m => indicator.goals[m] !== undefined && indicator.goals[m] !== null);
                        return (
                          <span
                            key={q}
                            className={`px-2 py-0.5 rounded font-medium ${
                              allFilled
                                ? 'bg-neutral-1 text-neutral-8'
                                : 'bg-red-50 text-suno-red'
                            }`}
                          >
                            Q{q} {allFilled ? '✓' : '✗'}
                          </span>
                        );
                      })}
                    </div>
                  </div>

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
                    <button 
                      onClick={() => setEditingGoalsIndex(index)}
                      className="flex-1 px-3 py-1.5 text-xs font-medium text-neutral-10 bg-neutral-1 rounded hover:bg-neutral-2 transition-colors"
                    >
                      Editar Metas
                    </button>
                    <button 
                      onClick={() => handleRemoveIndicator(indicator.indicator_id, indicator.indicator_name)}
                      className="px-3 py-1.5 text-xs font-medium text-suno-red hover:bg-red-50 rounded transition-colors"
                    >
                      Remover
                    </button>
                  </div>
                </div>
              ))}

              {/* Add More */}
              {bookData.total_indicators < 6 && (
                <button className="w-full py-3 border-2 border-dashed border-neutral-3 rounded-lg text-sm font-medium text-neutral-8 hover:border-neutral-5 hover:text-neutral-10 transition-colors flex items-center justify-center gap-2">
                  <Plus className="w-4 h-4" />
                  Adicionar Indicador ({bookData.total_indicators}/6)
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
                  {bookData.overall_performance}%
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
                  Indicadores Batendo Meta: {bookData.indicators_achieving}/{bookData.total_indicators} ({Math.round((bookData.indicators_achieving! / bookData.total_indicators) * 100)}%)
                </p>
                <div className="w-full h-2 bg-neutral-1 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-neutral-10 transition-all"
                    style={{ width: `${(bookData.indicators_achieving! / bookData.total_indicators) * 100}%` }}
                  />
                </div>
              </div>

              {/* Detalhamento */}
              <div>
                <p className="text-sm font-medium text-neutral-8 mb-3">Detalhamento:</p>
                <div className="space-y-2">
                  {bookData.indicators.map((indicator) => (
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
              {bookData.history && bookData.history.length > 0 ? (
                bookData.history.map((entry) => (
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

      {/* Modal de Edição de Metas */}
      {editingGoalsIndex !== null && bookData.indicators[editingGoalsIndex] && (
        <EditGoalsModal
          indicatorName={bookData.indicators[editingGoalsIndex].indicator_name}
          indicatorFormat={bookData.indicators[editingGoalsIndex].indicator_format}
          currentGoals={bookData.indicators[editingGoalsIndex].goals}
          onSave={(goals) => handleSaveGoals(editingGoalsIndex, goals)}
          onClose={() => setEditingGoalsIndex(null)}
        />
      )}

      {/* Modal de Confirmação - Excluir Book */}
      <DeleteConfirmationModal
        isOpen={showDeleteBookModal}
        onClose={() => setShowDeleteBookModal(false)}
        onConfirm={handleConfirmDeleteBook}
        title="Excluir Book"
        description="Esta ação é irreversível e todos os dados do book serão perdidos permanentemente."
        confirmText="EXCLUIR O BOOK"
        itemName={bookData.name}
        warningMessage="Todos os indicadores e metas deste book serão removidos"
      />

      {/* Modal de Confirmação - Remover Indicador */}
      <DeleteConfirmationModal
        isOpen={indicatorToDelete !== null}
        onClose={() => setIndicatorToDelete(null)}
        onConfirm={handleConfirmDeleteIndicator}
        title="Remover Indicador"
        description="O indicador será removido deste book. As metas definidas serão perdidas."
        confirmText="EXCLUIR O INDICADOR"
        itemName={indicatorToDelete?.name}
        warningMessage="Esta ação não pode ser desfeita"
      />
    </>
  );
}

