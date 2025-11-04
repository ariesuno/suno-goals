import Header from '@/components/Header';
import IndicatorTable from '@/components/IndicatorTable';
import { mockBookData } from '@/lib/mockData';

export default function Home() {
  return (
    <main className="min-h-screen bg-white p-8">
      <div className="w-[90%] mx-auto">
        {/* Header */}
        <Header 
          title="Book de Indicadores"
          currentYear={2025}
        />

        {/* Tabela de Indicadores */}
        <div className="print:m-0">
          <IndicatorTable data={mockBookData} />
        </div>

        {/* Footer para Print */}
        <div className="mt-8 text-center text-xs text-neutral-5 print:mt-4">
          Suno Goals © {new Date().getFullYear()}
        </div>
      </div>
    </main>
  );
}
