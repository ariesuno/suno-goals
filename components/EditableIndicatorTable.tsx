'use client';

import { useState } from 'react';
import { BookData, IndicatorType, MonthData } from '@/types/indicator';
import IndicatorTable from './IndicatorTable';

type EditableIndicatorTableProps = {
  initialData: BookData;
};

export default function EditableIndicatorTable({ initialData }: EditableIndicatorTableProps) {
  const [bookData, setBookData] = useState<BookData>(initialData);

  const calculatePercentage = (real: number, meta: number, direction: 'up' | 'down'): number => {
    if (meta === 0) return 0;
    const percentage = Math.round((real / meta) * 100);
    return percentage;
  };

  const recalculateAccumulated = (indicator: IndicatorType): MonthData => {
    const months = Object.values(indicator.months);
    const totalMeta = months.reduce((sum, month) => sum + month.meta, 0);
    const totalReal = months.reduce((sum, month) => sum + month.real, 0);
    const percentage = calculatePercentage(totalReal, totalMeta, indicator.direction);
    
    return {
      meta: totalMeta,
      real: totalReal,
      percentage,
    };
  };

  const handleCellUpdate = (
    indicatorId: string,
    monthKey: keyof IndicatorType['months'],
    newRealValue: number
  ) => {
    setBookData(prevData => {
      const updatedIndicators = prevData.indicators.map(indicator => {
        if (indicator.id === indicatorId) {
          const meta = indicator.months[monthKey].meta;
          const percentage = calculatePercentage(newRealValue, meta, indicator.direction);
          
          const updatedMonths = {
            ...indicator.months,
            [monthKey]: {
              ...indicator.months[monthKey],
              real: newRealValue,
              percentage,
            },
          };
          
          const updatedIndicator = {
            ...indicator,
            months: updatedMonths,
          };
          
          // Recalcula o acumulado
          updatedIndicator.accumulated = recalculateAccumulated(updatedIndicator);
          
          return updatedIndicator;
        }
        return indicator;
      });

      return {
        ...prevData,
        indicators: updatedIndicators,
      };
    });
  };

  return <IndicatorTable data={bookData} onCellUpdate={handleCellUpdate} />;
}

