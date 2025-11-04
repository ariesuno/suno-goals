import { BookOpen, Plus } from 'lucide-react';

export default function BooksPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl md:text-3xl text-neutral-10 mb-2">
            Books
          </h1>
          <p className="text-neutral-8">
            Gerencie os books de indicadores
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-suno-red text-white font-semibold rounded-lg hover:bg-red-700 transition-colors">
          <Plus className="w-5 h-5" />
          Novo Book
        </button>
      </div>

      {/* Content */}
      <div className="bg-white border border-neutral-2 rounded-xl p-8 text-center">
        <BookOpen className="w-16 h-16 text-neutral-3 mx-auto mb-4" />
        <h2 className="font-display font-semibold text-xl text-neutral-10 mb-2">
          Em Desenvolvimento
        </h2>
        <p className="text-neutral-8 mb-4">
          A funcionalidade de gerenciamento de books será implementada em breve.
        </p>
        <p className="text-sm text-neutral-5">
          Aqui você poderá criar, editar e remover books, além de associar indicadores aos usuários.
        </p>
      </div>
    </div>
  );
}

