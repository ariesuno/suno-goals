'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

type YearSelectorProps = {
  currentYear?: number;
  onYearChange?: (year: number) => void;
};

export default function YearSelector({ 
  currentYear = new Date().getFullYear(),
  onYearChange 
}: YearSelectorProps) {
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [isOpen, setIsOpen] = useState(false);

  // Gera lista de anos (5 anos para trás e 1 para frente)
  const years = Array.from({ length: 7 }, (_, i) => currentYear - 5 + i);

  const handleYearSelect = (year: number) => {
    setSelectedYear(year);
    setIsOpen(false);
    if (onYearChange) {
      onYearChange(year);
    }
  };

  return (
    <div className="relative print:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 md:px-4 lg:px-5 py-2 md:py-2.5 lg:py-3 bg-white border-2 border-neutral-3 rounded-lg hover:border-suno-red transition-colors font-display font-semibold text-sm md:text-base lg:text-lg text-neutral-10"
        aria-label="Selecionar ano"
      >
        {selectedYear}
        <ChevronDown className={`w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          {/* Overlay para fechar ao clicar fora */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute top-full mt-2 right-0 bg-white border-2 border-neutral-3 rounded-lg shadow-lg z-20 min-w-[120px]">
            {years.map((year) => (
              <button
                key={year}
                onClick={() => handleYearSelect(year)}
                className={`w-full px-4 py-2 text-left hover:bg-neutral-2 transition-colors first:rounded-t-lg last:rounded-b-lg font-display ${
                  year === selectedYear ? 'bg-suno-red text-white font-bold' : 'text-neutral-10'
                }`}
              >
                {year}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

