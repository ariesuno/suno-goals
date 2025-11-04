-- =====================================================
-- MÓDULO DE INDICADORES - BACKOFFICE
-- =====================================================

-- Enums adicionais
CREATE TYPE indicator_status AS ENUM ('validated', 'in_construction', 'under_review');
CREATE TYPE indicator_format AS ENUM ('percentage', 'number', 'currency', 'boolean', 'hours');
CREATE TYPE aggregation_type AS ENUM ('none', 'average', 'sum', 'count');

-- =====================================================
-- TABELA: backoffice_indicators
-- =====================================================
CREATE TABLE public.backoffice_indicators (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  notes TEXT,
  format indicator_format NOT NULL DEFAULT 'number',
  direction indicator_direction NOT NULL,
  status indicator_status NOT NULL DEFAULT 'in_construction',
  aggregation_type aggregation_type NOT NULL DEFAULT 'none',
  aggregated_indicators UUID[], -- Array de IDs de indicadores agregados
  created_by UUID NOT NULL REFERENCES public.users(id),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- TABELA: indicator_tags
-- =====================================================
CREATE TABLE public.indicator_tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  color TEXT DEFAULT '#999999',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- TABELA: indicator_tag_relations
-- =====================================================
CREATE TABLE public.indicator_tag_relations (
  indicator_id UUID NOT NULL REFERENCES public.backoffice_indicators(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES public.indicator_tags(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (indicator_id, tag_id)
);

-- =====================================================
-- TABELA: indicator_goals
-- Metas por usuário/time para cada indicador
-- =====================================================
CREATE TABLE public.indicator_goals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  indicator_id UUID NOT NULL REFERENCES public.backoffice_indicators(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  team_id UUID, -- Para metas de time
  year INTEGER NOT NULL,
  jan NUMERIC DEFAULT 0,
  feb NUMERIC DEFAULT 0,
  mar NUMERIC DEFAULT 0,
  apr NUMERIC DEFAULT 0,
  may NUMERIC DEFAULT 0,
  jun NUMERIC DEFAULT 0,
  jul NUMERIC DEFAULT 0,
  aug NUMERIC DEFAULT 0,
  sep NUMERIC DEFAULT 0,
  oct NUMERIC DEFAULT 0,
  nov NUMERIC DEFAULT 0,
  dec NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(indicator_id, user_id, year),
  CHECK (user_id IS NOT NULL OR team_id IS NOT NULL)
);

-- =====================================================
-- TABELA: book_indicator_config
-- Configuração de indicador no book (se é gestor, ordem, meta customizada)
-- =====================================================
CREATE TABLE public.book_indicator_config (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  book_id UUID NOT NULL REFERENCES public.books(id) ON DELETE CASCADE,
  indicator_id UUID NOT NULL REFERENCES public.backoffice_indicators(id) ON DELETE CASCADE,
  is_manager BOOLEAN DEFAULT false, -- Se pode editar ou só visualizar
  display_order INTEGER DEFAULT 0,
  -- Meta customizada (opcional, sobrescreve indicator_goals)
  custom_jan NUMERIC,
  custom_feb NUMERIC,
  custom_mar NUMERIC,
  custom_apr NUMERIC,
  custom_may NUMERIC,
  custom_jun NUMERIC,
  custom_jul NUMERIC,
  custom_aug NUMERIC,
  custom_sep NUMERIC,
  custom_oct NUMERIC,
  custom_nov NUMERIC,
  custom_dec NUMERIC,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(book_id, indicator_id)
);

-- =====================================================
-- TABELA: indicator_change_log
-- Histórico de alterações
-- =====================================================
CREATE TABLE public.indicator_change_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  indicator_id UUID NOT NULL REFERENCES public.backoffice_indicators(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id),
  action TEXT NOT NULL, -- 'created', 'updated', 'deleted', 'status_changed'
  field_changed TEXT,
  old_value TEXT,
  new_value TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- INDEXES
-- =====================================================
CREATE INDEX idx_backoffice_indicators_status ON public.backoffice_indicators(status);
CREATE INDEX idx_backoffice_indicators_format ON public.backoffice_indicators(format);
CREATE INDEX idx_backoffice_indicators_created_by ON public.backoffice_indicators(created_by);
CREATE INDEX idx_backoffice_indicators_active ON public.backoffice_indicators(is_active);

CREATE INDEX idx_indicator_goals_indicator ON public.indicator_goals(indicator_id);
CREATE INDEX idx_indicator_goals_user ON public.indicator_goals(user_id);
CREATE INDEX idx_indicator_goals_year ON public.indicator_goals(year);

CREATE INDEX idx_book_indicator_config_book ON public.book_indicator_config(book_id);
CREATE INDEX idx_book_indicator_config_indicator ON public.book_indicator_config(indicator_id);

CREATE INDEX idx_indicator_change_log_indicator ON public.indicator_change_log(indicator_id);
CREATE INDEX idx_indicator_change_log_created ON public.indicator_change_log(created_at DESC);

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Atualizar updated_at
CREATE TRIGGER update_backoffice_indicators_updated_at 
  BEFORE UPDATE ON public.backoffice_indicators
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_indicator_goals_updated_at 
  BEFORE UPDATE ON public.indicator_goals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_book_indicator_config_updated_at 
  BEFORE UPDATE ON public.book_indicator_config
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger para registrar mudanças no log
CREATE OR REPLACE FUNCTION log_indicator_changes()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'INSERT') THEN
    INSERT INTO public.indicator_change_log (indicator_id, user_id, action, new_value)
    VALUES (NEW.id, NEW.created_by, 'created', row_to_json(NEW)::text);
    RETURN NEW;
  ELSIF (TG_OP = 'UPDATE') THEN
    -- Log status change
    IF OLD.status != NEW.status THEN
      INSERT INTO public.indicator_change_log (indicator_id, user_id, action, field_changed, old_value, new_value)
      VALUES (NEW.id, NEW.created_by, 'status_changed', 'status', OLD.status::text, NEW.status::text);
    END IF;
    -- Log other changes
    IF OLD != NEW THEN
      INSERT INTO public.indicator_change_log (indicator_id, user_id, action, old_value, new_value)
      VALUES (NEW.id, NEW.created_by, 'updated', row_to_json(OLD)::text, row_to_json(NEW)::text);
    END IF;
    RETURN NEW;
  ELSIF (TG_OP = 'DELETE') THEN
    INSERT INTO public.indicator_change_log (indicator_id, user_id, action, old_value)
    VALUES (OLD.id, OLD.created_by, 'deleted', row_to_json(OLD)::text);
    RETURN OLD;
  END IF;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER log_backoffice_indicator_changes
  AFTER INSERT OR UPDATE OR DELETE ON public.backoffice_indicators
  FOR EACH ROW EXECUTE FUNCTION log_indicator_changes();

-- =====================================================
-- RLS POLICIES
-- =====================================================

ALTER TABLE public.backoffice_indicators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.indicator_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.indicator_tag_relations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.indicator_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.book_indicator_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.indicator_change_log ENABLE ROW LEVEL SECURITY;

-- Admins podem tudo
CREATE POLICY "Admins full access indicators" ON public.backoffice_indicators
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins full access tags" ON public.indicator_tags
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins full access tag relations" ON public.indicator_tag_relations
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins full access goals" ON public.indicator_goals
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins full access book config" ON public.book_indicator_config
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins full access change log" ON public.indicator_change_log
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- =====================================================
-- VIEWS
-- =====================================================

-- View para indicadores com estatísticas
CREATE OR REPLACE VIEW public.indicators_with_stats AS
SELECT 
  i.*,
  u.full_name as created_by_name,
  (
    SELECT COUNT(DISTINCT book_id)
    FROM public.book_indicator_config
    WHERE indicator_id = i.id
  ) as total_books,
  (
    SELECT COALESCE(
      json_agg(
        json_build_object(
          'id', t.id,
          'name', t.name,
          'color', t.color
        )
      ) FILTER (WHERE t.id IS NOT NULL),
      '[]'::json
    )
    FROM public.indicator_tag_relations itr
    LEFT JOIN public.indicator_tags t ON itr.tag_id = t.id
    WHERE itr.indicator_id = i.id
  ) as tags
FROM public.backoffice_indicators i
LEFT JOIN public.users u ON i.created_by = u.id
WHERE i.is_active = true;

-- =====================================================
-- SEED DATA (Tags padrão)
-- =====================================================

INSERT INTO public.indicator_tags (name, color) VALUES
  ('Financeiro', '#d42126'),
  ('Operacional', '#666666'),
  ('Estratégico', '#4b4b4b'),
  ('Qualidade', '#999999'),
  ('Produtividade', '#666666')
ON CONFLICT (name) DO NOTHING;

