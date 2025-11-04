import { IndicatorType, MonthData } from '@/types/indicator';
import { ArrowUp, ArrowDown } from 'lucide-react';

type IndicatorRowProps = {
  indicator: IndicatorType;
};

const getStatusColor = (percentage: number, direction: 'up' | 'down'): string => {
  if (percentage === 0) return 'bg-white';
  
  if (direction === 'up') {
    // Maior é melhor: >= 100% = verde, < 100% = vermelho
    if (percentage >= 100) return 'bg-status-green';
    return 'bg-status-red';
  } else {
    // Menor é melhor: <= 100% = verde, > 100% = vermelho
    if (percentage <= 100) return 'bg-status-green';
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
    <div className="flex gap-4">
      {/* Bloco 1: Nome do Indicador */}
      <div className="w-[250px]">
        <div className="border border-neutral-2 bg-white shadow-sm h-full">
          <div className="flex items-center justify-center px-4 font-display font-bold text-sm h-full min-h-[96px]">
            {indicator.name}
          </div>
        </div>
      </div>

      {/* Bloco 2: ACC */}
      <div className="w-[100px]">
        <div className="border border-neutral-2 bg-white shadow-sm">
          <MonthCell 
            data={indicator.accumulated} 
            unit={indicator.unit} 
            direction={indicator.direction}
          />
        </div>
      </div>

      {/* Bloco 3: 12 Meses */}
      <div className="flex-1">
        <div className="border border-neutral-2 bg-white shadow-sm">
          <div className="grid grid-cols-12">
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
      </div>
    </div>
  );
}

