-- =====================================================
-- SUNO GOALS - DATABASE SCHEMA
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- USERS & ROLES
-- =====================================================

-- User roles enum
CREATE TYPE user_role AS ENUM ('admin', 'manager', 'employee');

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role user_role DEFAULT 'employee',
  department TEXT,
  manager_id UUID REFERENCES public.users(id),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- INDICATORS
-- =====================================================

-- Indicator direction enum
CREATE TYPE indicator_direction AS ENUM ('up', 'down');

-- Indicator unit enum
CREATE TYPE indicator_unit AS ENUM ('%', '#', 'R$', 'H$');

-- Indicators table
CREATE TABLE public.indicators (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  unit indicator_unit NOT NULL,
  direction indicator_direction NOT NULL,
  is_editable BOOLEAN DEFAULT true,
  owner_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  created_by UUID REFERENCES public.users(id),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- INDICATOR DATA (Monthly values)
-- =====================================================

CREATE TABLE public.indicator_data (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  indicator_id UUID NOT NULL REFERENCES public.indicators(id) ON DELETE CASCADE,
  year INTEGER NOT NULL,
  month INTEGER NOT NULL CHECK (month >= 1 AND month <= 12),
  meta NUMERIC NOT NULL DEFAULT 0,
  real NUMERIC NOT NULL DEFAULT 0,
  percentage NUMERIC GENERATED ALWAYS AS (
    CASE 
      WHEN meta = 0 THEN 0 
      ELSE ROUND((real / meta) * 100, 0)
    END
  ) STORED,
  updated_by UUID REFERENCES public.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(indicator_id, year, month)
);

-- =====================================================
-- BOOKS (Indicator collections per user)
-- =====================================================

CREATE TABLE public.books (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  last_update TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(owner_id, name)
);

-- Book indicators (many-to-many)
CREATE TABLE public.book_indicators (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  book_id UUID NOT NULL REFERENCES public.books(id) ON DELETE CASCADE,
  indicator_id UUID NOT NULL REFERENCES public.indicators(id) ON DELETE CASCADE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(book_id, indicator_id)
);

-- =====================================================
-- AUDIT LOG
-- =====================================================

CREATE TABLE public.audit_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id),
  action TEXT NOT NULL,
  table_name TEXT NOT NULL,
  record_id UUID,
  old_data JSONB,
  new_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- INDEXES
-- =====================================================

CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_manager ON public.users(manager_id);
CREATE INDEX idx_users_role ON public.users(role);

CREATE INDEX idx_indicators_owner ON public.indicators(owner_id);
CREATE INDEX idx_indicators_active ON public.indicators(is_active);

CREATE INDEX idx_indicator_data_indicator ON public.indicator_data(indicator_id);
CREATE INDEX idx_indicator_data_year_month ON public.indicator_data(year, month);

CREATE INDEX idx_books_owner ON public.books(owner_id);
CREATE INDEX idx_book_indicators_book ON public.book_indicators(book_id);
CREATE INDEX idx_book_indicators_indicator ON public.book_indicators(indicator_id);

CREATE INDEX idx_audit_log_user ON public.audit_log(user_id);
CREATE INDEX idx_audit_log_table ON public.audit_log(table_name);
CREATE INDEX idx_audit_log_created ON public.audit_log(created_at);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.indicators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.indicator_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.book_indicators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view their own data" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admins can view all users" ON public.users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can insert users" ON public.users
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update users" ON public.users
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Indicators policies
CREATE POLICY "Users can view their own indicators" ON public.indicators
  FOR SELECT USING (
    auth.uid() = owner_id OR
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role IN ('admin', 'manager')
    )
  );

CREATE POLICY "Users can update their editable indicators" ON public.indicator_data
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.indicators i
      WHERE i.id = indicator_id 
      AND i.owner_id = auth.uid()
      AND i.is_editable = true
    )
  );

CREATE POLICY "Admins can manage all indicators" ON public.indicators
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Books policies
CREATE POLICY "Users can view their own books" ON public.books
  FOR SELECT USING (
    auth.uid() = owner_id OR
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role IN ('admin', 'manager')
    )
  );

CREATE POLICY "Admins can manage all books" ON public.books
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Audit log policies
CREATE POLICY "Admins can view audit log" ON public.audit_log
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- =====================================================
-- FUNCTIONS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_indicators_updated_at BEFORE UPDATE ON public.indicators
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_indicator_data_updated_at BEFORE UPDATE ON public.indicator_data
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_books_updated_at BEFORE UPDATE ON public.books
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update book last_update when indicator data changes
CREATE OR REPLACE FUNCTION update_book_last_update()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.books
  SET last_update = NOW()
  WHERE id IN (
    SELECT book_id FROM public.book_indicators
    WHERE indicator_id = NEW.indicator_id
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_book_on_data_change AFTER INSERT OR UPDATE ON public.indicator_data
  FOR EACH ROW EXECUTE FUNCTION update_book_last_update();

-- =====================================================
-- VIEWS
-- =====================================================

-- View for complete indicator data with accumulated values
CREATE OR REPLACE VIEW public.indicator_summary AS
SELECT 
  i.id,
  i.name,
  i.unit,
  i.direction,
  i.is_editable,
  i.owner_id,
  u.full_name as owner_name,
  u.email as owner_email,
  COALESCE(
    json_agg(
      json_build_object(
        'year', id.year,
        'month', id.month,
        'meta', id.meta,
        'real', id.real,
        'percentage', id.percentage
      ) ORDER BY id.year, id.month
    ) FILTER (WHERE id.id IS NOT NULL),
    '[]'::json
  ) as data
FROM public.indicators i
LEFT JOIN public.indicator_data id ON i.id = id.indicator_id
LEFT JOIN public.users u ON i.owner_id = u.id
WHERE i.is_active = true
GROUP BY i.id, i.name, i.unit, i.direction, i.is_editable, i.owner_id, u.full_name, u.email;

-- =====================================================
-- SEED DATA (Optional - for testing)
-- =====================================================

-- This will be populated after first admin user signs up

