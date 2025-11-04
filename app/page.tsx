import Header from '@/components/Header';
import IndicatorTable from '@/components/IndicatorTable';
import TeamBooksSection from '@/components/TeamBooksSection';
import { mockBookData } from '@/lib/mockData';
import { mockTeamBooks } from '@/lib/mockTeamBooks';

export default function Home() {
  return (
    <main className="min-h-screen bg-white p-4 md:p-6 lg:p-8">
      <div className="w-[90%] mx-auto">
        {/* Header */}
        <Header 
          currentYear={2025}
        />

        {/* Meus Indicadores */}
        <div className="print:m-0" data-indicator-table>
          <IndicatorTable data={mockBookData} />
        </div>

        {/* Books do Time */}
        <TeamBooksSection books={mockTeamBooks} />

        {/* Footer para Print */}
        <div className="mt-8 md:mt-10 lg:mt-12 text-center text-xs md:text-sm text-neutral-5 print:mt-4">
          Suno Goals © {new Date().getFullYear()}
        </div>
      </div>
    </main>
  );
}
