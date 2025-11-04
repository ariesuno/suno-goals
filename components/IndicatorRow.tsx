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
      <div className="px-1 py-1 sm:px-1.5 sm:py-1.5 md:px-2 md:py-1.5 lg:px-3 lg:py-2 text-center text-[10px] sm:text-xs md:text-sm lg:text-base text-neutral-5 border-b border-neutral-2 min-h-[22px] sm:min-h-[24px] md:min-h-[28px] lg:min-h-[32px] flex items-center justify-center bg-white">
        {formatValue(data.meta, unit)}
      </div>
      
      {/* Linha 2: Real */}
      <div className={`px-1 py-1 sm:px-1.5 sm:py-1.5 md:px-2 md:py-1.5 lg:px-3 lg:py-2 text-center text-[11px] sm:text-sm md:text-base lg:text-lg font-semibold border-b border-neutral-2 min-h-[24px] sm:min-h-[28px] md:min-h-[32px] lg:min-h-[36px] flex items-center justify-center bg-white ${
        hasData ? 'text-neutral-10' : 'text-neutral-3'
      }`}>
        {formatValue(data.real, unit)}
      </div>
      
      {/* Linha 3: Percentual - SEM borda bottom para evitar faixa */}
      <div className={`px-1 py-1 sm:px-1.5 sm:py-1.5 md:px-2 md:py-1.5 lg:px-3 lg:py-2 text-center text-[11px] sm:text-sm md:text-base lg:text-lg font-bold min-h-[24px] sm:min-h-[28px] md:min-h-[32px] lg:min-h-[36px] flex items-center justify-center gap-1 ${
        hasData 
          ? `${statusColor} text-white` 
          : 'bg-neutral-1 text-neutral-5'
      }`}>
        {showIcon && data.percentage > 0 && (
          direction === 'up' ? 
            <ArrowUp className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4 lg:w-5 lg:h-5" /> : 
            <ArrowDown className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4 lg:w-5 lg:h-5" />
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
    <div className="flex gap-2 sm:gap-3 md:gap-4 lg:gap-5">
      {/* Bloco 1: Nome do Indicador */}
      <div className="w-[180px] sm:w-[200px] md:w-[220px] lg:w-[250px] xl:w-[280px] flex-shrink-0">
        <div className="border border-neutral-2 bg-white shadow-sm h-full">
          <div className="flex items-center justify-center px-2 sm:px-3 md:px-4 lg:px-5 font-display font-bold text-xs sm:text-sm md:text-base lg:text-lg h-full min-h-[80px] sm:min-h-[90px] md:min-h-[100px] lg:min-h-[110px]">
            {indicator.name}
          </div>
        </div>
      </div>

      {/* Bloco 2: ACC */}
      <div className="w-[70px] sm:w-[80px] md:w-[90px] lg:w-[100px] xl:w-[110px] flex-shrink-0">
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

