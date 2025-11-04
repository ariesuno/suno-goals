import { BackofficeIndicator, IndicatorStatus, IndicatorFormat, IndicatorAggregationType } from '@/types/backoffice';
import { X, Edit2, Trash2, TrendingUp, TrendingDown, BookOpen, Clock, AlertCircle, CheckCircle, History, Save } from 'lucide-react';
import { useState } from 'react';

type IndicatorDrawerProps = {
  indicator: BackofficeIndicator;
  onClose: () => void;
  onEdit: (indicator: BackofficeIndicator) => void;
  onDelete: (id: string) => void;
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
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<BackofficeIndicator>(indicator);
  
  const StatusIcon = statusConfig[editData.status].icon;
  const DirectionIcon = editData.direction === 'up' ? TrendingUp : TrendingDown;

  const handleSave = () => {
    onEdit(editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData(indicator);
    setIsEditing(false);
  };

  const toggleTag = (tagId: string) => {
    const tag = availableTags.find(t => t.id === tagId);
    if (!tag) return;

    const hasTag = editData.tags.some(t => t.id === tagId);
    const newTags = hasTag
      ? editData.tags.filter(t => t.id !== tagId)
      : [...editData.tags, tag];
    
    setEditData({ ...editData, tags: newTags });
  };

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
              {isEditing ? (
                <input
                  type="text"
                  value={editData.name}
                  onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                  className="font-display font-bold text-xl md:text-2xl text-neutral-10 mb-2 w-full px-2 py-1 border border-neutral-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-suno-red"
                />
              ) : (
                <h2 className="font-display font-bold text-xl md:text-2xl text-neutral-10 mb-2">
                  {editData.name}
                </h2>
              )}
              <div className="flex flex-wrap items-center gap-2">
                {/* Status */}
                <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${statusConfig[editData.status].bg} ${statusConfig[editData.status].color}`}>
                  <StatusIcon className="w-3.5 h-3.5" />
                  {statusConfig[editData.status].label}
                </span>

                {/* Formato */}
                <span className="px-2.5 py-1 bg-neutral-1 text-neutral-8 text-xs font-medium rounded-lg">
                  {formatLabels[editData.format]}
                </span>

                {/* Direção */}
                <span className="flex items-center gap-1 px-2.5 py-1 bg-neutral-1 text-neutral-8 text-xs font-medium rounded-lg">
                  <DirectionIcon className="w-3.5 h-3.5" />
                  {editData.direction === 'up' ? 'Maior é melhor' : 'Menor é melhor'}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-1.5 px-3 py-2 bg-suno-red text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    Salvar
                  </button>
                  <button
                    onClick={handleCancel}
                    className="px-3 py-2 text-sm font-medium text-neutral-10 hover:bg-neutral-1 rounded-lg transition-colors"
                  >
                    Cancelar
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
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
                {isEditing ? (
                  <textarea
                    value={editData.description}
                    onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                    className="w-full text-sm text-neutral-10 px-3 py-2 border border-neutral-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-suno-red resize-none"
                    rows={3}
                  />
                ) : (
                  <p className="text-sm text-neutral-10">
                    {editData.description}
                  </p>
                )}
              </div>

              {/* Notas */}
              <div>
                <label className="block text-sm font-medium text-neutral-8 mb-2">
                  Notas {!isEditing && !editData.notes && <span className="text-neutral-5">(opcional)</span>}
                </label>
                {isEditing ? (
                  <textarea
                    value={editData.notes || ''}
                    onChange={(e) => setEditData({ ...editData, notes: e.target.value })}
                    placeholder="Adicione notas internas sobre este indicador..."
                    className="w-full text-sm text-neutral-10 px-3 py-2 border border-neutral-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-suno-red resize-none"
                    rows={3}
                  />
                ) : editData.notes ? (
                  <p className="text-sm text-neutral-10 bg-neutral-1 p-3 rounded-lg">
                    {editData.notes}
                  </p>
                ) : null}
              </div>

              {/* Formato */}
              <div>
                <label className="block text-sm font-medium text-neutral-8 mb-2">
                  Formato
                </label>
                {isEditing ? (
                  <select
                    value={editData.format}
                    onChange={(e) => setEditData({ ...editData, format: e.target.value as IndicatorFormat })}
                    className="w-full text-sm text-neutral-10 px-3 py-2 border border-neutral-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-suno-red"
                  >
                    <option value="percentage">Percentual (%)</option>
                    <option value="number">Número (#)</option>
                    <option value="currency">Financeiro (R$)</option>
                    <option value="boolean">Booleano (Sim/Não)</option>
                    <option value="time">Tempo (Horas)</option>
                  </select>
                ) : (
                  <p className="text-sm text-neutral-10">
                    {formatLabels[editData.format]}
                  </p>
                )}
              </div>

              {/* Direção */}
              <div>
                <label className="block text-sm font-medium text-neutral-8 mb-2">
                  Direção
                </label>
                {isEditing ? (
                  <div className="flex gap-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="direction"
                        value="up"
                        checked={editData.direction === 'up'}
                        onChange={(e) => setEditData({ ...editData, direction: e.target.value as 'up' | 'down' })}
                        className="text-suno-red focus:ring-suno-red"
                      />
                      <TrendingUp className="w-4 h-4 text-neutral-8" />
                      <span className="text-sm text-neutral-10">Maior é melhor</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="direction"
                        value="down"
                        checked={editData.direction === 'down'}
                        onChange={(e) => setEditData({ ...editData, direction: e.target.value as 'up' | 'down' })}
                        className="text-suno-red focus:ring-suno-red"
                      />
                      <TrendingDown className="w-4 h-4 text-neutral-8" />
                      <span className="text-sm text-neutral-10">Menor é melhor</span>
                    </label>
                  </div>
                ) : (
                  <p className="flex items-center gap-2 text-sm text-neutral-10">
                    <DirectionIcon className="w-4 h-4" />
                    {editData.direction === 'up' ? 'Maior é melhor' : 'Menor é melhor'}
                  </p>
                )}
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-neutral-8 mb-2">
                  Status
                </label>
                {isEditing ? (
                  <select
                    value={editData.status}
                    onChange={(e) => setEditData({ ...editData, status: e.target.value as IndicatorStatus })}
                    className="w-full text-sm text-neutral-10 px-3 py-2 border border-neutral-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-suno-red"
                  >
                    <option value="validated">Validado</option>
                    <option value="in_construction">Em Construção</option>
                    <option value="in_review">Em Revisão</option>
                  </select>
                ) : (
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${statusConfig[editData.status].bg} ${statusConfig[editData.status].color}`}>
                    <StatusIcon className="w-3.5 h-3.5" />
                    {statusConfig[editData.status].label}
                  </span>
                )}
              </div>

              {/* Agregação */}
              <div>
                <label className="block text-sm font-medium text-neutral-8 mb-2">
                  Tipo de Agregação
                </label>
                {isEditing ? (
                  <select
                    value={editData.aggregation_type}
                    onChange={(e) => setEditData({ ...editData, aggregation_type: e.target.value as IndicatorAggregationType })}
                    className="w-full text-sm text-neutral-10 px-3 py-2 border border-neutral-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-suno-red"
                  >
                    <option value="none">Nenhuma</option>
                    <option value="average">Média</option>
                    <option value="sum">Soma</option>
                    <option value="count">Contagem</option>
                  </select>
                ) : editData.aggregation_type !== 'none' ? (
                  <div>
                    <p className="text-sm text-neutral-10">
                      {aggregationLabels[editData.aggregation_type]}
                    </p>
                    {editData.aggregated_indicators && editData.aggregated_indicators.length > 0 && (
                      <p className="text-xs text-neutral-5 mt-1">
                        Agrega {editData.aggregated_indicators.length} indicadores
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-neutral-8">Nenhuma</p>
                )}
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-neutral-8 mb-2">
                  Tags
                </label>
                {isEditing ? (
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      {availableTags.map((tag) => {
                        const isSelected = editData.tags.some(t => t.id === tag.id);
                        return (
                          <button
                            key={tag.id}
                            type="button"
                            onClick={() => toggleTag(tag.id)}
                            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                              isSelected
                                ? 'bg-neutral-10 text-white'
                                : 'bg-neutral-1 text-neutral-10 hover:bg-neutral-2'
                            }`}
                            style={isSelected ? { borderLeft: `3px solid ${tag.color}` } : {}}
                          >
                            {tag.name}
                          </button>
                        );
                      })}
                    </div>
                    {editData.tags.length === 0 && (
                      <p className="text-xs text-neutral-5">Selecione pelo menos uma tag</p>
                    )}
                  </div>
                ) : editData.tags.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {editData.tags.map((tag) => (
                      <span
                        key={tag.id}
                        className="px-3 py-1.5 bg-neutral-1 text-neutral-10 text-sm font-medium rounded-lg"
                        style={{ borderLeft: `3px solid ${tag.color}` }}
                      >
                        {tag.name}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-neutral-8">Nenhuma tag</p>
                )}
              </div>

              {/* Meta Info */}
              {!isEditing && (
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
              )}
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

