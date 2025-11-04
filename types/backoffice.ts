// =====================================================
// INDICADORES - TIPOS E ENUMS
// =====================================================

export type IndicatorStatus = 'validated' | 'in_construction' | 'under_review';

export type IndicatorFormat = 'percentage' | 'number' | 'currency' | 'boolean' | 'hours';

export type IndicatorAggregationType = 'none' | 'average' | 'sum' | 'count';

export type IndicatorTag = {
  id: string;
  name: string;
  color: string;
};

export type IndicatorGoal = {
  id: string;
  indicator_id: string;
  user_id?: string;
  team_id?: string;
  year: number;
  goals: {
    jan: number;
    feb: number;
    mar: number;
    apr: number;
    may: number;
    jun: number;
    jul: number;
    aug: number;
    sep: number;
    oct: number;
    nov: number;
    dec: number;
  };
  created_at: Date;
  updated_at: Date;
};

export type IndicatorInBook = {
  book_id: string;
  book_name: string;
  owner_name: string;
  is_manager: boolean; // Se o usuário é gestor (pode editar) ou só visualiza
  achievement_rate: number;
};

export type IndicatorChangeLog = {
  id: string;
  indicator_id: string;
  user_id: string;
  user_name: string;
  action: 'created' | 'updated' | 'deleted' | 'status_changed';
  field_changed?: string;
  old_value?: string;
  new_value?: string;
  created_at: Date;
};

export type BackofficeIndicator = {
  id: string;
  name: string;
  description: string;
  notes?: string;
  format: IndicatorFormat;
  direction: 'up' | 'down';
  status: IndicatorStatus;
  aggregation_type: IndicatorAggregationType;
  aggregated_indicators?: string[]; // IDs dos indicadores agregados
  tags: IndicatorTag[];
  created_by: string;
  created_by_name: string;
  created_at: Date;
  updated_at: Date;
  
  // Dados calculados
  total_books?: number;
  average_achievement?: number;
  books?: IndicatorInBook[];
  change_log?: IndicatorChangeLog[];
};

// =====================================================
// BOOKS - TIPOS
// =====================================================

export type BookIndicatorConfig = {
  indicator_id: string;
  is_manager: boolean; // Se o usuário pode editar ou só visualizar
  display_order: number;
  custom_goal?: {
    jan: number;
    feb: number;
    mar: number;
    apr: number;
    may: number;
    jun: number;
    jul: number;
    aug: number;
    sep: number;
    oct: number;
    nov: number;
    dec: number;
  };
};

export type BackofficeBook = {
  id: string;
  owner_id: string;
  owner_name: string;
  owner_email: string;
  name: string;
  description?: string;
  year: number;
  indicators: BookIndicatorConfig[];
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
};

// =====================================================
// FILTROS
// =====================================================

export type IndicatorFilters = {
  search?: string;
  status?: IndicatorStatus[];
  format?: IndicatorFormat[];
  tags?: string[];
  created_by?: string;
  has_books?: boolean;
};

