-- =====================================================================================================================
-- SEED DATA MOCK PARA TESTES
-- =====================================================================================================================
-- Este script cria dados de teste para o sistema de Books e Indicadores
-- Execute após rodar os scripts de schema e indicators_module

-- =====================================================================================================================
-- 1. USUÁRIOS MOCK
-- =====================================================================================================================

-- Admins FP&A
INSERT INTO public.users (id, email, name, role, created_at) VALUES
  ('11111111-1111-1111-1111-111111111111', 'admin@suno.com.br', 'Admin FP&A', 'admin', NOW()),
  ('22222222-2222-2222-2222-222222222222', 'ana.silva@suno.com.br', 'Ana Silva', 'admin', NOW())
ON CONFLICT (id) DO NOTHING;

-- Managers
INSERT INTO public.users (id, email, name, role, created_at) VALUES
  ('33333333-3333-3333-3333-333333333333', 'allan.silva@suno.com.br', 'Allan Silva', 'manager', NOW()),
  ('44444444-4444-4444-4444-444444444444', 'maria.santos@suno.com.br', 'Maria Santos', 'manager', NOW()),
  ('55555555-5555-5555-5555-555555555555', 'pedro.costa@suno.com.br', 'Pedro Costa', 'manager', NOW()),
  ('66666666-6666-6666-6666-666666666666', 'julia.oliveira@suno.com.br', 'Julia Oliveira', 'manager', NOW())
ON CONFLICT (id) DO NOTHING;

-- Usuários regulares
INSERT INTO public.users (id, email, name, role, created_at) VALUES
  ('77777777-7777-7777-7777-777777777777', 'carlos.mendes@suno.com.br', 'Carlos Mendes', 'user', NOW()),
  ('88888888-8888-8888-8888-888888888888', 'fernanda.lima@suno.com.br', 'Fernanda Lima', 'user', NOW()),
  ('99999999-9999-9999-9999-999999999999', 'roberto.alves@suno.com.br', 'Roberto Alves', 'user', NOW()),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'patricia.rocha@suno.com.br', 'Patricia Rocha', 'user', NOW())
ON CONFLICT (id) DO NOTHING;

-- =====================================================================================================================
-- 2. INDICADORES MOCK
-- =====================================================================================================================

INSERT INTO public.backoffice_indicators (id, name, description, notes, format, direction, status, aggregation_type, created_by, created_at, updated_at) VALUES
  -- Indicadores Estratégicos
  ('ind-001', 'Leads Qualificados Status Invest', 'Número de leads qualificados pelo time de vendas do Status Invest', 'Considerar apenas leads com score > 70', 'number', 'up', 'validated', 'sum', '11111111-1111-1111-1111-111111111111', NOW(), NOW()),
  ('ind-002', 'Taxa de Conversão Advisory', 'Percentual de leads que se tornam clientes no Advisory', NULL, 'percentage', 'up', 'validated', 'average', '11111111-1111-1111-1111-111111111111', NOW(), NOW()),
  ('ind-003', 'Budget Utilizado - Research', 'Valor total do orçamento utilizado pela área de Research', 'Incluir todas as despesas operacionais', 'currency', 'down', 'validated', 'sum', '11111111-1111-1111-1111-111111111111', NOW(), NOW()),
  ('ind-004', 'Média de Atingimento - Marketing Makers', 'Média de atingimento de todos os indicadores do Marketing Makers', NULL, 'percentage', 'up', 'validated', 'average', '11111111-1111-1111-1111-111111111111', NOW(), NOW()),
  ('ind-005', 'Qualidade de Código - Tecnologia', 'Score de qualidade do código (SonarQube) da área de Tecnologia', NULL, 'percentage', 'up', 'in_construction', 'average', '11111111-1111-1111-1111-111111111111', NOW(), NOW()),
  ('ind-006', 'Compliance - Eleven', 'Indicadores de compliance e conformidade regulatória do Eleven', NULL, 'percentage', 'up', 'under_review', 'average', '11111111-1111-1111-1111-111111111111', NOW(), NOW()),
  ('ind-007', 'Produção de Conteúdo - Mídias', 'Volume de conteúdo produzido pela área de Mídias', NULL, 'number', 'up', 'validated', 'sum', '11111111-1111-1111-1111-111111111111', NOW(), NOW()),
  ('ind-008', 'NPS Clientes Advisory', 'Net Promoter Score dos clientes do Advisory', 'Pesquisa trimestral', 'number', 'up', 'validated', 'average', '11111111-1111-1111-1111-111111111111', NOW(), NOW()),
  ('ind-009', 'Churn Rate Status Invest', 'Taxa de cancelamento de assinaturas do Status Invest', NULL, 'percentage', 'down', 'validated', 'average', '11111111-1111-1111-1111-111111111111', NOW(), NOW()),
  ('ind-010', 'Tempo Médio de Resposta - Atendimento', 'Tempo médio para primeira resposta no atendimento', 'Meta em horas', 'hours', 'down', 'validated', 'average', '11111111-1111-1111-1111-111111111111', NOW(), NOW()),
  ('ind-011', 'Receita Recorrente Mensal (MRR)', 'Receita recorrente mensal consolidada', NULL, 'currency', 'up', 'validated', 'sum', '11111111-1111-1111-1111-111111111111', NOW(), NOW()),
  ('ind-012', 'Engajamento Social Media', 'Taxa de engajamento nas redes sociais', 'Média de likes, comments, shares', 'percentage', 'up', 'validated', 'average', '11111111-1111-1111-1111-111111111111', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- =====================================================================================================================
-- 3. TAGS DOS INDICADORES
-- =====================================================================================================================

-- Relacionar indicadores com tags
INSERT INTO public.backoffice_indicator_tag_relations (indicator_id, tag_id) 
SELECT 'ind-001', id FROM public.backoffice_indicator_tags WHERE name = 'Operacional'
UNION ALL SELECT 'ind-001', id FROM public.backoffice_indicator_tags WHERE name = 'Status Invest'
UNION ALL SELECT 'ind-001', id FROM public.backoffice_indicator_tags WHERE name = 'Vendas Ativas'

UNION ALL SELECT 'ind-002', id FROM public.backoffice_indicator_tags WHERE name = 'Estratégico'
UNION ALL SELECT 'ind-002', id FROM public.backoffice_indicator_tags WHERE name = 'Advisory'
UNION ALL SELECT 'ind-002', id FROM public.backoffice_indicator_tags WHERE name = 'Inbound'

UNION ALL SELECT 'ind-003', id FROM public.backoffice_indicator_tags WHERE name = 'Operacional'
UNION ALL SELECT 'ind-003', id FROM public.backoffice_indicator_tags WHERE name = 'Research'
UNION ALL SELECT 'ind-003', id FROM public.backoffice_indicator_tags WHERE name = 'Financeiro'

UNION ALL SELECT 'ind-004', id FROM public.backoffice_indicator_tags WHERE name = 'Estratégico'
UNION ALL SELECT 'ind-004', id FROM public.backoffice_indicator_tags WHERE name = 'Marketing Makers'
UNION ALL SELECT 'ind-004', id FROM public.backoffice_indicator_tags WHERE name = 'Marketing'

UNION ALL SELECT 'ind-005', id FROM public.backoffice_indicator_tags WHERE name = 'Operacional'
UNION ALL SELECT 'ind-005', id FROM public.backoffice_indicator_tags WHERE name = 'Tecnologia'

UNION ALL SELECT 'ind-006', id FROM public.backoffice_indicator_tags WHERE name = 'Estratégico'
UNION ALL SELECT 'ind-006', id FROM public.backoffice_indicator_tags WHERE name = 'Eleven'
UNION ALL SELECT 'ind-006', id FROM public.backoffice_indicator_tags WHERE name = 'Compliance'

UNION ALL SELECT 'ind-007', id FROM public.backoffice_indicator_tags WHERE name = 'Operacional'
UNION ALL SELECT 'ind-007', id FROM public.backoffice_indicator_tags WHERE name = 'Mídias'
UNION ALL SELECT 'ind-007', id FROM public.backoffice_indicator_tags WHERE name = 'Audio Visual'

UNION ALL SELECT 'ind-008', id FROM public.backoffice_indicator_tags WHERE name = 'Estratégico'
UNION ALL SELECT 'ind-008', id FROM public.backoffice_indicator_tags WHERE name = 'Advisory'
UNION ALL SELECT 'ind-008', id FROM public.backoffice_indicator_tags WHERE name = 'Atendimento'

UNION ALL SELECT 'ind-009', id FROM public.backoffice_indicator_tags WHERE name = 'Estratégico'
UNION ALL SELECT 'ind-009', id FROM public.backoffice_indicator_tags WHERE name = 'Status Invest'

UNION ALL SELECT 'ind-010', id FROM public.backoffice_indicator_tags WHERE name = 'Operacional'
UNION ALL SELECT 'ind-010', id FROM public.backoffice_indicator_tags WHERE name = 'Atendimento'

UNION ALL SELECT 'ind-011', id FROM public.backoffice_indicator_tags WHERE name = 'Estratégico'
UNION ALL SELECT 'ind-011', id FROM public.backoffice_indicator_tags WHERE name = 'Financeiro'

UNION ALL SELECT 'ind-012', id FROM public.backoffice_indicator_tags WHERE name = 'Operacional'
UNION ALL SELECT 'ind-012', id FROM public.backoffice_indicator_tags WHERE name = 'Mídias'
UNION ALL SELECT 'ind-012', id FROM public.backoffice_indicator_tags WHERE name = 'Social'
ON CONFLICT DO NOTHING;

-- =====================================================================================================================
-- 4. BOOKS MOCK
-- =====================================================================================================================

INSERT INTO public.backoffice_books (id, name, year, owner_type, owner_id, description, is_active, created_by, created_at, updated_at) VALUES
  ('book-001', 'Book Allan Silva - Head de Dados', 2025, 'person', '33333333-3333-3333-3333-333333333333', 'Book pessoal do Allan Silva, focado em dados e CRM', true, '11111111-1111-1111-1111-111111111111', NOW(), NOW()),
  ('book-002', 'Book Maria Santos - Gerente de Produtos', 2025, 'person', '44444444-4444-4444-4444-444444444444', 'Book da Maria Santos, focado em produtos e conteúdo', true, '11111111-1111-1111-1111-111111111111', NOW(), NOW()),
  ('book-003', 'Book Pedro Costa - Diretor Comercial', 2025, 'person', '55555555-5555-5555-5555-555555555555', 'Book do Pedro Costa, focado em vendas e conversão', true, '11111111-1111-1111-1111-111111111111', NOW(), NOW()),
  ('book-004', 'Book Julia Oliveira - Head de Compliance', 2025, 'person', '66666666-6666-6666-6666-666666666666', 'Book da Julia Oliveira, focado em compliance e regulatório', true, '11111111-1111-1111-1111-111111111111', NOW(), NOW()),
  ('book-005', 'Book Time de Tecnologia', 2025, 'team', '33333333-3333-3333-3333-333333333333', 'Book consolidado do time de tecnologia', true, '11111111-1111-1111-1111-111111111111', NOW(), NOW()),
  ('book-006', 'Book Time de Marketing', 2025, 'team', '44444444-4444-4444-4444-444444444444', 'Book consolidado do time de marketing', true, '11111111-1111-1111-1111-111111111111', NOW(), NOW()),
  ('book-007', 'Book Carlos Mendes - Analista', 2025, 'person', '77777777-7777-7777-7777-777777777777', 'Book do Carlos Mendes, analista de dados', true, '11111111-1111-1111-1111-111111111111', NOW(), NOW()),
  ('book-008', 'Book Fernanda Lima - Coordenadora', 2025, 'person', '88888888-8888-8888-8888-888888888888', 'Book da Fernanda Lima, coordenadora de atendimento', true, '11111111-1111-1111-1111-111111111111', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- =====================================================================================================================
-- 5. INDICADORES NOS BOOKS (com metas mensais)
-- =====================================================================================================================

-- Book 001: Allan Silva (3 indicadores)
INSERT INTO public.backoffice_book_indicators (book_id, indicator_id, display_order, meta_jan, meta_feb, meta_mar, meta_apr, meta_may, meta_jun, meta_jul, meta_aug, meta_sep, meta_oct, meta_nov, meta_dec, valid_from_quarter, valid_to_quarter) VALUES
  ('book-001', 'ind-001', 1, 100, 110, 120, 130, 140, 150, 160, 170, 180, 190, 200, 210, 1, 4),
  ('book-001', 'ind-002', 2, 20, 22, 24, 25, 26, 28, 30, 32, 34, 36, 38, 40, 1, 4),
  ('book-001', 'ind-009', 3, 5, 4.8, 4.5, 4.2, 4, 3.8, 3.5, 3.2, 3, 2.8, 2.5, 2, 1, 4)
ON CONFLICT DO NOTHING;

-- Book 002: Maria Santos (4 indicadores, alguns sem metas)
INSERT INTO public.backoffice_book_indicators (book_id, indicator_id, display_order, meta_jan, meta_feb, meta_mar, meta_apr, meta_may, meta_jun, meta_jul, meta_aug, meta_sep, meta_oct, meta_nov, meta_dec, valid_from_quarter, valid_to_quarter) VALUES
  ('book-002', 'ind-007', 1, 5, 6, 7, 8, 9, 10, NULL, NULL, NULL, NULL, NULL, NULL, 1, 2),
  ('book-002', 'ind-012', 2, 3.5, 3.8, 4.0, 4.2, 4.5, 4.8, 5.0, 5.2, 5.5, 5.8, 6.0, 6.5, 1, 4),
  ('book-002', 'ind-004', 3, 80, 82, 85, 87, 90, 92, 94, 95, 96, 97, 98, 99, 1, 4),
  ('book-002', 'ind-008', 4, 70, 72, 75, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1)
ON CONFLICT DO NOTHING;

-- Book 003: Pedro Costa (5 indicadores)
INSERT INTO public.backoffice_book_indicators (book_id, indicator_id, display_order, meta_jan, meta_feb, meta_mar, meta_apr, meta_may, meta_jun, meta_jul, meta_aug, meta_sep, meta_oct, meta_nov, meta_dec, valid_from_quarter, valid_to_quarter) VALUES
  ('book-003', 'ind-001', 1, 150, 160, 170, 180, 190, 200, 210, 220, 230, 240, 250, 260, 1, 4),
  ('book-003', 'ind-002', 2, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 1, 4),
  ('book-003', 'ind-008', 3, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 1, 4),
  ('book-003', 'ind-009', 4, 4, 3.8, 3.6, 3.4, 3.2, 3, 2.8, 2.6, 2.4, 2.2, 2, 1.8, 1, 4),
  ('book-003', 'ind-011', 5, 500000, 520000, 540000, 560000, 580000, 600000, 620000, 640000, 660000, 680000, 700000, 720000, 1, 4)
ON CONFLICT DO NOTHING;

-- Book 004: Julia Oliveira (2 indicadores)
INSERT INTO public.backoffice_book_indicators (book_id, indicator_id, display_order, meta_jan, meta_feb, meta_mar, meta_apr, meta_may, meta_jun, meta_jul, meta_aug, meta_sep, meta_oct, meta_nov, meta_dec, valid_from_quarter, valid_to_quarter) VALUES
  ('book-004', 'ind-006', 1, 95, 96, 97, 98, 99, 100, 100, 100, 100, 100, 100, 100, 1, 4),
  ('book-004', 'ind-010', 2, 4, 3.8, 3.6, 3.4, 3.2, 3, 2.8, 2.6, 2.4, 2.2, 2, 1.8, 1, 4)
ON CONFLICT DO NOTHING;

-- Book 005: Time de Tecnologia (3 indicadores)
INSERT INTO public.backoffice_book_indicators (book_id, indicator_id, display_order, meta_jan, meta_feb, meta_mar, meta_apr, meta_may, meta_jun, meta_jul, meta_aug, meta_sep, meta_oct, meta_nov, meta_dec, valid_from_quarter, valid_to_quarter) VALUES
  ('book-005', 'ind-005', 1, 90, 92, 93, 94, 95, 96, 97, 98, 99, 100, 100, 100, 1, 4),
  ('book-005', 'ind-010', 2, 3.5, 3.3, 3.1, 2.9, 2.7, 2.5, 2.3, 2.1, 1.9, 1.7, 1.5, 1.3, 1, 4),
  ('book-005', 'ind-011', 3, 600000, 620000, 640000, 660000, 680000, 700000, 720000, 740000, 760000, 780000, 800000, 820000, 1, 4)
ON CONFLICT DO NOTHING;

-- Book 006: Time de Marketing (6 indicadores - máximo)
INSERT INTO public.backoffice_book_indicators (book_id, indicator_id, display_order, meta_jan, meta_feb, meta_mar, meta_apr, meta_may, meta_jun, meta_jul, meta_aug, meta_sep, meta_oct, meta_nov, meta_dec, valid_from_quarter, valid_to_quarter) VALUES
  ('book-006', 'ind-004', 1, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 1, 4),
  ('book-006', 'ind-007', 2, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 1, 4),
  ('book-006', 'ind-012', 3, 4, 4.2, 4.4, 4.6, 4.8, 5, 5.2, 5.4, 5.6, 5.8, 6, 6.2, 1, 4),
  ('book-006', 'ind-001', 4, 120, 130, 140, 150, 160, 170, 180, 190, 200, 210, 220, 230, 1, 4),
  ('book-006', 'ind-008', 5, 72, 74, 76, 78, 80, 82, 84, 86, 88, 90, 92, 94, 1, 4),
  ('book-006', 'ind-011', 6, 550000, 570000, 590000, 610000, 630000, 650000, 670000, 690000, 710000, 730000, 750000, 770000, 1, 4)
ON CONFLICT DO NOTHING;

-- Book 007: Carlos Mendes (1 indicador - mínimo)
INSERT INTO public.backoffice_book_indicators (book_id, indicator_id, display_order, meta_jan, meta_feb, meta_mar, meta_apr, meta_may, meta_jun, meta_jul, meta_aug, meta_sep, meta_oct, meta_nov, meta_dec, valid_from_quarter, valid_to_quarter) VALUES
  ('book-007', 'ind-001', 1, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100, 105, 1, 4)
ON CONFLICT DO NOTHING;

-- Book 008: Fernanda Lima (3 indicadores)
INSERT INTO public.backoffice_book_indicators (book_id, indicator_id, display_order, meta_jan, meta_feb, meta_mar, meta_apr, meta_may, meta_jun, meta_jul, meta_aug, meta_sep, meta_oct, meta_nov, meta_dec, valid_from_quarter, valid_to_quarter) VALUES
  ('book-008', 'ind-010', 1, 5, 4.8, 4.6, 4.4, 4.2, 4, 3.8, 3.6, 3.4, 3.2, 3, 2.8, 1, 4),
  ('book-008', 'ind-008', 2, 68, 70, 72, 74, 76, 78, 80, 82, 84, 86, 88, 90, 1, 4),
  ('book-008', 'ind-009', 3, 6, 5.5, 5, 4.5, 4, 3.5, 3, 2.5, 2, 1.5, 1, 0.5, 1, 4)
ON CONFLICT DO NOTHING;

-- =====================================================================================================================
-- 6. HISTÓRICO DE MUDANÇAS NOS BOOKS
-- =====================================================================================================================

INSERT INTO public.backoffice_book_history (book_id, quarter, year, indicators_snapshot, changes, changed_by, changed_at) VALUES
  ('book-001', 1, 2025, '["ind-001", "ind-002", "ind-009"]', '{"added": ["ind-001", "ind-002", "ind-009"]}', '11111111-1111-1111-1111-111111111111', NOW() - INTERVAL '30 days'),
  ('book-002', 1, 2025, '["ind-007", "ind-012", "ind-004", "ind-008"]', '{"added": ["ind-007", "ind-012", "ind-004", "ind-008"]}', '11111111-1111-1111-1111-111111111111', NOW() - INTERVAL '28 days'),
  ('book-003', 1, 2025, '["ind-001", "ind-002", "ind-008", "ind-009", "ind-011"]', '{"added": ["ind-001", "ind-002", "ind-008", "ind-009", "ind-011"]}', '11111111-1111-1111-1111-111111111111', NOW() - INTERVAL '25 days'),
  ('book-004', 1, 2025, '["ind-006", "ind-010"]', '{"added": ["ind-006", "ind-010"]}', '11111111-1111-1111-1111-111111111111', NOW() - INTERVAL '20 days'),
  ('book-005', 1, 2025, '["ind-005", "ind-010", "ind-011"]', '{"added": ["ind-005", "ind-010", "ind-011"]}', '11111111-1111-1111-1111-111111111111', NOW() - INTERVAL '15 days'),
  ('book-006', 1, 2025, '["ind-004", "ind-007", "ind-012", "ind-001", "ind-008", "ind-011"]', '{"added": ["ind-004", "ind-007", "ind-012", "ind-001", "ind-008", "ind-011"]}', '11111111-1111-1111-1111-111111111111', NOW() - INTERVAL '10 days'),
  ('book-007', 1, 2025, '["ind-001"]', '{"added": ["ind-001"]}', '11111111-1111-1111-1111-111111111111', NOW() - INTERVAL '5 days'),
  ('book-008', 1, 2025, '["ind-010", "ind-008", "ind-009"]', '{"added": ["ind-010", "ind-008", "ind-009"]}', '11111111-1111-1111-1111-111111111111', NOW() - INTERVAL '3 days')
ON CONFLICT DO NOTHING;

-- =====================================================================================================================
-- 7. DADOS REALIZADOS (indicator_data) - Para simular performance
-- =====================================================================================================================

-- Dados para Janeiro (ind-001 do book-001)
INSERT INTO public.indicator_data (indicator_id, user_id, month, year, meta, realizado, created_at, updated_at) VALUES
  ('ind-001', '33333333-3333-3333-3333-333333333333', 1, 2025, 100, 105, NOW(), NOW()),
  ('ind-001', '33333333-3333-3333-3333-333333333333', 2, 2025, 110, 112, NOW(), NOW()),
  ('ind-001', '33333333-3333-3333-3333-333333333333', 3, 2025, 120, 118, NOW(), NOW()),
  
  ('ind-002', '33333333-3333-3333-3333-333333333333', 1, 2025, 20, 22, NOW(), NOW()),
  ('ind-002', '33333333-3333-3333-3333-333333333333', 2, 2025, 22, 21, NOW(), NOW()),
  ('ind-002', '33333333-3333-3333-3333-333333333333', 3, 2025, 24, 25, NOW(), NOW()),
  
  ('ind-009', '33333333-3333-3333-3333-333333333333', 1, 2025, 5, 4.8, NOW(), NOW()),
  ('ind-009', '33333333-3333-3333-3333-333333333333', 2, 2025, 4.8, 4.5, NOW(), NOW()),
  ('ind-009', '33333333-3333-3333-3333-333333333333', 3, 2025, 4.5, 4.2, NOW(), NOW())
ON CONFLICT DO NOTHING;

-- Dados para Pedro Costa (book-003) - Performance excelente
INSERT INTO public.indicator_data (indicator_id, user_id, month, year, meta, realizado, created_at, updated_at) VALUES
  ('ind-001', '55555555-5555-5555-5555-555555555555', 1, 2025, 150, 160, NOW(), NOW()),
  ('ind-001', '55555555-5555-5555-5555-555555555555', 2, 2025, 160, 170, NOW(), NOW()),
  ('ind-001', '55555555-5555-5555-5555-555555555555', 3, 2025, 170, 180, NOW(), NOW()),
  
  ('ind-002', '55555555-5555-5555-5555-555555555555', 1, 2025, 25, 28, NOW(), NOW()),
  ('ind-002', '55555555-5555-5555-5555-555555555555', 2, 2025, 26, 29, NOW(), NOW()),
  ('ind-002', '55555555-5555-5555-5555-555555555555', 3, 2025, 27, 30, NOW(), NOW())
ON CONFLICT DO NOTHING;

-- Dados para Maria Santos (book-002) - Performance crítica
INSERT INTO public.indicator_data (indicator_id, user_id, month, year, meta, realizado, created_at, updated_at) VALUES
  ('ind-007', '44444444-4444-4444-4444-444444444444', 1, 2025, 5, 3, NOW(), NOW()),
  ('ind-007', '44444444-4444-4444-4444-444444444444', 2, 2025, 6, 4, NOW(), NOW()),
  ('ind-007', '44444444-4444-4444-4444-444444444444', 3, 2025, 7, 5, NOW(), NOW())
ON CONFLICT DO NOTHING;

-- =====================================================================================================================
-- 8. AUDIT LOG - Algumas ações de exemplo
-- =====================================================================================================================

INSERT INTO public.audit_log (user_id, action, entity_type, entity_id, details, created_at) VALUES
  ('11111111-1111-1111-1111-111111111111', 'create', 'book', 'book-001', '{"name": "Book Allan Silva - Head de Dados"}', NOW() - INTERVAL '30 days'),
  ('11111111-1111-1111-1111-111111111111', 'create', 'book', 'book-002', '{"name": "Book Maria Santos - Gerente de Produtos"}', NOW() - INTERVAL '28 days'),
  ('11111111-1111-1111-1111-111111111111', 'create', 'indicator', 'ind-001', '{"name": "Leads Qualificados Status Invest"}', NOW() - INTERVAL '35 days'),
  ('11111111-1111-1111-1111-111111111111', 'update', 'indicator', 'ind-002', '{"field": "description", "old": null, "new": "Percentual de leads que se tornam clientes no Advisory"}', NOW() - INTERVAL '20 days'),
  ('33333333-3333-3333-3333-333333333333', 'update', 'indicator_data', 'ind-001', '{"month": 1, "year": 2025, "realizado": 105}', NOW() - INTERVAL '10 days')
ON CONFLICT DO NOTHING;

-- =====================================================================================================================
-- FIM DO SEED
-- =====================================================================================================================

-- Verificar dados inseridos
SELECT 'Usuários criados:', COUNT(*) FROM public.users;
SELECT 'Indicadores criados:', COUNT(*) FROM public.backoffice_indicators;
SELECT 'Books criados:', COUNT(*) FROM public.backoffice_books;
SELECT 'Indicadores em books:', COUNT(*) FROM public.backoffice_book_indicators;
SELECT 'Histórico de mudanças:', COUNT(*) FROM public.backoffice_book_history;
SELECT 'Dados realizados:', COUNT(*) FROM public.indicator_data;
SELECT 'Logs de auditoria:', COUNT(*) FROM public.audit_log;

