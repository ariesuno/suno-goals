'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { TeamBook } from '@/types/indicator';
import BookHeader from './BookHeader';
import BookNavigation from './BookNavigation';
import IndicatorTable from './IndicatorTable';
import ScreenshotButton from './ScreenshotButton';

type TeamBooksSectionProps = {
  books: TeamBook[];
};

export default function TeamBooksSection({ books }: TeamBooksSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentBookIndex, setCurrentBookIndex] = useState(0);

  if (books.length === 0) {
    return null;
  }

  const currentBook = books[currentBookIndex];

  const handlePrevious = () => {
    if (currentBookIndex > 0) {
      setCurrentBookIndex(currentBookIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentBookIndex < books.length - 1) {
      setCurrentBookIndex(currentBookIndex + 1);
    }
  };

  const handleBookSelect = (bookId: string) => {
    const index = books.findIndex(book => book.id === bookId);
    if (index !== -1) {
      setCurrentBookIndex(index);
    }
  };

  return (
    <div className="mt-8 md:mt-10 lg:mt-12">
      {/* Container com borda unificada */}
      <div className="border border-neutral-2 rounded-lg bg-white shadow-sm overflow-hidden">
        {/* Botão para expandir/recolher */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between px-4 md:px-5 lg:px-6 py-3 md:py-4 bg-neutral-1 hover:bg-neutral-2 transition-colors"
          aria-expanded={isExpanded}
          aria-label={isExpanded ? 'Recolher books do time' : 'Expandir books do time'}
        >
          <div className="flex items-center gap-3">
            <h2 className="font-display font-bold text-base md:text-lg lg:text-xl text-neutral-10">
              Books do Time
            </h2>
            <span className="px-2 md:px-2.5 lg:px-3 py-0.5 md:py-1 bg-suno-red text-white text-xs md:text-sm font-bold rounded-full">
              {books.length}
            </span>
          </div>
          
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 md:w-6 md:h-6 text-neutral-8" />
          ) : (
            <ChevronDown className="w-5 h-5 md:w-6 md:h-6 text-neutral-8" />
          )}
        </button>

        {/* Conteúdo expansível */}
        {isExpanded && (
          <div className="border-t border-neutral-2">
            {/* Controles: Select + Navegação + Screenshot */}
            <div className="bg-neutral-1 p-3 md:p-4">
              <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
                {/* Select de Books */}
                <div className="lg:w-[320px] xl:w-[400px]">
                  <select
                    value={currentBook.id}
                    onChange={(e) => handleBookSelect(e.target.value)}
                    className="w-full h-[40px] md:h-[44px] px-3 md:px-4 text-sm md:text-base border-2 border-neutral-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-suno-red focus:border-suno-red bg-white cursor-pointer font-display font-semibold text-neutral-10 hover:border-suno-red transition-colors appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2724%27 height=%2724%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27%23666666%27 stroke-width=%272%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3e%3cpolyline points=%276 9 12 15 18 9%27%3e%3c/polyline%3e%3c/svg%3e')] bg-[length:20px] bg-[right_12px_center] bg-no-repeat pr-10"
                    aria-label="Selecionar book"
                  >
                    {books.map((book) => (
                      <option key={book.id} value={book.id}>
                        {book.owner.name}
                        {book.owner.role && ` • ${book.owner.role}`}
                        {book.owner.teamName && !book.owner.role && ` • ${book.owner.teamName}`}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Navegação e Screenshot */}
                <div className="flex items-center gap-2 md:gap-3">
                  <BookNavigation
                    currentIndex={currentBookIndex}
                    totalBooks={books.length}
                    onPrevious={handlePrevious}
                    onNext={handleNext}
                  />
                  
                  <div className="h-8 md:h-10 w-px bg-neutral-3" />
                  
                  <ScreenshotButton
                    targetSelector={`[data-team-book="${currentBook.id}"]`}
                    fileName={`book-${currentBook.owner.name.toLowerCase().replace(/\s+/g, '-')}.png`}
                    label="Screenshot"
                  />
                </div>
              </div>
            </div>

            {/* Book atual */}
            <div 
              className="p-3 sm:p-4 md:p-5 lg:p-6"
              data-team-book={currentBook.id}
            >
              {/* Header do book */}
              <BookHeader owner={currentBook.owner} />
              
              {/* Tabela de indicadores */}
              <IndicatorTable data={currentBook.data} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

