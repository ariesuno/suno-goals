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
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <h3 className="text-xs font-semibold text-orange-900 mb-1.5">
                Atenção necessária
              </h3>
              <div className="space-y-1">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="text-xs text-orange-800 flex items-start gap-1.5"
                  >
                    <span className="text-orange-600">•</span>
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
        <div className="bg-green-50 border border-green-200 rounded-lg p-2.5">
          <div className="flex items-center gap-1.5 mb-1">
            <TrendingUp className="w-3.5 h-3.5 text-green-600" />
            <span className="text-xs text-green-700 font-medium">Batendo</span>
          </div>
          <div className="text-lg font-bold text-green-700">
            {macroIndicators.achieving}
          </div>
        </div>

        {/* Não Batendo Meta */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-2.5">
          <div className="flex items-center gap-1.5 mb-1">
            <TrendingDown className="w-3.5 h-3.5 text-red-600" />
            <span className="text-xs text-red-700 font-medium">Abaixo</span>
          </div>
          <div className="text-lg font-bold text-red-700">
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
              ? 'text-green-600' 
              : achievementPercentage >= 60 
              ? 'text-orange-600' 
              : 'text-red-600'
          }`}>
            {achievementPercentage}%
          </span>
        </div>
        <div className="w-full bg-neutral-2 rounded-full h-2 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              achievementPercentage >= 80 
                ? 'bg-green-500' 
                : achievementPercentage >= 60 
                ? 'bg-orange-500' 
                : 'bg-red-500'
            }`}
            style={{ width: `${achievementPercentage}%` }}
          />
        </div>
      </div>
    </div>
  );
}

