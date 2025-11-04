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

type MonthCellProps = CellProps & {
  hasRightBorder?: boolean;
};

const MonthCell = ({ data, unit, direction, showIcon = false, hasRightBorder = false }: MonthCellProps) => {
  const statusColor = getStatusColor(data.percentage, direction);
  const hasData = data.real !== 0 || data.percentage !== 0;
  const borderRightClass = hasRightBorder ? 'border-r border-neutral-2' : '';
  
  return (
    <div className={`flex flex-col h-full ${borderRightClass}`}>
      {/* Linha 1: Meta */}
      <div className="px-1 py-1 md:px-1.5 md:py-1 lg:px-2 lg:py-1.5 text-center text-[10px] md:text-xs lg:text-sm text-neutral-5 border-b border-neutral-2 min-h-[22px] md:min-h-[24px] lg:min-h-[26px] flex items-center justify-center bg-white">
        {formatValue(data.meta, unit)}
      </div>
      
      {/* Linha 2: Real */}
      <div className={`px-1 py-1 md:px-1.5 md:py-1 lg:px-2 lg:py-1.5 text-center text-[11px] md:text-sm lg:text-base font-semibold border-b border-neutral-2 min-h-[24px] md:min-h-[26px] lg:min-h-[30px] flex items-center justify-center bg-white ${
        hasData ? 'text-neutral-10' : 'text-neutral-3'
      }`}>
        {formatValue(data.real, unit)}
      </div>
      
      {/* Linha 3: Percentual - SEM borda bottom para evitar faixa */}
      <div className={`px-1 py-1 md:px-1.5 md:py-1 lg:px-2 lg:py-1.5 text-center text-[11px] md:text-sm lg:text-base font-bold min-h-[24px] md:min-h-[26px] lg:min-h-[30px] flex items-center justify-center gap-0.5 ${
        hasData 
          ? `${statusColor} text-white` 
          : 'bg-neutral-1 text-neutral-5'
      }`}>
        {showIcon && data.percentage > 0 && (
          direction === 'up' ? 
            <ArrowUp className="w-2.5 h-2.5 md:w-3 md:h-3 lg:w-3.5 lg:h-3.5" /> : 
            <ArrowDown className="w-2.5 h-2.5 md:w-3 md:h-3 lg:w-3.5 lg:h-3.5" />
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
    <div className="flex gap-1.5 sm:gap-2 md:gap-3 lg:gap-4">
      {/* Bloco 1: Nome do Indicador */}
      <div className="w-[160px] md:w-[180px] lg:w-[200px] xl:w-[220px] flex-shrink-0">
        <div className="border border-neutral-2 bg-white shadow-sm h-full">
          <div className="flex items-center justify-center px-2 md:px-3 lg:px-4 font-display font-bold text-[11px] md:text-xs lg:text-sm xl:text-base h-full min-h-[70px] md:min-h-[76px] lg:min-h-[82px]">
            {indicator.name}
          </div>
        </div>
      </div>

      {/* Bloco 2: ACC */}
      <div className="w-[65px] md:w-[75px] lg:w-[85px] xl:w-[95px] flex-shrink-0">
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
              <MonthCell
                key={month.key}
                data={indicator.months[month.key as keyof typeof indicator.months]}
                unit={indicator.unit}
                direction={indicator.direction}
                showIcon={index === 0}
                hasRightBorder={index < months.length - 1}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

