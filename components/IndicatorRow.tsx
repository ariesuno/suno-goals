import { IndicatorType, MonthData } from '@/types/indicator';
import { ArrowUp, ArrowDown } from 'lucide-react';

type IndicatorRowProps = {
  indicator: IndicatorType;
};

const getStatusColor = (percentage: number, direction: 'up' | 'down'): string => {
  if (percentage === 0) return 'bg-white';
  
  if (direction === 'up') {
    if (percentage >= 100) return 'bg-status-green';
    if (percentage >= 80) return 'bg-status-yellow';
    return 'bg-status-red';
  } else {
    // Para indicadores "down" (menor é melhor)
    if (percentage <= 100) return 'bg-status-green';
    if (percentage <= 110) return 'bg-status-yellow';
    return 'bg-status-red';
  }
};

const formatValue = (value: number, unit: string): string => {
  if (value === 0) return '';
  
  if (unit === 'R$' || unit === 'H$') {
    return value.toLocaleString('pt-BR');
  }
  return value.toString();
};

const formatPercentage = (percentage: number): string => {
  if (percentage === 0) return '';
  return `${percentage}%`;
};

type CellProps = {
  data: MonthData;
  unit: string;
  direction: 'up' | 'down';
  showIcon?: boolean;
};

const MonthCell = ({ data, unit, direction, showIcon = false }: CellProps) => {
  const statusColor = getStatusColor(data.percentage, direction);
  
  return (
    <div className="flex flex-col">
      <div className="px-2 py-1.5 text-center text-xs text-neutral-5">
        {formatValue(data.meta, unit)}
      </div>
      <div className="px-2 py-1.5 text-center text-sm font-semibold">
        {formatValue(data.real, unit)}
      </div>
      <div className={`px-2 py-1.5 text-center text-sm font-bold text-white ${statusColor} flex items-center justify-center gap-1`}>
        {showIcon && data.percentage > 0 && (
          direction === 'up' ? 
            <ArrowUp className="w-3 h-3" /> : 
            <ArrowDown className="w-3 h-3" />
        )}
        {formatPercentage(data.percentage)}
      </div>
    </div>
  );
};

export default function IndicatorRow({ indicator }: IndicatorRowProps) {
  const months = [
    { key: 'jan', label: 'J' },
    { key: 'feb', label: 'F' },
    { key: 'mar', label: 'M' },
    { key: 'apr', label: 'A' },
    { key: 'may', label: 'M' },
    { key: 'jun', label: 'J' },
    { key: 'jul', label: 'J' },
    { key: 'aug', label: 'A' },
    { key: 'sep', label: 'S' },
    { key: 'oct', label: 'O' },
    { key: 'nov', label: 'N' },
    { key: 'dec', label: 'D' },
  ];

  return (
    <div className="border border-neutral-2 bg-white shadow-sm">
      <div className="grid grid-cols-[250px_8px_100px_8px_repeat(12,1fr)]">
        {/* Coluna Indicador */}
        <div className="flex items-center px-4 py-4 font-display font-bold text-sm">
          {indicator.name}
        </div>

        {/* Espaçador esquerdo */}
        <div className="bg-neutral-2"></div>

        {/* Coluna Acc */}
        <div>
          <MonthCell 
            data={indicator.accumulated} 
            unit={indicator.unit} 
            direction={indicator.direction}
          />
        </div>

        {/* Espaçador direito */}
        <div className="bg-neutral-2"></div>

        {/* Colunas dos Meses */}
        {months.map((month, index) => (
          <div 
            key={month.key}
            className={index < months.length - 1 ? 'border-r border-neutral-2' : ''}
          >
            <MonthCell
              data={indicator.months[month.key as keyof typeof indicator.months]}
              unit={indicator.unit}
              direction={indicator.direction}
              showIcon={index === 0}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

