# 📦 Guia de Componentes - Suno Goals

## 🎯 Visão Geral

Este documento descreve todos os componentes do sistema, suas props e como utilizá-los.

## 🧩 Componentes

### 1. Header

Cabeçalho principal da aplicação com logo, título e controles.

**Localização**: `/components/Header.tsx`

**Props**:
```typescript
{
  title?: string;              // Título principal (padrão: "Book de Indicadores")
  collaboratorName?: string;   // Nome do colaborador (opcional)
  currentYear?: number;        // Ano atual (padrão: ano corrente)
  showYearSelector?: boolean;  // Mostrar seletor de ano (padrão: true)
  onYearChange?: (year: number) => void;  // Callback quando ano muda
}
```

**Exemplo de Uso**:
```tsx
<Header 
  title="Book de Indicadores"
  collaboratorName="João Silva"
  currentYear={2025}
  onYearChange={(year) => console.log('Ano selecionado:', year)}
/>
```

---

### 2. IndicatorTable

Tabela completa de indicadores com cabeçalho e linhas.

**Localização**: `/components/IndicatorTable.tsx`

**Props**:
```typescript
{
  data: BookData;  // Objeto com array de indicadores
}
```

**Exemplo de Uso**:
```tsx
import { mockBookData } from '@/lib/mockData';

<IndicatorTable data={mockBookData} />
```

---

### 3. IndicatorRow

Linha individual de um indicador na tabela.

**Localização**: `/components/IndicatorRow.tsx`

**Props**:
```typescript
{
  indicator: IndicatorType;  // Objeto do indicador
}
```

**Uso**: Este componente é usado internamente pelo `IndicatorTable`. Normalmente não precisa ser usado diretamente.

---

### 4. PrintButton

Botão para imprimir ou tirar screenshot da página.

**Localização**: `/components/PrintButton.tsx`

**Props**: Nenhuma

**Exemplo de Uso**:
```tsx
<PrintButton />
```

**Comportamento**: 
- Chama `window.print()` ao clicar
- Escondido automaticamente ao imprimir (classe `print:hidden`)

---

### 5. YearSelector

Seletor dropdown para escolher o ano.

**Localização**: `/components/YearSelector.tsx`

**Props**:
```typescript
{
  currentYear?: number;  // Ano inicial (padrão: ano corrente)
  onYearChange?: (year: number) => void;  // Callback quando ano muda
}
```

**Exemplo de Uso**:
```tsx
<YearSelector 
  currentYear={2025}
  onYearChange={(year) => console.log('Novo ano:', year)}
/>
```

**Comportamento**:
- Mostra 5 anos anteriores e 1 ano futuro
- Escondido automaticamente ao imprimir
- Fecha ao clicar fora do dropdown

---

## 📊 Tipos TypeScript

### IndicatorType

```typescript
type IndicatorType = {
  id: string;
  name: string;
  unit: '%' | '#' | 'R$' | 'H$';
  direction: 'up' | 'down';
  accumulated: MonthData;
  months: {
    jan: MonthData;
    feb: MonthData;
    mar: MonthData;
    apr: MonthData;
    may: MonthData;
    jun: MonthData;
    jul: MonthData;
    aug: MonthData;
    sep: MonthData;
    oct: MonthData;
    nov: MonthData;
    dec: MonthData;
  };
};
```

### MonthData

```typescript
type MonthData = {
  meta: number;      // Valor da meta
  real: number;      // Valor real alcançado
  percentage: number; // Percentual (real/meta * 100)
};
```

### BookData

```typescript
type BookData = {
  indicators: IndicatorType[];
};
```

---

## 🎨 Classes CSS Customizadas

### Cores

```css
/* Cores da marca */
.bg-suno-gray     /* #4B4B4B */
.bg-suno-red      /* #D42126 */
.text-suno-red    /* #D42126 */

/* Cores neutras */
.bg-neutral-2     /* #DDDDDD */
.bg-neutral-3     /* #BBBBBB */
.bg-neutral-5     /* #999999 */
.bg-neutral-8     /* #666666 */
.bg-neutral-10    /* #212121 */
.text-neutral-5   /* #999999 */
.text-neutral-8   /* #666666 */
.text-neutral-10  /* #212121 */

/* Cores de status */
.bg-status-green  /* #10B981 */
.bg-status-red    /* #EF4444 */
.bg-status-yellow /* #F59E0B */
```

### Tipografia

```css
.font-display     /* Montserrat */
.font-sans        /* Inter (padrão) */
```

---

## 🔧 Funções Utilitárias

### getStatusColor

Determina a cor de status baseada na porcentagem e direção.

**Localização**: `/components/IndicatorRow.tsx`

```typescript
const getStatusColor = (percentage: number, direction: 'up' | 'down'): string
```

**Lógica**:
- **Direction UP** (maior é melhor):
  - Verde: ≥ 100%
  - Amarelo: 80-99%
  - Vermelho: < 80%
  
- **Direction DOWN** (menor é melhor):
  - Verde: ≤ 100%
  - Amarelo: 101-110%
  - Vermelho: > 110%

### formatValue

Formata valores de acordo com a unidade.

**Localização**: `/components/IndicatorRow.tsx`

```typescript
const formatValue = (value: number, unit: string): string
```

**Comportamento**:
- `R$` e `H$`: Formatação com separador de milhares
- Outros: Valor direto
- Zero: String vazia

### formatPercentage

Formata valores percentuais.

**Localização**: `/components/IndicatorRow.tsx`

```typescript
const formatPercentage = (percentage: number): string
```

**Comportamento**:
- Adiciona símbolo `%`
- Zero: String vazia

---

## 📱 Responsividade

### Breakpoints

O layout é otimizado para:
- Desktop: ≥ 1400px (ideal)
- Laptop: 1024px - 1399px
- Tablet: 768px - 1023px (pode ter scroll horizontal)

### Print Styles

Classes especiais para impressão:
```css
.print:hidden     /* Esconde ao imprimir */
.print:m-0        /* Remove margem ao imprimir */
```

---

## 🎯 Boas Práticas

### 1. Criando Novos Indicadores

```typescript
const novoIndicador: IndicatorType = {
  id: 'unique-id',
  name: 'Nome do Indicador',
  unit: '%',
  direction: 'up',
  accumulated: {
    meta: 100,
    real: 0,
    percentage: 0
  },
  months: {
    jan: { meta: 100, real: 0, percentage: 0 },
    // ... preencher todos os meses
  }
};
```

### 2. Calculando Percentuais

```typescript
const percentage = Math.round((real / meta) * 100);
```

### 3. Adicionando Novos Componentes

1. Crie o arquivo em `/components/`
2. Use TypeScript para props
3. Adicione classes Tailwind para estilo
4. Considere comportamento de print
5. Documente aqui

### 4. Modificando Estilos

- Use as variáveis CSS definidas em `globals.css`
- Mantenha consistência com o Design System Suno
- Teste em diferentes resoluções
- Verifique comportamento de impressão

---

## 🐛 Troubleshooting

### Componente não renderiza

1. Verifique se todas as props obrigatórias foram passadas
2. Confira se os tipos estão corretos
3. Veja o console do navegador para erros

### Estilos não aplicam

1. Verifique se o Tailwind está compilando
2. Confirme que as classes customizadas estão em `globals.css`
3. Limpe o cache: `rm -rf .next && npm run dev`

### Dados não aparecem

1. Verifique a estrutura do objeto de dados
2. Confirme que todos os meses estão preenchidos
3. Use `console.log()` para debug

---

## 📚 Recursos Adicionais

- [Documentação Next.js](https://nextjs.org/docs)
- [Documentação Tailwind CSS](https://tailwindcss.com/docs)
- [Documentação TypeScript](https://www.typescriptlang.org/docs)
- [Lucide Icons](https://lucide.dev)

---

**Última atualização**: Novembro 2025

