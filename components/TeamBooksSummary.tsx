'use client';

import { AlertCircle, TrendingUp, TrendingDown, Users } from 'lucide-react';
import { Notification, MacroIndicators } from '@/types/indicator';

type TeamBooksSummaryProps = {
  notifications: Notification[];
  macroIndicators: MacroIndicators;
};

export default function TeamBooksSummary({ notifications, macroIndicators }: TeamBooksSummaryProps) {
  const achievementPercentage = macroIndicators.achievementRate;
  const hasWarnings = notifications.length > 0;

  return (
    <div className="space-y-3">
      {/* Notificações */}
      {hasWarnings && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-suno-red flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <h3 className="text-xs font-semibold text-neutral-10 mb-1.5">
                Atenção necessária
              </h3>
              <div className="space-y-1">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="text-xs text-neutral-8 flex items-start gap-1.5"
                  >
                    <span className="text-suno-red">•</span>
                    <span>
                      <strong>{notification.ownerName}</strong>: {notification.message}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Indicadores Macro */}
      <div className="grid grid-cols-3 gap-2">
        {/* Total de Indicadores */}
        <div className="bg-white border border-neutral-2 rounded-lg p-2.5">
          <div className="flex items-center gap-1.5 mb-1">
            <Users className="w-3.5 h-3.5 text-neutral-5" />
            <span className="text-xs text-neutral-5 font-medium">Total</span>
          </div>
          <div className="text-lg font-bold text-neutral-10">
            {macroIndicators.totalIndicators}
          </div>
        </div>

        {/* Batendo Meta */}
        <div className="bg-white border border-neutral-2 rounded-lg p-2.5">
          <div className="flex items-center gap-1.5 mb-1">
            <TrendingUp className="w-3.5 h-3.5 text-neutral-5" />
            <span className="text-xs text-neutral-5 font-medium">Batendo</span>
          </div>
          <div className="text-lg font-bold text-neutral-10">
            {macroIndicators.achieving}
          </div>
        </div>

        {/* Não Batendo Meta */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-2.5">
          <div className="flex items-center gap-1.5 mb-1">
            <TrendingDown className="w-3.5 h-3.5 text-suno-red" />
            <span className="text-xs text-suno-red font-medium">Abaixo</span>
          </div>
          <div className="text-lg font-bold text-suno-red">
            {macroIndicators.notAchieving}
          </div>
        </div>
      </div>

      {/* Barra de Progresso Geral */}
      <div className="bg-white border border-neutral-2 rounded-lg p-2.5">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-medium text-neutral-8">
            Taxa de Atingimento Geral
          </span>
          <span className={`text-sm font-bold ${
            achievementPercentage >= 80 
              ? 'text-neutral-10' 
              : 'text-suno-red'
          }`}>
            {achievementPercentage}%
          </span>
        </div>
        <div className="w-full bg-neutral-2 rounded-full h-2 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              achievementPercentage >= 80 
                ? 'bg-neutral-8' 
                : 'bg-suno-red'
            }`}
            style={{ width: `${achievementPercentage}%` }}
          />
        </div>
      </div>
    </div>
  );
}

