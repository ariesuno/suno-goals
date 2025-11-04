import { Settings } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display font-bold text-2xl md:text-3xl text-neutral-10 mb-2">
          Configurações
        </h1>
        <p className="text-neutral-8">
          Configure o sistema e visualize alertas
        </p>
      </div>

      {/* Content */}
      <div className="bg-white border border-neutral-2 rounded-xl p-8 text-center">
        <Settings className="w-16 h-16 text-neutral-3 mx-auto mb-4" />
        <h2 className="font-display font-semibold text-xl text-neutral-10 mb-2">
          Em Desenvolvimento
        </h2>
        <p className="text-neutral-8 mb-4">
          A funcionalidade de configurações será implementada em breve.
        </p>
        <p className="text-sm text-neutral-5">
          Aqui você poderá configurar alertas, notificações, integrações e outras opções do sistema.
        </p>
      </div>
    </div>
  );
}

