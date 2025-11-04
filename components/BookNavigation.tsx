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
    <div className="flex items-center gap-1.5">
      {/* Botão Anterior */}
      <button
        onClick={onPrevious}
        disabled={!hasPrevious}
        className={`p-1.5 md:p-2 rounded-lg transition-all border ${
          hasPrevious
            ? 'bg-white border-neutral-3 text-neutral-10 hover:border-neutral-5 hover:bg-neutral-1 cursor-pointer'
            : 'bg-neutral-1 border-neutral-2 text-neutral-3 cursor-not-allowed'
        }`}
        aria-label="Book anterior"
        title="Anterior"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {/* Indicador de Posição */}
      <div className="px-2.5 md:px-3 py-1.5 md:py-2 bg-white border border-neutral-3 rounded-lg">
        <span className="text-xs md:text-sm font-display font-medium text-neutral-10">
          {currentIndex + 1} / {totalBooks}
        </span>
      </div>

      {/* Botão Próximo */}
      <button
        onClick={onNext}
        disabled={!hasNext}
        className={`p-1.5 md:p-2 rounded-lg transition-all border ${
          hasNext
            ? 'bg-white border-neutral-3 text-neutral-10 hover:border-neutral-5 hover:bg-neutral-1 cursor-pointer'
            : 'bg-neutral-1 border-neutral-2 text-neutral-3 cursor-not-allowed'
        }`}
        aria-label="Próximo book"
        title="Próximo"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}

