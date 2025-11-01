export type IndicatorDirection = 'up' | 'down';

export type MonthData = {
  meta: number;
  real: number;
  percentage: number;
};

export type IndicatorType = {
  id: string;
  name: string;
  unit: '%' | '#' | 'R$' | 'H$';
  direction: IndicatorDirection;
  accumulated: MonthData;
  months: {
    jan: MonthData;
    feb: MonthData;
    mar: MonthData;
    apr: MonthData;
    may: MonthData;
    jun: MonthData;
    jul: MonthData;
    aug: MonthData;
    sep: MonthData;
    oct: MonthData;
    nov: MonthData;
    dec: MonthData;
  };
};

export type BookData = {
  indicators: IndicatorType[];
};

