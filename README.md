# Suno Goals - Book de Indicadores

Sistema interno da Suno para gestão e controle do Book de Indicadores de todos os colaboradores da empresa.

## 🎯 Objetivo

Substituir o controle em Excel por uma interface web moderna, clean e otimizada para screenshots e apresentações em PPT. O layout foi projetado para caber integralmente na tela sem barras de rolagem, facilitando prints completos para reports.

## 🎨 Design System

O projeto segue fielmente a identidade visual da Suno:

### Cores Principais
- **Suno Gray**: `#4B4B4B`
- **Suno Red**: `#D42126`

### Cores Neutras
- Neutral-2: `#DDDDDD`
- Neutral-3: `#BBBBBB`
- Neutral-5: `#999999`
- Neutral-8: `#666666`
- Neutral-10: `#212121`

### Tipografia
- **Inter**: Fonte principal para textos e dados (Regular 400, Semi Bold 600, Bold 700)
- **Montserrat**: Fonte display para títulos e cabeçalhos (Regular 400, Medium 500, Bold 700)

## 🚀 Tecnologias

- **Next.js 15** (App Router)
- **TypeScript**
- **Tailwind CSS v4**
- **Lucide React** (ícones)

## 📦 Instalação

```bash
npm install
```

## 🏃 Executar

```bash
npm run dev
```

Acesse: [http://localhost:3000](http://localhost:3000)

## 🖨️ Print para Apresentações

O layout foi otimizado para screenshots:

1. Acesse a página no navegador
2. Ajuste o zoom se necessário (recomendado: 100%)
3. Tire um screenshot completo da tela
4. Use diretamente em apresentações PPT

### Atalhos para Screenshot
- **macOS**: `Cmd + Shift + 4` (área selecionada) ou `Cmd + Shift + 3` (tela inteira)
- **Windows**: `Win + Shift + S` (Ferramenta de Captura)

## 📊 Estrutura de Indicadores

Cada indicador possui:

- **Nome**: Identificação do KPI
- **Unidade**: `%`, `#`, `R$` ou `H$`
- **Direção**: 
  - `up` (↑): Maior é melhor
  - `down` (↓): Menor é melhor
- **Coluna Acc**: Acumulado do ano
- **12 Colunas Mensais**: Janeiro a Dezembro

### Cores de Status

Para indicadores `up` (maior é melhor):
- 🟢 Verde: ≥ 100%
- 🟡 Amarelo: 80% - 99%
- 🔴 Vermelho: < 80%

Para indicadores `down` (menor é melhor):
- 🟢 Verde: ≤ 100%
- 🟡 Amarelo: 101% - 110%
- 🔴 Vermelho: > 110%

## 📁 Estrutura do Projeto

```
suno-goals/
├── app/
│   ├── layout.tsx          # Layout principal com fontes
│   ├── page.tsx             # Página inicial
│   └── globals.css          # Estilos globais e tema
├── components/
│   ├── IndicatorTable.tsx   # Componente da tabela completa
│   └── IndicatorRow.tsx     # Componente de linha de indicador
├── lib/
│   └── mockData.ts          # Dados de exemplo
├── types/
│   └── indicator.ts         # Tipos TypeScript
├── public/
│   └── images/              # Logos da Suno
└── assets/                  # Assets originais
```

## 🔧 Próximos Passos (Backend)

- [ ] Integração com API/Backend
- [ ] Autenticação de usuários
- [ ] CRUD de indicadores
- [ ] Histórico de alterações
- [ ] Exportação em PDF
- [ ] Dashboard de análise

## 📝 Licença

Uso interno - Suno © 2025
