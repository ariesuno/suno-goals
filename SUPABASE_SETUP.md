# 🚀 Configuração do Supabase

Este guia mostra como configurar o Supabase para o Suno Goals.

## 📋 Pré-requisitos

- Conta no [Supabase](https://supabase.com)
- Node.js instalado

## 🔧 Passo a Passo

### 1. Criar Projeto no Supabase

1. Acesse https://supabase.com
2. Clique em "New Project"
3. Preencha:
   - **Name**: `suno-goals`
   - **Database Password**: Escolha uma senha forte
   - **Region**: South America (São Paulo) - `sa-east-1`
4. Clique em "Create new project"
5. Aguarde a criação (pode levar alguns minutos)

### 2. Obter Credenciais

1. No painel do projeto, vá em **Settings** > **API**
2. Copie as seguintes informações:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key** → `SUPABASE_SERVICE_ROLE_KEY` (clique em "Reveal")

### 3. Configurar Variáveis de Ambiente

1. Crie um arquivo `.env.local` na raiz do projeto:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-anon-key-aqui
SUPABASE_SERVICE_ROLE_KEY=sua-service-role-key-aqui

# Admin Configuration
ADMIN_EMAILS=seu-email@suno.com.br,outro-admin@suno.com.br
```

2. **IMPORTANTE**: Nunca commite o arquivo `.env.local` no Git!

### 4. Executar o Schema SQL

1. No painel do Supabase, vá em **SQL Editor**
2. Clique em "New query"
3. Copie todo o conteúdo do arquivo `supabase/schema.sql`
4. Cole no editor SQL
5. Clique em "Run" (ou pressione Ctrl/Cmd + Enter)
6. Aguarde a execução (deve aparecer "Success")

### 5. Configurar Autenticação

1. No painel do Supabase, vá em **Authentication** > **Providers**
2. Habilite **Email** provider (já deve estar habilitado)
3. Em **Authentication** > **URL Configuration**, configure:
   - **Site URL**: `http://localhost:3000` (desenvolvimento)
   - **Redirect URLs**: 
     - `http://localhost:3000/login`
     - `http://localhost:3000/admin/backoffice`

### 6. Criar Primeiro Usuário Admin

⚠️ **IMPORTANTE**: Siga o guia detalhado em `supabase/create_first_admin.md`

**Resumo rápido:**

1. **Authentication** > **Users** > **Add user**
   - Email: seu-email@suno.com.br
   - Password: sua-senha
   - ✅ Auto Confirm User

2. **Copie o UUID** do usuário criado

3. **SQL Editor** > Execute:
```sql
INSERT INTO public.users (id, email, full_name, role, is_active)
VALUES (
  'COLE-O-UUID-REAL-AQUI'::uuid,  -- ⚠️ Substitua pelo UUID copiado!
  'seu-email@suno.com.br',
  'Seu Nome Completo',
  'admin',
  true
);
```

4. Adicione o email em `.env.local`:
```env
ADMIN_EMAILS=seu-email@suno.com.br
```

📚 **Guia completo com troubleshooting**: `supabase/create_first_admin.md`

### 7. Testar a Aplicação

1. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

2. Acesse http://localhost:3000/login

3. Faça login com as credenciais criadas

4. Você deve ser redirecionado para http://localhost:3000/admin/backoffice

## 🔒 Segurança

### Row Level Security (RLS)

O schema já vem com políticas de RLS configuradas:

- ✅ Usuários só veem seus próprios dados
- ✅ Admins veem todos os dados
- ✅ Managers veem dados de suas equipes
- ✅ Indicadores editáveis só podem ser modificados pelos donos
- ✅ Audit log só acessível por admins

### Emails de Admin

Os emails configurados em `ADMIN_EMAILS` são usados para:
- Validação de acesso ao backoffice
- Criação de novos admins
- Notificações importantes

**Formato**: Separe múltiplos emails por vírgula
```
ADMIN_EMAILS=admin1@suno.com.br,admin2@suno.com.br,admin3@suno.com.br
```

## 📊 Estrutura do Banco de Dados

### Tabelas Principais

- **users**: Usuários do sistema (extends auth.users)
- **indicators**: Indicadores (KPIs)
- **indicator_data**: Dados mensais dos indicadores
- **books**: Books de indicadores por usuário
- **book_indicators**: Relação many-to-many entre books e indicadores
- **audit_log**: Log de auditoria de todas as ações

### Enums

- **user_role**: `admin`, `manager`, `employee`
- **indicator_direction**: `up` (maior é melhor), `down` (menor é melhor)
- **indicator_unit**: `%`, `#`, `R$`, `H$`

## 🚀 Deploy na Vercel

### 1. Conectar Repositório

1. Acesse https://vercel.com
2. Clique em "New Project"
3. Importe o repositório do GitHub

### 2. Configurar Variáveis de Ambiente

Na Vercel, vá em **Settings** > **Environment Variables** e adicione:

```
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-anon-key
SUPABASE_SERVICE_ROLE_KEY=sua-service-role-key
ADMIN_EMAILS=admin@suno.com.br
```

### 3. Atualizar URLs no Supabase

No Supabase, vá em **Authentication** > **URL Configuration** e adicione:

- **Site URL**: `https://seu-app.vercel.app`
- **Redirect URLs**: 
  - `https://seu-app.vercel.app/login`
  - `https://seu-app.vercel.app/admin/backoffice`

### 4. Deploy

1. Clique em "Deploy"
2. Aguarde o build
3. Acesse sua aplicação!

## 🆘 Troubleshooting

### Erro: "Invalid API key"
- ✅ Verifique se as variáveis de ambiente estão corretas
- ✅ Certifique-se de que o arquivo `.env.local` existe
- ✅ Reinicie o servidor de desenvolvimento

### Erro: "User not found"
- ✅ Certifique-se de que o usuário foi criado na tabela `users`
- ✅ Verifique se o UUID do usuário está correto
- ✅ Confirme que o email está em `ADMIN_EMAILS`

### Erro: "Unauthorized"
- ✅ Verifique se o role do usuário é `admin`
- ✅ Confirme que o email está em `ADMIN_EMAILS`
- ✅ Tente fazer logout e login novamente

### Erro de RLS
- ✅ Verifique se as políticas de RLS foram criadas
- ✅ Execute o schema SQL novamente
- ✅ Confirme que o usuário tem o role correto

## 📚 Próximos Passos

Agora que o Supabase está configurado, você pode:

1. ✅ Acessar o backoffice em `/admin/backoffice`
2. 🔨 Implementar CRUD de usuários
3. 🔨 Implementar CRUD de indicadores
4. 🔨 Implementar CRUD de books
5. 🔨 Implementar dashboard com dados reais
6. 🔨 Implementar sistema de notificações

## 🤝 Suporte

Se tiver dúvidas ou problemas:
1. Verifique a [documentação do Supabase](https://supabase.com/docs)
2. Verifique a [documentação do Next.js](https://nextjs.org/docs)
3. Entre em contato com o time de desenvolvimento

