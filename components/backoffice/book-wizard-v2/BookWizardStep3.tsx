'use client';

import { User, Users, TrendingUp, TrendingDown, Calendar, FileText } from 'lucide-react';

type BookWizardStep3Props = {
  formData: any;
};

export default function BookWizardStep3({ formData }: BookWizardStep3Props) {
  return (
    <div className="space-y-6">
      {/* Resumo do Book */}
      <div className="p-5 bg-neutral-1 rounded-lg border border-neutral-2">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-5 h-5 text-neutral-8" />
          <h3 className="font-semibold text-neutral-10">Informações do Book</h3>
        </div>
        <div className="space-y-3">
          <div>
            <p className="text-xs text-neutral-5 mb-1">Nome</p>
            <p className="font-medium text-neutral-10">{formData.name}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-neutral-5 mb-1">Ano</p>
              <p className="font-medium text-neutral-10">{formData.year}</p>
            </div>
            <div>
              <p className="text-xs text-neutral-5 mb-1">Tipo</p>
              <p className="font-medium text-neutral-10">
                {formData.owner_type === 'person' ? 'Individual' : 'Time'}
              </p>
            </div>
          </div>
          {formData.description && (
            <div>
              <p className="text-xs text-neutral-5 mb-1">Descrição</p>
              <p className="text-sm text-neutral-8">{formData.description}</p>
            </div>
          )}
        </div>
      </div>

      {/* Responsável */}
      <div className="p-5 bg-white rounded-lg border-2 border-neutral-2">
        <div className="flex items-center gap-2 mb-4">
          {formData.owner_type === 'person' ? (
            <User className="w-5 h-5 text-neutral-8" />
          ) : (
            <Users className="w-5 h-5 text-neutral-8" />
          )}
          <h3 className="font-semibold text-neutral-10">
            {formData.owner_type === 'person' ? 'Responsável' : 'Time'}
          </h3>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-suno-red rounded-full flex items-center justify-center flex-shrink-0">
            {formData.owner_type === 'person' ? (
              <User className="w-7 h-7 text-white" />
            ) : (
              <Users className="w-7 h-7 text-white" />
            )}
          </div>
          <div className="flex-1">
            <p className="font-semibold text-lg text-neutral-10">{formData.owner_name}</p>
            {formData.owner_role && (
              <p className="text-sm text-neutral-8 mt-0.5">{formData.owner_role}</p>
            )}
            {formData.owner_email && (
              <p className="text-xs text-neutral-5 font-mono mt-1">{formData.owner_email}</p>
            )}
          </div>
        </div>
      </div>

      {/* Indicadores */}
      <div className="p-5 bg-white rounded-lg border-2 border-neutral-2">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-neutral-8" />
            <h3 className="font-semibold text-neutral-10">Indicadores</h3>
          </div>
          <span className="px-3 py-1 bg-green-50 text-green-700 text-sm font-semibold rounded-lg">
            {formData.selected_indicators.length}{' '}
            {formData.selected_indicators.length === 1 ? 'indicador' : 'indicadores'}
          </span>
        </div>
        <div className="space-y-2">
          {formData.selected_indicators.map((indicator: any, index: number) => (
            <div
              key={indicator.indicator_id}
              className="flex items-center gap-3 p-3 bg-neutral-1 rounded-lg"
            >
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center font-bold text-neutral-10 border border-neutral-3 flex-shrink-0">
                {index + 1}
              </div>
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  indicator.indicator_direction === 'up' ? 'bg-green-100' : 'bg-red-100'
                }`}
              >
                {indicator.indicator_direction === 'up' ? (
                  <TrendingUp className="w-4 h-4 text-green-700" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-700" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-neutral-10 truncate">{indicator.indicator_name}</p>
                <p className="text-xs text-neutral-5">
                  {indicator.indicator_format === 'percentage' && 'Percentual'}
                  {indicator.indicator_format === 'number' && 'Número'}
                  {indicator.indicator_format === 'currency' && 'Financeiro'}
                  {indicator.indicator_format === 'boolean' && 'Sim/Não'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Próximos Passos */}
      <div className="p-5 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start gap-3">
          <Calendar className="w-5 h-5 text-blue-700 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-blue-900 mb-2">Próximos Passos</h3>
            <ul className="text-sm text-blue-800 space-y-1.5">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>Após criar o book, você poderá definir as metas mensais para cada indicador</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>O responsável poderá visualizar e preencher os dados dos indicadores</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>Você poderá acompanhar o progresso e performance em tempo real</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

