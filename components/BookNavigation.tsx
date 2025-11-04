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
    <div className="flex items-center gap-2">
      {/* Botão Anterior */}
      <button
        onClick={onPrevious}
        disabled={!hasPrevious}
        className={`p-2 md:p-2.5 rounded-lg transition-all border-2 ${
          hasPrevious
            ? 'bg-white border-neutral-3 text-neutral-10 hover:border-suno-red cursor-pointer'
            : 'bg-neutral-1 border-neutral-2 text-neutral-3 cursor-not-allowed'
        }`}
        aria-label="Book anterior"
        title="Anterior"
      >
        <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
      </button>
      
      {/* Indicador de Posição */}
      <div className="px-3 md:px-4 py-2 md:py-2.5 bg-white border-2 border-neutral-3 rounded-lg">
        <span className="text-sm md:text-base font-display font-semibold text-neutral-10">
          {currentIndex + 1} / {totalBooks}
        </span>
      </div>
      
      {/* Botão Próximo */}
      <button
        onClick={onNext}
        disabled={!hasNext}
        className={`p-2 md:p-2.5 rounded-lg transition-all border-2 ${
          hasNext
            ? 'bg-white border-neutral-3 text-neutral-10 hover:border-suno-red cursor-pointer'
            : 'bg-neutral-1 border-neutral-2 text-neutral-3 cursor-not-allowed'
        }`}
        aria-label="Próximo book"
        title="Próximo"
      >
        <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
      </button>
    </div>
  );
}

