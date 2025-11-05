'use client';

import { Calendar } from 'lucide-react';

type BookStep3GoalsProps = {
  formData: any;
  setFormData: (data: any) => void;
};

export default function BookStep3Goals({ formData, setFormData }: BookStep3GoalsProps) {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-white rounded-xl border border-neutral-2 p-8">
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 text-neutral-3 mx-auto mb-4" />
          <h2 className="font-display font-bold text-xl text-neutral-10 mb-2">
            Definição de Metas
          </h2>
          <p className="text-neutral-8 mb-4">
            Em desenvolvimento - Aqui você poderá definir metas mensais para cada indicador
          </p>
          <p className="text-sm text-neutral-5">
            Por enquanto, você pode pular esta etapa e definir as metas depois
          </p>
        </div>
      </div>
    </div>
  );
}

