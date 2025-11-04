import { BookData } from '@/types/indicator';
import IndicatorRow from './IndicatorRow';

type IndicatorTableProps = {
  data: BookData;
};

export default function IndicatorTable({ data }: IndicatorTableProps) {
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
      <div className="min-w-[800px]">
      {/* Cabeçalho - 3 blocos separados */}
      <div className="flex gap-2 sm:gap-3 md:gap-4 lg:gap-5">
        {/* Bloco 1: INDICADOR */}
        <div className="w-[200px] md:w-[220px] lg:w-[250px] xl:w-[280px] flex-shrink-0">
          <div className="bg-suno-red text-white font-display font-bold text-xs md:text-sm lg:text-base xl:text-lg px-3 md:px-4 lg:px-5 py-2.5 md:py-3 border border-neutral-2">
            INDICADOR
          </div>
        </div>

        {/* Bloco 2: ACC */}
        <div className="w-[80px] md:w-[90px] lg:w-[100px] xl:w-[110px] flex-shrink-0">
          <div className="bg-suno-red text-white font-display font-bold text-xs md:text-sm lg:text-base xl:text-lg px-2 md:px-3 py-2.5 md:py-3 text-center border border-neutral-2">
            Acc
          </div>
        </div>

        {/* Bloco 3: Meses */}
        <div className="flex-1 min-w-0">
          <div className="grid grid-cols-12 border border-neutral-2">
            {months.map((month, index) => (
              <div
                key={month.key}
                className={`bg-suno-red text-white font-display font-bold text-xs md:text-sm lg:text-base xl:text-lg px-2 md:px-3 py-2.5 md:py-3 text-center ${
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
      <div className="h-3 sm:h-4 md:h-5 lg:h-6"></div>

      {/* Indicadores */}
      <div className="space-y-3 sm:space-y-4 md:space-y-5 lg:space-y-6">
        {data.indicators.map((indicator) => (
          <IndicatorRow key={indicator.id} indicator={indicator} />
        ))}
      </div>
      </div>
    </div>
  );
}

