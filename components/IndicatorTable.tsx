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
      {/* Cabeçalho da Tabela */}
      <div className="grid grid-cols-[250px_80px_repeat(12,1fr)] mb-0 border-x border-t border-neutral-2">
        {/* Coluna INDICADOR */}
        <div className="bg-suno-red text-white font-display font-bold text-sm px-4 py-3 border-r border-neutral-2 flex items-center">
          INDICADOR
        </div>

        {/* Coluna Acc */}
        <div className="bg-suno-red text-white font-display font-bold text-sm px-3 py-3 border-r border-neutral-2 text-center flex items-center justify-center">
          Acc
        </div>

        {/* Colunas dos Meses */}
        {months.map((month) => (
          <div
            key={month.key}
            className="bg-suno-red text-white font-display font-bold text-sm px-3 py-3 border-r border-neutral-2 last:border-r-0 text-center flex items-center justify-center"
          >
            {month.label}
          </div>
        ))}
      </div>

      {/* Sub-cabeçalho (Meta, Real, %) */}
      <div className="grid grid-cols-[250px_80px_repeat(12,1fr)] mb-0 border-x border-neutral-2">
        {/* Espaço vazio abaixo de INDICADOR */}
        <div className="border-r border-b border-neutral-2"></div>

        {/* Repetir para Acc + 12 meses */}
        {[...Array(13)].map((_, index) => (
          <div key={index} className="flex flex-col border-r border-neutral-2 last:border-r-0">
            <div className="px-2 py-1 text-center border-b border-neutral-2 text-xs text-neutral-8">
              Meta
            </div>
            <div className="px-2 py-1 text-center border-b border-neutral-2 text-xs text-neutral-8">
              Real
            </div>
            <div className="px-2 py-1 text-center border-b border-neutral-2 text-xs text-neutral-8 font-semibold">
              %
            </div>
          </div>
        ))}
      </div>

      {/* Linhas de Indicadores */}
      <div className="space-y-0">
        {data.indicators.map((indicator) => (
          <IndicatorRow key={indicator.id} indicator={indicator} />
        ))}
      </div>
    </div>
  );
}

