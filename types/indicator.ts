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
  editable: boolean; // Se o usuário pode editar o "realizado"
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

export type BookOwnerType = 'person' | 'team';

export type BookOwner = {
  id: string;
  name: string;
  type: BookOwnerType;
  role?: string; // Ex: "Head de Dados e CRM", "Gerente", etc.
  teamName?: string; // Ex: "Time de Dados", "Squad CRM"
};

export type TeamBook = {
  id: string;
  owner: BookOwner;
  data: BookData;
};

