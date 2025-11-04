import { ChevronLeft, ChevronRight } from 'lucide-react';

type BookNavigationProps = {
  currentIndex: number;
  totalBooks: number;
  onPrevious: () => void;
  onNext: () => void;
};

export default function BookNavigation({ 
  currentIndex, 
  totalBooks, 
  onPrevious, 
  onNext 
}: BookNavigationProps) {
  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex < totalBooks - 1;
  
  return (
    <div className="flex items-center justify-between gap-4">
      {/* Botão Anterior */}
      <button
        onClick={onPrevious}
        disabled={!hasPrevious}
        className={`flex items-center gap-2 px-3 md:px-4 lg:px-5 py-2 md:py-2.5 lg:py-3 rounded-lg font-semibold text-sm md:text-base lg:text-lg transition-all ${
          hasPrevious
            ? 'bg-neutral-1 text-neutral-10 hover:bg-neutral-2 cursor-pointer'
            : 'bg-neutral-1 text-neutral-3 cursor-not-allowed opacity-50'
        }`}
        aria-label="Book anterior"
      >
        <ChevronLeft className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6" />
        <span className="hidden md:inline">Anterior</span>
      </button>
      
      {/* Indicador de Posição */}
      <div className="flex items-center gap-2">
        <span className="text-sm md:text-base lg:text-lg font-semibold text-neutral-10">
          {currentIndex + 1}
        </span>
        <span className="text-sm md:text-base lg:text-lg text-neutral-5">
          de
        </span>
        <span className="text-sm md:text-base lg:text-lg font-semibold text-neutral-10">
          {totalBooks}
        </span>
      </div>
      
      {/* Botão Próximo */}
      <button
        onClick={onNext}
        disabled={!hasNext}
        className={`flex items-center gap-2 px-3 md:px-4 lg:px-5 py-2 md:py-2.5 lg:py-3 rounded-lg font-semibold text-sm md:text-base lg:text-lg transition-all ${
          hasNext
            ? 'bg-neutral-1 text-neutral-10 hover:bg-neutral-2 cursor-pointer'
            : 'bg-neutral-1 text-neutral-3 cursor-not-allowed opacity-50'
        }`}
        aria-label="Próximo book"
      >
        <span className="hidden md:inline">Próximo</span>
        <ChevronRight className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6" />
      </button>
    </div>
  );
}

