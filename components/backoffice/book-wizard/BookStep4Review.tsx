'use client';

import { User, Users, FileText, TrendingUp, CheckCircle } from 'lucide-react';

type BookStep4ReviewProps = {
  formData: any;
  setFormData: (data: any) => void;
};

export default function BookStep4Review({ formData }: BookStep4ReviewProps) {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-neutral-2 p-6">
        <div className="flex items-center gap-3 mb-2">
          <CheckCircle className="w-6 h-6 text-green-600" />
          <h2 className="font-display font-bold text-xl text-neutral-10">
            Revisar e Confirmar
          </h2>
        </div>
        <p className="text-sm text-neutral-8">
          Confira todas as informações antes de criar o book
        </p>
      </div>

      {/* Informações Básicas */}
      <div className="bg-white rounded-xl border border-neutral-2 p-6">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-5 h-5 text-neutral-8" />
          <h3 className="font-semibold text-neutral-10">Informações Básicas</h3>
        </div>
        <div className="space-y-3">
          <div>
            <p className="text-xs text-neutral-5 mb-1">Nome do Book</p>
            <p className="font-medium text-neutral-10">{formData.name}</p>
          </div>
          <div>
            <p className="text-xs text-neutral-5 mb-1">Ano</p>
            <p className="font-medium text-neutral-10">{formData.year}</p>
          </div>
          {formData.description && (
            <div>
              <p className="text-xs text-neutral-5 mb-1">Descrição</p>
              <p className="text-sm text-neutral-8">{formData.description}</p>
            </div>
          )}
        </div>
      </div>

      {/* Owner */}
      <div className="bg-white rounded-xl border border-neutral-2 p-6">
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
          <div className="w-16 h-16 bg-neutral-2 rounded-full flex items-center justify-center">
            {formData.owner_type === 'person' ? (
              <User className="w-8 h-8 text-neutral-8" />
            ) : (
              <Users className="w-8 h-8 text-neutral-8" />
            )}
          </div>
          <div>
            <p className="font-semibold text-lg text-neutral-10">{formData.owner_name}</p>
            {formData.owner_role && (
              <p className="text-sm text-neutral-8">{formData.owner_role}</p>
            )}
            {formData.owner_email && (
              <p className="text-xs text-neutral-5 font-mono">{formData.owner_email}</p>
            )}
          </div>
        </div>
      </div>

      {/* Indicadores */}
      <div className="bg-white rounded-xl border border-neutral-2 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-neutral-8" />
            <h3 className="font-semibold text-neutral-10">Indicadores Selecionados</h3>
          </div>
          <span className="px-3 py-1 bg-green-50 text-green-700 text-sm font-medium rounded-lg">
            {formData.selected_indicators.length} {formData.selected_indicators.length === 1 ? 'indicador' : 'indicadores'}
          </span>
        </div>
        <div className="space-y-3">
          {formData.selected_indicators.map((indicator: any, index: number) => (
            <div
              key={indicator.indicator_id}
              className="flex items-center gap-3 p-4 bg-neutral-1 rounded-lg"
            >
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center font-bold text-neutral-10 border border-neutral-3">
                {index + 1}
              </div>
              <div className="flex-1">
                <p className="font-medium text-neutral-10">{indicator.indicator_name}</p>
                <p className="text-xs text-neutral-5 mt-0.5">
                  Formato: {indicator.indicator_format === 'percentage' && 'Percentual'}
                  {indicator.indicator_format === 'number' && 'Número'}
                  {indicator.indicator_format === 'currency' && 'Financeiro'}
                  {indicator.indicator_format === 'boolean' && 'Sim/Não'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Aviso */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
        <p className="text-sm text-yellow-800">
          <strong>Atenção:</strong> Após criar o book, você poderá editar as informações e definir metas mensais para cada indicador.
        </p>
      </div>
    </div>
  );
}

