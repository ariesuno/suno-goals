# Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto com as seguintes variáveis:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Admin Configuration
ADMIN_EMAILS=admin1@suno.com.br,admin2@suno.com.br
```

## Como obter as credenciais do Supabase:

1. Acesse https://supabase.com
2. Crie um novo projeto
3. Vá em Settings > API
4. Copie:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - anon/public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - service_role key → `SUPABASE_SERVICE_ROLE_KEY`

## Configuração de Admins:

Liste os emails dos admins do FP&A separados por vírgula em `ADMIN_EMAILS`.

