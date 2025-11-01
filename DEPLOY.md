# 🚀 Guia de Deploy - Suno Goals

Este documento fornece instruções para fazer deploy do Suno Goals em diferentes plataformas.

## 📋 Pré-requisitos

- Código commitado no GitHub
- Conta na plataforma de deploy escolhida
- Variáveis de ambiente configuradas (se necessário)

---

## 🌐 Opções de Deploy

### 1. Vercel (Recomendado)

A forma mais fácil de fazer deploy de aplicações Next.js.

#### Passo a Passo

1. **Acesse** [vercel.com](https://vercel.com)
2. **Faça login** com sua conta GitHub
3. **Clique** em "Add New Project"
4. **Selecione** o repositório `ariesuno/suno-goals`
5. **Configure** (deixe as configurações padrão):
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: `npm run build`
   - Output Directory: `.next`
6. **Clique** em "Deploy"

#### Via CLI

```bash
# Instalar Vercel CLI
npm i -g vercel

# Fazer login
vercel login

# Deploy
vercel

# Deploy para produção
vercel --prod
```

#### Variáveis de Ambiente

No painel da Vercel, vá em Settings > Environment Variables e adicione:

```env
# Exemplo (quando tiver backend)
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=...
NEXTAUTH_URL=https://suno-goals.vercel.app
```

---

### 2. Netlify

Alternativa popular para deploy de aplicações Next.js.

#### Passo a Passo

1. **Acesse** [netlify.com](https://netlify.com)
2. **Faça login** com sua conta GitHub
3. **Clique** em "Add new site" > "Import an existing project"
4. **Selecione** GitHub e autorize
5. **Escolha** o repositório `ariesuno/suno-goals`
6. **Configure**:
   - Build command: `npm run build`
   - Publish directory: `.next`
7. **Clique** em "Deploy site"

#### Via CLI

```bash
# Instalar Netlify CLI
npm i -g netlify-cli

# Fazer login
netlify login

# Deploy
netlify deploy

# Deploy para produção
netlify deploy --prod
```

---

### 3. Docker

Para deploy em servidores próprios ou cloud providers.

#### Dockerfile

Crie um arquivo `Dockerfile` na raiz:

```dockerfile
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

#### Docker Compose

Crie `docker-compose.yml`:

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
```

#### Comandos

```bash
# Build
docker build -t suno-goals .

# Run
docker run -p 3000:3000 suno-goals

# Com Docker Compose
docker-compose up -d
```

---

### 4. AWS (EC2 + PM2)

Para deploy em servidor EC2 da AWS.

#### Setup Inicial

```bash
# Conectar ao EC2
ssh -i sua-chave.pem ubuntu@seu-ip

# Instalar Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Instalar PM2
sudo npm install -g pm2

# Clonar repositório
git clone https://github.com/ariesuno/suno-goals.git
cd suno-goals

# Instalar dependências
npm install

# Build
npm run build
```

#### Configurar PM2

Crie `ecosystem.config.js`:

```javascript
module.exports = {
  apps: [{
    name: 'suno-goals',
    script: 'npm',
    args: 'start',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
};
```

#### Iniciar

```bash
# Iniciar com PM2
pm2 start ecosystem.config.js

# Salvar configuração
pm2 save

# Auto-start no boot
pm2 startup
```

---

### 5. DigitalOcean App Platform

Deploy simplificado no DigitalOcean.

#### Passo a Passo

1. **Acesse** [cloud.digitalocean.com](https://cloud.digitalocean.com)
2. **Clique** em "Create" > "Apps"
3. **Conecte** sua conta GitHub
4. **Selecione** o repositório `ariesuno/suno-goals`
5. **Configure**:
   - Type: Web Service
   - Build Command: `npm run build`
   - Run Command: `npm start`
6. **Escolha** o plano (Basic $5/mês)
7. **Clique** em "Launch App"

---

## 🔒 Configurações de Segurança

### Headers de Segurança

Adicione em `next.config.ts`:

```typescript
const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};
```

### Variáveis de Ambiente

Nunca commite variáveis sensíveis! Use `.env.local`:

```env
# .env.local (não commitar!)
DATABASE_URL=...
API_SECRET=...
NEXTAUTH_SECRET=...
```

---

## 📊 Monitoramento

### Vercel Analytics

```bash
npm install @vercel/analytics
```

Em `app/layout.tsx`:

```typescript
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

### Sentry (Error Tracking)

```bash
npm install @sentry/nextjs
```

Configure conforme [documentação do Sentry](https://docs.sentry.io/platforms/javascript/guides/nextjs/).

---

## 🔄 CI/CD

O projeto já possui GitHub Actions configurado que:

- ✅ Executa linting em cada push
- ✅ Faz build do projeto
- ✅ Valida que não há erros

Para deploy automático, adicione secrets no GitHub:

1. Vá em Settings > Secrets and variables > Actions
2. Adicione os secrets necessários (ex: VERCEL_TOKEN)
3. Atualize `.github/workflows/ci.yml` com steps de deploy

---

## 📝 Checklist de Deploy

Antes de fazer deploy em produção:

- [ ] Código testado localmente
- [ ] Build funcionando (`npm run build`)
- [ ] Sem erros de linting (`npm run lint`)
- [ ] Variáveis de ambiente configuradas
- [ ] README atualizado
- [ ] Documentação completa
- [ ] Logs configurados
- [ ] Monitoramento ativo
- [ ] Backup configurado
- [ ] SSL/HTTPS ativo
- [ ] Domínio customizado (se aplicável)

---

## 🆘 Troubleshooting

### Build Falha

```bash
# Limpar cache
rm -rf .next node_modules
npm install
npm run build
```

### Porta em Uso

```bash
# Mudar porta
PORT=3001 npm start
```

### Problemas com Fontes

Verifique se as fontes do Google estão carregando corretamente.

---

## 📞 Suporte

Para problemas de deploy:

1. Consulte a documentação da plataforma
2. Verifique os logs de build
3. Abra uma issue no GitHub
4. Entre em contato com a equipe

---

## 🎉 Deploy Bem-Sucedido!

Após o deploy, seu Suno Goals estará disponível em:

- **Vercel**: `https://suno-goals.vercel.app`
- **Netlify**: `https://suno-goals.netlify.app`
- **Customizado**: `https://seu-dominio.com`

Compartilhe com a equipe e comece a usar! 🚀

