import { MonthlyGoals, IndicatorFormat } from '@/types/backoffice';
import { X } from 'lucide-react';
import BookGoalsEditor from './BookGoalsEditor';
import { useState } from 'react';

type EditGoalsModalProps = {
  indicatorName: string;
  indicatorFormat: IndicatorFormat;
  currentGoals: MonthlyGoals;
  onSave: (goals: MonthlyGoals) => void;
  onClose: () => void;
};

export default function EditGoalsModal({
  indicatorName,
  indicatorFormat,
  currentGoals,
  onSave,
  onClose,
}: EditGoalsModalProps) {
  const [goals, setGoals] = useState<MonthlyGoals>(currentGoals);

  const handleSave = () => {
    onSave(goals);
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-neutral-2">
            <div>
              <h2 className="font-display font-bold text-xl text-neutral-10">
                Editar Metas
              </h2>
              <p className="text-sm text-neutral-5 mt-1">
                {indicatorName}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-neutral-1 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-neutral-8" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <BookGoalsEditor
              indicatorName={indicatorName}
              indicatorFormat={indicatorFormat}
              goals={goals}
              onChange={setGoals}
            />
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-neutral-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-neutral-10 hover:bg-neutral-1 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-suno-red text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
            >
              Salvar Metas
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

