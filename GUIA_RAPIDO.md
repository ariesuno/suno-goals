# 📖 Guia Rápido - Suno Goals

## 🚀 Início Rápido

### 1. Instalar Dependências
```bash
npm install
```

### 2. Iniciar Servidor de Desenvolvimento
```bash
npm run dev
```

### 3. Acessar no Navegador
Abra [http://localhost:3000](http://localhost:3000)

## 📊 Como Usar os Dados

### Estrutura de um Indicador

```typescript
{
  id: '1',
  name: 'Nome do Indicador',
  unit: '%',  // ou '#', 'R$', 'H$'
  direction: 'up',  // ou 'down'
  accumulated: {
    meta: 80,
    real: 90,
    percentage: 113
  },
  months: {
    jan: { meta: 80, real: 90, percentage: 113 },
    // ... outros meses
  }
}
```

### Tipos de Unidade

- `%` - Percentual
- `#` - Número/Quantidade
- `R$` - Valor em Reais
- `H$` - Horas

### Direção do Indicador

- `up` (↑) - **Maior é melhor** (ex: vendas, satisfação)
- `down` (↓) - **Menor é melhor** (ex: custos, tempo de resposta, churn)

## 🎨 Personalização

### Alterar Dados

Edite o arquivo `/lib/mockData.ts` para alterar os dados exibidos.

### Adicionar/Remover Indicadores

```typescript
// Em mockData.ts
export const mockBookData: BookData = {
  indicators: [
    // Adicione ou remova indicadores aqui
    // Mínimo: 1 indicador
    // Máximo: 6 indicadores (recomendado)
  ],
};
```

### Exemplos Prontos

Veja `/lib/exampleData.ts` para exemplos com 2 e 6 indicadores.

## 🖨️ Tirar Screenshot

### Método 1: Botão de Print
Clique no botão "Imprimir / Screenshot" no canto superior direito.

### Método 2: Atalhos do Sistema
- **macOS**: `Cmd + Shift + 4` (área) ou `Cmd + Shift + 3` (tela)
- **Windows**: `Win + Shift + S`

### Método 3: Print do Navegador
- **Chrome/Edge**: `Ctrl/Cmd + P` → Salvar como PDF
- Configure para modo paisagem (landscape)

## 🎯 Dicas de Uso

### 1. Zoom Ideal
Use zoom de 80-100% no navegador para melhor visualização.

### 2. Cores de Status
As cores são calculadas automaticamente:
- 🟢 Verde: Meta atingida ou superada
- 🟡 Amarelo: Próximo da meta (80-99%)
- 🔴 Vermelho: Abaixo da meta

### 3. Valores Vazios
Use `0` para meses sem dados (aparecerá em branco).

### 4. Formatação Automática
- Valores em R$ são formatados com separador de milhares
- Percentuais aparecem com o símbolo %
- Números aparecem sem formatação especial

## 🔧 Estrutura de Arquivos

```
suno-goals/
├── app/
│   ├── page.tsx              # Página principal
│   ├── layout.tsx            # Layout e fontes
│   └── globals.css           # Estilos globais
├── components/
│   ├── Header.tsx            # Cabeçalho com logo
│   ├── IndicatorTable.tsx    # Tabela completa
│   ├── IndicatorRow.tsx      # Linha de indicador
│   └── PrintButton.tsx       # Botão de impressão
├── lib/
│   ├── mockData.ts           # Dados principais (EDITE AQUI)
│   └── exampleData.ts        # Exemplos adicionais
└── types/
    └── indicator.ts          # Tipos TypeScript
```

## 📝 Próximos Passos

Para adicionar funcionalidades de backend:

1. **Autenticação**: Adicionar login de usuários
2. **API**: Criar endpoints para CRUD de indicadores
3. **Banco de Dados**: Integrar com PostgreSQL/MongoDB
4. **Multi-usuário**: Cada colaborador com seu book
5. **Histórico**: Acompanhar mudanças ao longo do tempo
6. **Dashboard**: Visão consolidada de todos os books

## 🆘 Problemas Comuns

### Erro: "Cannot find module"
```bash
rm -rf node_modules package-lock.json
npm install
```

### Fontes não carregam
Verifique se as fontes Inter e Montserrat estão sendo baixadas do Google Fonts.

### Cores não aparecem no print
As cores estão configuradas para aparecer. Verifique as configurações de impressão do navegador.

### Layout quebrado
Ajuste o zoom do navegador ou a largura da janela. O layout é otimizado para telas de 1400px+.

## 📞 Suporte

Para dúvidas ou sugestões, entre em contato com a equipe de desenvolvimento.

