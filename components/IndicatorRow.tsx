import { IndicatorType, MonthData } from '@/types/indicator';
import EditableCell from './EditableCell';

type IndicatorRowProps = {
  indicator: IndicatorType;
  onCellUpdate?: (
    indicatorId: string,
    monthKey: keyof IndicatorType['months'],
    newRealValue: number
  ) => void;
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
  if (value === 0) return '\u00A0'; // Non-breaking space para manter altura

  if (unit === 'R$' || unit === 'H$') {
    return value.toLocaleString('pt-BR');
  }
  return value.toString();
};

const formatPercentage = (percentage: number): string => {
  if (percentage === 0) return '\u00A0'; // Non-breaking space para manter altura
  return `${percentage}%`;
};

type CellProps = {
  data: MonthData;
  unit: string;
  direction: 'up' | 'down';
  editable: boolean;
  onSave?: (newValue: number) => void;
};

type MonthCellProps = CellProps & {
  hasRightBorder?: boolean;
};

const MonthCell = ({ data, unit, direction, editable, onSave, hasRightBorder = false }: MonthCellProps) => {
  const statusColor = getStatusColor(data.percentage, direction);
  const hasData = data.real !== 0 || data.percentage !== 0;
  const borderRightClass = hasRightBorder ? 'border-r border-neutral-2' : '';
  
  return (
    <div className={`flex flex-col h-full ${borderRightClass}`}>
      {/* Linha 1: Meta */}
      <div className="px-0.5 py-0.5 md:px-1 md:py-1 lg:px-1.5 lg:py-1 text-center text-[9px] md:text-[10px] lg:text-xs text-neutral-5 border-b border-neutral-2 h-[20px] md:h-[22px] lg:h-[24px] flex items-center justify-center bg-white">
        {formatValue(data.meta, unit)}
      </div>
      
      {/* Linha 2: Real - Editável se editable = true */}
      {editable && onSave ? (
        <EditableCell
          value={data.real}
          meta={data.meta}
          unit={unit}
          direction={direction}
          onSave={onSave}
          editable={editable}
        />
      ) : (
        <div className={`px-0.5 py-0.5 md:px-1 md:py-1 lg:px-1.5 lg:py-1 text-center text-[10px] md:text-[11px] lg:text-sm font-semibold border-b border-neutral-2 h-[22px] md:h-[24px] lg:h-[26px] flex items-center justify-center bg-white ${
          hasData ? 'text-neutral-10' : 'text-neutral-3'
        }`}>
          {formatValue(data.real, unit)}
        </div>
      )}
      
      {/* Linha 3: Percentual - SEM borda bottom para evitar faixa e SEM setas */}
      <div className={`px-0.5 py-0.5 md:px-1 md:py-1 lg:px-1.5 lg:py-1 text-center text-[10px] md:text-[11px] lg:text-sm font-bold h-[22px] md:h-[24px] lg:h-[26px] flex items-center justify-center ${
        hasData 
          ? `${statusColor} text-white` 
          : 'bg-neutral-1 text-neutral-5'
      }`}>
        {formatPercentage(data.percentage)}
      </div>
    </div>
  );
};

export default function IndicatorRow({ indicator, onCellUpdate }: IndicatorRowProps) {
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
      <div className="w-[140px] md:w-[160px] lg:w-[180px] xl:w-[200px] flex-shrink-0">
        <div className="border border-neutral-2 bg-white shadow-sm h-full">
          <div className="flex items-center justify-center px-1.5 md:px-2 lg:px-3 font-display font-bold text-[10px] md:text-[11px] lg:text-xs xl:text-sm h-full min-h-[64px] md:min-h-[68px] lg:min-h-[74px]">
            {indicator.name}
          </div>
        </div>
      </div>

      {/* Bloco 2: ACC */}
      <div className="w-[60px] md:w-[70px] lg:w-[80px] xl:w-[90px] flex-shrink-0">
        <div className="border border-neutral-2 bg-white shadow-sm">
          <MonthCell 
            data={indicator.accumulated} 
            unit={indicator.unit} 
            direction={indicator.direction}
            editable={false}
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
                editable={indicator.editable}
                onSave={
                  indicator.editable && onCellUpdate
                    ? (newValue) => onCellUpdate(indicator.id, month.key as keyof typeof indicator.months, newValue)
                    : undefined
                }
                hasRightBorder={index < months.length - 1}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

