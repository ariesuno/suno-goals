'use client';

import { TeamBook } from '@/types/indicator';
import { Search } from 'lucide-react';
import { useState, useMemo } from 'react';

type BookSearchAndSelectProps = {
  books: TeamBook[];
  currentBookId: string;
  onBookSelect: (bookId: string) => void;
};

export default function BookSearchAndSelect({ 
  books, 
  currentBookId, 
  onBookSelect 
}: BookSearchAndSelectProps) {
  const [searchTerm, setSearchTerm] = useState('');

  // Filtra books baseado no termo de busca
  const filteredBooks = useMemo(() => {
    if (!searchTerm.trim()) return books;
    
    const term = searchTerm.toLowerCase();
    return books.filter(book => 
      book.owner.name.toLowerCase().includes(term) ||
      book.owner.role?.toLowerCase().includes(term) ||
      book.owner.teamName?.toLowerCase().includes(term)
    );
  }, [books, searchTerm]);

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const bookId = e.target.value;
    onBookSelect(bookId);
    setSearchTerm(''); // Limpa busca após seleção
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
      {/* Barra de Busca */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-neutral-5" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar por nome, cargo ou time..."
          className="w-full pl-10 pr-4 py-2 md:py-2.5 lg:py-3 text-sm md:text-base lg:text-lg border border-neutral-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-suno-red focus:border-transparent"
          aria-label="Buscar book"
        />
      </div>

      {/* Select Box */}
      <div className="sm:w-[280px] md:w-[320px] lg:w-[360px]">
        <select
          value={currentBookId}
          onChange={handleSelectChange}
          className="w-full px-3 md:px-4 py-2 md:py-2.5 lg:py-3 text-sm md:text-base lg:text-lg border border-neutral-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-suno-red focus:border-transparent bg-white cursor-pointer font-semibold"
          aria-label="Selecionar book"
        >
          {filteredBooks.length === 0 ? (
            <option value="">Nenhum resultado encontrado</option>
          ) : (
            filteredBooks.map((book) => (
              <option key={book.id} value={book.id}>
                {book.owner.name}
                {book.owner.role && ` - ${book.owner.role}`}
                {book.owner.teamName && !book.owner.role && ` - ${book.owner.teamName}`}
              </option>
            ))
          )}
        </select>
      </div>
    </div>
  );
}

