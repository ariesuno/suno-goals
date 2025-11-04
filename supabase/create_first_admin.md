# 👤 Como Criar o Primeiro Usuário Admin

## ⚠️ IMPORTANTE: Siga os passos NA ORDEM

### Passo 1: Criar Usuário na Autenticação

1. No painel do Supabase, vá em **Authentication** > **Users**
2. Clique em **"Add user"** (botão verde no canto superior direito)
3. Selecione **"Create new user"**
4. Preencha:
   ```
   Email: seu-email@suno.com.br
   Password: SuaSenhaSegura123!
   ```
5. ✅ **IMPORTANTE**: Marque a opção **"Auto Confirm User"**
6. Clique em **"Create user"**

### Passo 2: Copiar o UUID do Usuário

1. Ainda em **Authentication** > **Users**, você verá o usuário recém-criado na lista
2. Clique no email do usuário para abrir os detalhes
3. **COPIE** o **UID** (UUID) que aparece no topo
   - Exemplo: `a1b2c3d4-e5f6-7890-abcd-ef1234567890`
   - É uma sequência de letras e números separados por hífens

### Passo 3: Inserir na Tabela Users

1. Vá em **SQL Editor** no Supabase
2. Clique em **"New query"**
3. Cole o SQL abaixo, **SUBSTITUINDO** os valores:

```sql
-- ⚠️ SUBSTITUA OS VALORES ANTES DE EXECUTAR!

INSERT INTO public.users (id, email, full_name, role, is_active)
VALUES (
  'COLE-O-UUID-AQUI'::uuid,  -- ← Cole o UUID copiado no Passo 2
  'seu-email@suno.com.br',    -- ← Mesmo email usado no Passo 1
  'Seu Nome Completo',        -- ← Seu nome
  'admin',                    -- ← NÃO MUDE! Deve ser 'admin'
  true                        -- ← NÃO MUDE! Deve ser true
);
```

### Exemplo Completo (com valores reais):

```sql
-- Exemplo com UUID fictício (USE O SEU UUID REAL!)
INSERT INTO public.users (id, email, full_name, role, is_active)
VALUES (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890'::uuid,
  'joao.silva@suno.com.br',
  'João Silva',
  'admin',
  true
);
```

4. Clique em **"Run"** (ou pressione `Ctrl/Cmd + Enter`)
5. Deve aparecer **"Success. No rows returned"**

### Passo 4: Verificar se Funcionou

1. Vá em **Table Editor** > **users**
2. Você deve ver seu usuário na tabela com:
   - ✅ Email correto
   - ✅ Nome correto
   - ✅ Role = `admin`
   - ✅ is_active = `true`

### Passo 5: Configurar Email de Admin

1. Abra o arquivo `.env.local` na raiz do projeto
2. Adicione o email do admin:

```env
ADMIN_EMAILS=seu-email@suno.com.br
```

3. Se tiver múltiplos admins, separe por vírgula:

```env
ADMIN_EMAILS=joao.silva@suno.com.br,maria.santos@suno.com.br
```

### Passo 6: Testar o Login

1. **Reinicie** o servidor de desenvolvimento:
```bash
# Pressione Ctrl+C para parar
npm run dev
```

2. Acesse http://localhost:3000/login

3. Faça login com:
   - **Email**: O email que você usou
   - **Senha**: A senha que você definiu

4. Você deve ser redirecionado para: http://localhost:3000/admin/backoffice

## 🆘 Troubleshooting

### Erro: "invalid input syntax for type uuid"
❌ **Problema**: Você não substituiu `'uuid-do-usuario'` pelo UUID real

✅ **Solução**: 
1. Volte ao **Passo 2**
2. Copie o UUID correto do usuário
3. Cole no SQL no lugar de `'COLE-O-UUID-AQUI'`

### Erro: "duplicate key value violates unique constraint"
❌ **Problema**: Você já inseriu esse usuário antes

✅ **Solução**: 
1. Vá em **Table Editor** > **users**
2. Encontre o usuário duplicado
3. Clique nos 3 pontinhos > **Delete**
4. Execute o SQL novamente

### Erro: "User not found" ao fazer login
❌ **Problema**: O usuário existe no Auth mas não na tabela `users`

✅ **Solução**: 
1. Verifique se executou o **Passo 3** corretamente
2. Vá em **Table Editor** > **users** e confirme que o usuário está lá
3. Confirme que o UUID na tabela `users` é o mesmo do Auth

### Erro: "Unauthorized" após login
❌ **Problema**: O email não está em `ADMIN_EMAILS` ou o role não é `admin`

✅ **Solução**: 
1. Verifique o arquivo `.env.local`:
   ```env
   ADMIN_EMAILS=seu-email@suno.com.br
   ```
2. Verifique na tabela `users` se `role = 'admin'`
3. **Reinicie** o servidor após alterar `.env.local`

### Não consigo acessar /admin/backoffice
❌ **Problema**: Middleware está bloqueando

✅ **Solução**: 
1. Faça logout: http://localhost:3000/login
2. Limpe os cookies do navegador (F12 > Application > Cookies > Clear)
3. Faça login novamente

## 📋 Checklist Final

Antes de testar, confirme:

- [ ] Usuário criado em **Authentication** > **Users**
- [ ] UUID copiado corretamente (formato: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`)
- [ ] SQL executado com sucesso (sem erros)
- [ ] Usuário aparece em **Table Editor** > **users**
- [ ] Role = `admin` na tabela
- [ ] Email está em `ADMIN_EMAILS` no `.env.local`
- [ ] Servidor reiniciado após alterar `.env.local`

## 🎉 Sucesso!

Se tudo funcionou, você deve:
1. ✅ Conseguir fazer login
2. ✅ Ser redirecionado para `/admin/backoffice`
3. ✅ Ver o dashboard com stats
4. ✅ Navegar pelas páginas do backoffice

## 🔄 Criar Mais Admins

Para criar mais admins, repita os passos 1-3 para cada novo usuário.

Ou use este SQL para promover um usuário existente a admin:

```sql
-- Promover usuário existente a admin
UPDATE public.users
SET role = 'admin'
WHERE email = 'email-do-usuario@suno.com.br';
```

Não esqueça de adicionar o email em `ADMIN_EMAILS`!

