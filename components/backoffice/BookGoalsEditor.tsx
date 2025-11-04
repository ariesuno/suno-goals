import { MonthlyGoals, IndicatorFormat } from '@/types/backoffice';
import { useState } from 'react';
import { Copy } from 'lucide-react';

type BookGoalsEditorProps = {
  indicatorName: string;
  indicatorFormat: IndicatorFormat;
  goals: MonthlyGoals;
  onChange: (goals: MonthlyGoals) => void;
};

const formatLabels = {
  percentage: '%',
  number: '#',
  currency: 'R$',
  boolean: '✓',
  hours: 'H',
};

const monthKeys: (keyof MonthlyGoals)[] = [
  'jan', 'feb', 'mar', 'apr', 'may', 'jun',
  'jul', 'aug', 'sep', 'oct', 'nov', 'dec',
];

const monthLabels = {
  jan: 'Jan', feb: 'Fev', mar: 'Mar',
  apr: 'Abr', may: 'Mai', jun: 'Jun',
  jul: 'Jul', aug: 'Ago', sep: 'Set',
  oct: 'Out', nov: 'Nov', dec: 'Dez',
};

const quarters = [
  { label: 'Q1 2025', months: ['jan', 'feb', 'mar'] as (keyof MonthlyGoals)[] },
  { label: 'Q2 2025', months: ['apr', 'may', 'jun'] as (keyof MonthlyGoals)[] },
  { label: 'Q3 2025', months: ['jul', 'aug', 'sep'] as (keyof MonthlyGoals)[] },
  { label: 'Q4 2025', months: ['oct', 'nov', 'dec'] as (keyof MonthlyGoals)[] },
];

export default function BookGoalsEditor({ indicatorName, indicatorFormat, goals, onChange }: BookGoalsEditorProps) {
  const [copyValue, setCopyValue] = useState('');

  const handleGoalChange = (month: keyof MonthlyGoals, value: string) => {
    const numValue = value === '' ? undefined : parseFloat(value);
    onChange({ ...goals, [month]: numValue });
  };

  const handleCopyToAll = () => {
    if (!copyValue) return;
    const numValue = parseFloat(copyValue);
    if (isNaN(numValue)) return;

    const newGoals: MonthlyGoals = {};
    monthKeys.forEach(month => {
      newGoals[month] = numValue;
    });
    onChange(newGoals);
    setCopyValue('');
  };

  const missingGoalsCount = monthKeys.filter(month => goals[month] === undefined || goals[month] === null).length;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-display font-semibold text-lg text-neutral-10">
            {indicatorName}
          </h3>
          <p className="text-sm text-neutral-5">
            Formato: {formatLabels[indicatorFormat]}
          </p>
        </div>
        {missingGoalsCount > 0 && (
          <span className="text-xs font-medium text-suno-red">
            ⚠️ {missingGoalsCount} meses sem meta
          </span>
        )}
      </div>

      {/* Copy to All */}
      <div className="bg-neutral-1 rounded-lg p-4">
        <label className="block text-sm font-medium text-neutral-10 mb-2">
          Copiar meta para todos os meses:
        </label>
        <div className="flex gap-2">
          <input
            type="number"
            value={copyValue}
            onChange={(e) => setCopyValue(e.target.value)}
            placeholder="Digite o valor"
            className="flex-1 px-3 py-2 border border-neutral-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-suno-red focus:border-suno-red text-sm"
          />
          <button
            onClick={handleCopyToAll}
            disabled={!copyValue}
            className="flex items-center gap-2 px-4 py-2 bg-neutral-10 text-white text-sm font-medium rounded-lg hover:bg-neutral-8 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Copy className="w-4 h-4" />
            Aplicar
          </button>
        </div>
      </div>

      {/* Quarters */}
      <div className="space-y-4">
        {quarters.map((quarter) => (
          <div key={quarter.label}>
            <h4 className="text-sm font-semibold text-neutral-8 mb-2">
              {quarter.label}
            </h4>
            <div className="grid grid-cols-3 gap-3">
              {quarter.months.map((month) => (
                <div key={month}>
                  <label className="block text-xs font-medium text-neutral-5 mb-1">
                    {monthLabels[month]}
                  </label>
                  <input
                    type="number"
                    value={goals[month] ?? ''}
                    onChange={(e) => handleGoalChange(month, e.target.value)}
                    placeholder="—"
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-suno-red text-sm ${
                      goals[month] === undefined || goals[month] === null
                        ? 'border-suno-red bg-red-50'
                        : 'border-neutral-3'
                    }`}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="bg-neutral-1 rounded-lg p-3 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-neutral-8">Metas definidas:</span>
          <span className={`font-semibold ${
            missingGoalsCount === 0 ? 'text-neutral-10' : 'text-suno-red'
          }`}>
            {12 - missingGoalsCount}/12 meses
          </span>
        </div>
      </div>
    </div>
  );
}

