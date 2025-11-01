'use client';

import { Printer } from 'lucide-react';

export default function PrintButton() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <button
      onClick={handlePrint}
      className="flex items-center gap-2 px-4 py-2 bg-suno-red text-white font-semibold rounded-lg hover:opacity-90 transition-opacity print:hidden"
      aria-label="Imprimir book de indicadores"
    >
      <Printer className="w-4 h-4" />
      Imprimir / Screenshot
    </button>
  );
}

