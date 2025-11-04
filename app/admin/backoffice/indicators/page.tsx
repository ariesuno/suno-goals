import { TrendingUp, Plus } from 'lucide-react';

export default function IndicatorsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl md:text-3xl text-neutral-10 mb-2">
            Indicadores
          </h1>
          <p className="text-neutral-8">
            Gerencie os indicadores do sistema
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-suno-red text-white font-semibold rounded-lg hover:bg-red-700 transition-colors">
          <Plus className="w-5 h-5" />
          Novo Indicador
        </button>
      </div>

      {/* Content */}
      <div className="bg-white border border-neutral-2 rounded-xl p-8 text-center">
        <TrendingUp className="w-16 h-16 text-neutral-3 mx-auto mb-4" />
        <h2 className="font-display font-semibold text-xl text-neutral-10 mb-2">
          Em Desenvolvimento
        </h2>
        <p className="text-neutral-8 mb-4">
          A funcionalidade de gerenciamento de indicadores será implementada em breve.
        </p>
        <p className="text-sm text-neutral-5">
          Aqui você poderá criar, editar e remover indicadores, definir metas, unidades e direções.
        </p>
      </div>
    </div>
  );
}

