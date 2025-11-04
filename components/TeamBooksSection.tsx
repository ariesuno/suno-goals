'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { TeamBook } from '@/types/indicator';
import BookHeader from './BookHeader';
import BookNavigation from './BookNavigation';
import BookSearchAndSelect from './BookSearchAndSelect';
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
        <div className="mt-4 sm:mt-5 md:mt-6 lg:mt-7 space-y-4 sm:space-y-5 md:space-y-6 lg:space-y-7">
          {/* Busca e Seleção */}
          <BookSearchAndSelect
            books={books}
            currentBookId={currentBook.id}
            onBookSelect={handleBookSelect}
          />

          {/* Navegação e Screenshot */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
            <BookNavigation
              currentIndex={currentBookIndex}
              totalBooks={books.length}
              onPrevious={handlePrevious}
              onNext={handleNext}
            />
            
            <ScreenshotButton
              targetSelector={`[data-team-book="${currentBook.id}"]`}
              fileName={`book-${currentBook.owner.name.toLowerCase().replace(/\s+/g, '-')}.png`}
              label="Screenshot"
            />
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

