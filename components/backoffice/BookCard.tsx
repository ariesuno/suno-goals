import { BackofficeBook } from '@/types/backoffice';
import { User, Users, AlertCircle, CheckCircle } from 'lucide-react';

type BookCardProps = {
  book: BackofficeBook;
  onClick: () => void;
};

const performanceLevelConfig = {
  excellent: {
    label: 'Ótimo',
    color: 'text-neutral-10',
    bgBar: 'bg-neutral-10',
  },
  good: {
    label: 'Bom',
    color: 'text-neutral-10',
    bgBar: 'bg-neutral-8',
  },
  regular: {
    label: 'Regular',
    color: 'text-neutral-8',
    bgBar: 'bg-neutral-5',
  },
  critical: {
    label: 'Crítico',
    color: 'text-suno-red',
    bgBar: 'bg-suno-red',
  },
};

export default function BookCard({ book, onClick }: BookCardProps) {
  const performanceConfig = book.performance_level 
    ? performanceLevelConfig[book.performance_level]
    : null;

  const hasAlerts = book.indicators_with_missing_goals > 0 || book.performance_level === 'critical';

  return (
    <button
      onClick={onClick}
      className={`w-full bg-white rounded-xl p-5 text-left transition-all hover:shadow-lg ${
        hasAlerts 
          ? 'shadow-md border-2 border-suno-red' 
          : 'shadow-sm border border-neutral-2 hover:border-neutral-3'
      }`}
    >
      {/* Header */}
      <div className="mb-4">
        <h3 className="font-display font-semibold text-lg text-neutral-10 mb-2 line-clamp-1">
          {book.name}
        </h3>
        
        {/* Owner */}
        <div className="flex items-center gap-2 text-sm text-neutral-8">
          {book.owner.type === 'person' ? (
            <User className="w-4 h-4 flex-shrink-0" />
          ) : (
            <Users className="w-4 h-4 flex-shrink-0" />
          )}
          <span className="font-medium truncate">{book.owner.name}</span>
        </div>
        {book.owner.role && (
          <p className="text-xs text-neutral-5 mt-0.5 ml-6 truncate">
            {book.owner.role}
          </p>
        )}
        {book.owner.team_members_count && (
          <p className="text-xs text-neutral-5 mt-0.5 ml-6">
            {book.owner.team_members_count} membros
          </p>
        )}
      </div>

      {/* Indicators Info */}
      <div className="mb-4 pb-4 border-b border-neutral-2">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-medium text-neutral-8">
            {book.total_indicators} {book.total_indicators === 1 ? 'indicador' : 'indicadores'}
          </span>
          {book.indicators_with_missing_goals > 0 ? (
            <div className="flex items-center gap-1.5 px-2 py-1 bg-red-50 rounded text-xs font-medium text-suno-red">
              <AlertCircle className="w-3.5 h-3.5" />
              {book.indicators_with_missing_goals} sem meta
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-2 py-1 bg-neutral-1 rounded text-xs font-medium text-neutral-8">
              <CheckCircle className="w-3.5 h-3.5" />
              Metas ok
            </div>
          )}
        </div>
        {book.indicators_with_missing_goals > 0 && (
          <p className="text-xs text-neutral-5 mt-1">
            Alguns indicadores precisam de metas definidas
          </p>
        )}
      </div>

      {/* Performance */}
      {book.overall_performance !== undefined && performanceConfig && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-neutral-5 uppercase tracking-wide">
              Performance Acumulada
            </span>
            <span className={`text-lg font-bold ${performanceConfig.color}`}>
              {book.overall_performance.toFixed(0)}%
            </span>
          </div>
          <div className="w-full h-2.5 bg-neutral-2 rounded-full overflow-hidden">
            <div
              className={`h-full ${performanceConfig.bgBar} transition-all`}
              style={{ width: `${Math.min(book.overall_performance, 100)}%` }}
            />
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className={`text-xs font-semibold ${performanceConfig.color}`}>
              {performanceConfig.label}
            </span>
            {book.indicators_achieving !== undefined && (
              <span className="text-xs text-neutral-5">
                {book.indicators_achieving} de {book.total_indicators} batendo meta
              </span>
            )}
          </div>
        </div>
      )}

      {/* Footer: Quarters */}
      <div className="pt-3 border-t border-neutral-1">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-neutral-5 uppercase tracking-wide">
            Quarters Ativos
          </span>
          {!book.is_active && (
            <span className="px-2 py-0.5 bg-red-50 text-suno-red text-xs font-semibold rounded">
              Inativo
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          {[1, 2, 3, 4].map((q) => (
            <div
              key={q}
              className={`flex-1 h-1.5 rounded-full transition-all ${
                book.active_quarters.includes(q) ? 'bg-neutral-10' : 'bg-neutral-2'
              }`}
              title={`Quarter ${q}${book.active_quarters.includes(q) ? ' (ativo)' : ''}`}
            />
          ))}
        </div>
      </div>
    </button>
  );
}

