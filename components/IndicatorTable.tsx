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
    <div className="w-full">
      {/* Cabeçalho */}
      <div className="grid grid-cols-[250px_8px_100px_8px_repeat(12,1fr)] border border-neutral-2 bg-white">
        {/* Coluna INDICADOR */}
        <div className="bg-suno-red text-white font-display font-bold text-sm px-4 py-3 flex items-center">
          INDICADOR
        </div>

        {/* Espaçador esquerdo */}
        <div className="bg-white"></div>

        {/* Coluna Acc */}
        <div className="bg-suno-red text-white font-display font-bold text-sm px-3 py-3 text-center flex items-center justify-center">
          Acc
        </div>

        {/* Espaçador direito */}
        <div className="bg-white"></div>

        {/* Colunas dos Meses */}
        {months.map((month, index) => (
          <div
            key={month.key}
            className={`bg-suno-red text-white font-display font-bold text-sm px-3 py-3 text-center flex items-center justify-center ${
              index < months.length - 1 ? 'border-r border-neutral-2' : ''
            }`}
          >
            {month.label}
          </div>
        ))}
      </div>

      {/* Espaço entre header e indicadores */}
      <div className="h-6"></div>

      {/* Indicadores */}
      <div className="space-y-6">
        {data.indicators.map((indicator) => (
          <IndicatorRow key={indicator.id} indicator={indicator} />
        ))}
      </div>
    </div>
  );
}

