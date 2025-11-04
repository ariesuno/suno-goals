# 🌱 Guia de Seed - Dados Mock para Testes

Este guia explica como popular o banco de dados Supabase com dados de teste.

## 📋 Pré-requisitos

Antes de executar o seed, certifique-se de que:

1. ✅ Você já executou os scripts de schema:
   - `schema.sql` (tabelas principais)
   - `indicators_module.sql` (módulo de indicadores e books)

2. ✅ Você tem acesso ao **SQL Editor** do Supabase Dashboard

## 🚀 Como Executar o Seed

### Passo 1: Acesse o Supabase Dashboard

1. Vá para [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Selecione seu projeto
3. Clique em **SQL Editor** no menu lateral

### Passo 2: Execute o Script de Seed

1. Clique em **New Query**
2. Copie todo o conteúdo do arquivo `seed_mock_data.sql`
3. Cole no editor SQL
4. Clique em **Run** (ou pressione `Ctrl/Cmd + Enter`)

### Passo 3: Verifique os Dados

Execute estas queries para confirmar que os dados foram criados:

```sql
-- Verificar usuários
SELECT id, email, full_name, role, department FROM public.users;

-- Verificar indicadores
SELECT id, name, format, status FROM public.backoffice_indicators;

-- Verificar books
SELECT id, name, year, owner_type, is_active FROM public.backoffice_books;

-- Verificar indicadores nos books
SELECT 
  b.name as book_name,
  i.name as indicator_name,
  bi.meta_jan, bi.meta_feb, bi.meta_mar
FROM public.backoffice_book_indicators bi
JOIN public.backoffice_books b ON b.id = bi.book_id
JOIN public.backoffice_indicators i ON i.id = bi.indicator_id
ORDER BY b.name, bi.display_order;
```

## 👥 Usuários Criados

### Credenciais de Login

**Senha padrão para todos:** `Suno@2025`

### Admins FP&A (2)

| Email | Nome | Departamento |
|-------|------|--------------|
| `admin@suno.com.br` | Admin FP&A | FP&A |
| `ana.silva@suno.com.br` | Ana Silva | FP&A |

### Managers (4)

| Email | Nome | Departamento |
|-------|------|--------------|
| `allan.silva@suno.com.br` | Allan Silva | Dados e CRM |
| `maria.santos@suno.com.br` | Maria Santos | Produtos |
| `pedro.costa@suno.com.br` | Pedro Costa | Comercial |
| `julia.oliveira@suno.com.br` | Julia Oliveira | Compliance |

### Employees (4)

| Email | Nome | Departamento | Manager |
|-------|------|--------------|---------|
| `carlos.mendes@suno.com.br` | Carlos Mendes | Dados e CRM | Allan Silva |
| `fernanda.lima@suno.com.br` | Fernanda Lima | Atendimento | Pedro Costa |
| `roberto.alves@suno.com.br` | Roberto Alves | Produtos | Maria Santos |
| `patricia.rocha@suno.com.br` | Patricia Rocha | Compliance | Julia Oliveira |

## 📊 Dados Criados

### Indicadores (12)

1. **Leads Qualificados Status Invest** (number, up)
2. **Taxa de Conversão Advisory** (percentage, up)
3. **Budget Utilizado - Research** (currency, down)
4. **Média de Atingimento - Marketing Makers** (percentage, up)
5. **Qualidade de Código - Tecnologia** (percentage, up)
6. **Compliance - Eleven** (percentage, up)
7. **Produção de Conteúdo - Mídias** (number, up)
8. **NPS Clientes Advisory** (number, up)
9. **Churn Rate Status Invest** (percentage, down)
10. **Tempo Médio de Resposta - Atendimento** (hours, down)
11. **Receita Recorrente Mensal (MRR)** (currency, up)
12. **Engajamento Social Media** (percentage, up)

### Books (8)

| ID | Nome | Owner | Tipo | Indicadores | Status |
|----|------|-------|------|-------------|--------|
| book-001 | Book Allan Silva | Allan Silva | person | 3 | ✅ Todas metas ok |
| book-002 | Book Maria Santos | Maria Santos | person | 4 | ⚠️ Metas faltantes |
| book-003 | Book Pedro Costa | Pedro Costa | person | 5 | ✅ Performance excelente |
| book-004 | Book Julia Oliveira | Julia Oliveira | person | 2 | ✅ Compliance |
| book-005 | Book Time de Tecnologia | Allan Silva | team | 3 | ✅ Team book |
| book-006 | Book Time de Marketing | Maria Santos | team | 6 | ✅ Máximo (6 ind) |
| book-007 | Book Carlos Mendes | Carlos Mendes | person | 1 | ✅ Mínimo (1 ind) |
| book-008 | Book Fernanda Lima | Fernanda Lima | person | 3 | ✅ Atendimento |

### Casos de Teste Incluídos

- ✅ **Mínimo de indicadores**: book-007 (1 indicador)
- ✅ **Máximo de indicadores**: book-006 (6 indicadores)
- ✅ **Metas faltantes**: book-002 (alguns meses sem meta)
- ✅ **Performance excelente**: book-003 (100%+ de atingimento)
- ✅ **Books de time**: book-005 e book-006
- ✅ **Hierarquia manager/employee**: Todos os employees têm managers
- ✅ **Dados realizados**: Janeiro, Fevereiro e Março preenchidos
- ✅ **Histórico de mudanças**: Q1 2025 registrado
- ✅ **Audit log**: Ações de criação/update registradas

## 🧪 Testando o Sistema

Após executar o seed, você pode:

### 1. Fazer Login como Admin

```
Email: admin@suno.com.br
Senha: Suno@2025
```

Acesse: `http://localhost:3000/admin/backoffice/books`

### 2. Visualizar Books

- Veja os 8 books criados
- Clique em um card para ver detalhes
- Teste o botão "Ver como Usuário"
- Edite metas de indicadores
- Remova indicadores (mínimo 1)

### 3. Visualizar Indicadores

Acesse: `http://localhost:3000/admin/backoffice/indicators`

- Veja os 12 indicadores
- Filtre por status, formato, tags
- Abra o drawer de detalhes
- Edite informações inline

### 4. Criar Novo Book

- Clique em "Novo Book"
- Siga o wizard de 4 passos
- Selecione indicadores existentes
- Defina metas mensais

## 🔄 Resetar os Dados

Se precisar limpar e recriar os dados:

```sql
-- CUIDADO: Isso apaga TODOS os dados!

-- Limpar dados
TRUNCATE TABLE public.audit_log CASCADE;
TRUNCATE TABLE public.indicator_data CASCADE;
TRUNCATE TABLE public.backoffice_book_history CASCADE;
TRUNCATE TABLE public.backoffice_book_indicators CASCADE;
TRUNCATE TABLE public.backoffice_books CASCADE;
TRUNCATE TABLE public.backoffice_indicator_tag_relations CASCADE;
TRUNCATE TABLE public.backoffice_indicators CASCADE;
TRUNCATE TABLE public.users CASCADE;

-- Limpar auth (cuidado!)
DELETE FROM auth.identities WHERE user_id IN (
  '11111111-1111-1111-1111-111111111111',
  '22222222-2222-2222-2222-222222222222',
  '33333333-3333-3333-3333-333333333333',
  '44444444-4444-4444-4444-444444444444',
  '55555555-5555-5555-5555-555555555555',
  '66666666-6666-6666-6666-666666666666',
  '77777777-7777-7777-7777-777777777777',
  '88888888-8888-8888-8888-888888888888',
  '99999999-9999-9999-9999-999999999999',
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'
);

DELETE FROM auth.users WHERE id IN (
  '11111111-1111-1111-1111-111111111111',
  '22222222-2222-2222-2222-222222222222',
  '33333333-3333-3333-3333-333333333333',
  '44444444-4444-4444-4444-444444444444',
  '55555555-5555-5555-5555-555555555555',
  '66666666-6666-6666-6666-666666666666',
  '77777777-7777-7777-7777-777777777777',
  '88888888-8888-8888-8888-888888888888',
  '99999999-9999-9999-9999-999999999999',
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'
);

-- Depois execute o seed novamente
```

## ⚠️ Notas Importantes

1. **Senha Padrão**: Todos os usuários têm a senha `Suno@2025`. Mude em produção!
2. **IDs Fixos**: Os UUIDs são fixos para facilitar testes. Em produção, use `gen_random_uuid()`.
3. **RLS**: Certifique-se de que as políticas RLS estão ativas para segurança.
4. **Auth Schema**: O script insere diretamente em `auth.users` e `auth.identities`. Isso só funciona no Supabase SQL Editor com permissões adequadas.

## 🐛 Problemas Comuns

### Erro: "column name does not exist"

**Solução**: Use `full_name` em vez de `name` na tabela `users`.

### Erro: "violates foreign key constraint"

**Solução**: Execute os scripts na ordem correta:
1. `schema.sql`
2. `indicators_module.sql`
3. `seed_mock_data.sql`

### Erro: "permission denied for schema auth"

**Solução**: Execute o script no **SQL Editor do Supabase Dashboard**, não via cliente JavaScript.

### Usuários não conseguem fazer login

**Solução**: Verifique se os usuários foram criados em `auth.users`:

```sql
SELECT id, email, email_confirmed_at FROM auth.users;
```

## 📚 Próximos Passos

Após popular o banco com dados mock:

1. ✅ Teste todas as funcionalidades do backoffice
2. ✅ Valide os cálculos de performance
3. ✅ Teste os filtros e buscas
4. ✅ Verifique as permissões (RLS)
5. ✅ Conecte o frontend ao Supabase real
6. ✅ Substitua mock data por queries reais

---

**Dúvidas?** Consulte a documentação do Supabase: https://supabase.com/docs

