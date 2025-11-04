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
      {/* Botão para expandir/recolher */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-4 md:px-5 lg:px-6 py-3 md:py-4 lg:py-5 bg-neutral-1 hover:bg-neutral-2 rounded-lg transition-colors border border-neutral-2"
        aria-expanded={isExpanded}
        aria-label={isExpanded ? 'Recolher books do time' : 'Expandir books do time'}
      >
        <div className="flex items-center gap-3">
          <h2 className="font-display font-bold text-base md:text-lg lg:text-xl text-neutral-10">
            Books do Time
          </h2>
          <span className="px-2 md:px-2.5 lg:px-3 py-0.5 md:py-1 lg:py-1.5 bg-suno-red text-white text-xs md:text-sm lg:text-base font-bold rounded-full">
            {books.length}
          </span>
        </div>
        
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 text-neutral-8" />
        ) : (
          <ChevronDown className="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 text-neutral-8" />
        )}
      </button>

      {/* Conteúdo expansível */}
      {isExpanded && (
        <div className="mt-4 sm:mt-5 md:mt-6 lg:mt-7">
          {/* Controles: Select + Navegação + Screenshot */}
          <div className="bg-neutral-1 border border-neutral-2 rounded-lg p-3 md:p-4 mb-4 md:mb-5 lg:mb-6">
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3 md:gap-4">
              {/* Select de Books */}
              <div className="flex-1">
                <select
                  value={currentBook.id}
                  onChange={(e) => handleBookSelect(e.target.value)}
                  className="w-full px-3 md:px-4 py-2 md:py-2.5 text-sm md:text-base border-2 border-neutral-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-suno-red focus:border-suno-red bg-white cursor-pointer font-display font-semibold text-neutral-10 hover:border-suno-red transition-colors"
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

              {/* Navegação */}
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
            className="bg-white border border-neutral-2 rounded-lg p-3 sm:p-4 md:p-5 lg:p-6 shadow-sm"
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
  );
}

