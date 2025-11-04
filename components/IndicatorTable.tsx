import { BookData, IndicatorType } from '@/types/indicator';
import IndicatorRow from './IndicatorRow';

type IndicatorTableProps = {
  data: BookData;
  onCellUpdate?: (
    indicatorId: string,
    monthKey: keyof IndicatorType['months'],
    newRealValue: number
  ) => void;
};

export default function IndicatorTable({ data, onCellUpdate }: IndicatorTableProps) {
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
    <div className="w-full overflow-x-auto" data-indicator-table>
      <div className="min-w-[650px]">
      {/* Cabeçalho - 3 blocos separados */}
      <div className="flex gap-1.5 sm:gap-2 md:gap-3 lg:gap-4">
        {/* Bloco 1: INDICADOR */}
        <div className="w-[140px] md:w-[160px] lg:w-[180px] xl:w-[200px] flex-shrink-0">
          <div className="bg-suno-red text-white font-display font-bold text-[10px] md:text-[11px] lg:text-xs xl:text-sm px-1.5 md:px-2 lg:px-3 py-2 md:py-2.5 border border-neutral-2">
            INDICADOR
          </div>
        </div>

        {/* Bloco 2: ACC */}
        <div className="w-[60px] md:w-[70px] lg:w-[80px] xl:w-[90px] flex-shrink-0">
          <div className="bg-suno-red text-white font-display font-bold text-[10px] md:text-[11px] lg:text-xs xl:text-sm px-1 md:px-1.5 py-2 md:py-2.5 text-center border border-neutral-2">
            Acc
          </div>
        </div>

        {/* Bloco 3: Meses */}
        <div className="flex-1 min-w-0">
          <div className="grid grid-cols-12 border border-neutral-2">
            {months.map((month, index) => (
              <div
                key={month.key}
                className={`bg-suno-red text-white font-display font-bold text-[10px] md:text-[11px] lg:text-xs xl:text-sm px-0.5 md:px-1 lg:px-1.5 py-2 md:py-2.5 text-center ${
                  index < months.length - 1 ? 'border-r border-neutral-2' : ''
                }`}
              >
                {month.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Espaço entre header e indicadores */}
      <div className="h-2.5 sm:h-3 md:h-4 lg:h-5"></div>

      {/* Indicadores */}
      <div className="space-y-2.5 sm:space-y-3 md:space-y-4 lg:space-y-5">
        {data.indicators.map((indicator) => (
          <IndicatorRow 
            key={indicator.id} 
            indicator={indicator}
            onCellUpdate={onCellUpdate}
          />
        ))}
      </div>
      </div>
    </div>
  );
}

