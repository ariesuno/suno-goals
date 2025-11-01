# 💡 Exemplos Práticos - Suno Goals

## 📋 Índice

1. [Criando um Novo Indicador](#criando-um-novo-indicador)
2. [Alterando Dados Existentes](#alterando-dados-existentes)
3. [Adicionando Colaborador](#adicionando-colaborador)
4. [Customizando o Header](#customizando-o-header)
5. [Criando Páginas Múltiplas](#criando-páginas-múltiplas)
6. [Integrando com API](#integrando-com-api)

---

## 1. Criando um Novo Indicador

### Exemplo: Indicador de Vendas

```typescript
// Em lib/mockData.ts

const indicadorVendas: IndicatorType = {
  id: 'vendas-2025',
  name: 'Vendas Mensais',
  unit: 'R$',
  direction: 'up', // Quanto maior, melhor
  accumulated: {
    meta: 1200000,
    real: 1350000,
    percentage: 113
  },
  months: {
    jan: { meta: 100000, real: 110000, percentage: 110 },
    feb: { meta: 100000, real: 115000, percentage: 115 },
    mar: { meta: 100000, real: 112000, percentage: 112 },
    apr: { meta: 100000, real: 113000, percentage: 113 },
    may: { meta: 100000, real: 114000, percentage: 114 },
    jun: { meta: 100000, real: 116000, percentage: 116 },
    jul: { meta: 100000, real: 0, percentage: 0 },
    aug: { meta: 100000, real: 0, percentage: 0 },
    sep: { meta: 100000, real: 0, percentage: 0 },
    oct: { meta: 100000, real: 0, percentage: 0 },
    nov: { meta: 100000, real: 0, percentage: 0 },
    dec: { meta: 100000, real: 0, percentage: 0 },
  },
};
```

### Exemplo: Indicador de Tempo de Resposta

```typescript
const indicadorTempoResposta: IndicatorType = {
  id: 'tempo-resposta-2025',
  name: 'Tempo Médio de Resposta',
  unit: 'H$',
  direction: 'down', // Quanto menor, melhor
  accumulated: {
    meta: 24,
    real: 18,
    percentage: 75
  },
  months: {
    jan: { meta: 24, real: 22, percentage: 92 },
    feb: { meta: 24, real: 20, percentage: 83 },
    mar: { meta: 24, real: 18, percentage: 75 },
    apr: { meta: 24, real: 17, percentage: 71 },
    may: { meta: 24, real: 16, percentage: 67 },
    jun: { meta: 24, real: 15, percentage: 63 },
    jul: { meta: 24, real: 0, percentage: 0 },
    aug: { meta: 24, real: 0, percentage: 0 },
    sep: { meta: 24, real: 0, percentage: 0 },
    oct: { meta: 24, real: 0, percentage: 0 },
    nov: { meta: 24, real: 0, percentage: 0 },
    dec: { meta: 24, real: 0, percentage: 0 },
  },
};
```

---

## 2. Alterando Dados Existentes

### Atualizando um Mês Específico

```typescript
// Em lib/mockData.ts

// Antes
feb: { meta: 80, real: 75, percentage: 94 },

// Depois
feb: { meta: 80, real: 85, percentage: 106 },
```

### Atualizando o Acumulado

```typescript
// Recalcular o acumulado baseado nos meses preenchidos
const calcularAcumulado = (months: any) => {
  let totalMeta = 0;
  let totalReal = 0;
  let mesesPreenchidos = 0;

  Object.values(months).forEach((month: any) => {
    if (month.real > 0) {
      totalMeta += month.meta;
      totalReal += month.real;
      mesesPreenchidos++;
    }
  });

  return {
    meta: totalMeta / mesesPreenchidos,
    real: totalReal / mesesPreenchidos,
    percentage: Math.round((totalReal / totalMeta) * 100)
  };
};
```

---

## 3. Adicionando Colaborador

### Página Individual por Colaborador

```typescript
// app/colaborador/[id]/page.tsx

import Header from '@/components/Header';
import IndicatorTable from '@/components/IndicatorTable';
import { mockBookData } from '@/lib/mockData';

export default function ColaboradorPage({ 
  params 
}: { 
  params: { id: string } 
}) {
  // Em produção, buscar dados do colaborador por ID
  const colaborador = {
    id: params.id,
    nome: 'João Silva',
    cargo: 'Gerente de Vendas',
    departamento: 'Comercial'
  };

  return (
    <main className="min-h-screen bg-white p-8">
      <div className="max-w-[1600px] mx-auto">
        <Header 
          title="Book de Indicadores"
          collaboratorName={colaborador.nome}
          currentYear={2025}
        />
        
        <IndicatorTable data={mockBookData} />
      </div>
    </main>
  );
}
```

---

## 4. Customizando o Header

### Header Simples (Sem Seletor de Ano)

```tsx
<Header 
  title="Book de Indicadores - Q1 2025"
  showYearSelector={false}
/>
```

### Header Completo com Callback

```tsx
'use client';

import { useState } from 'react';

export default function Page() {
  const [anoSelecionado, setAnoSelecionado] = useState(2025);

  return (
    <Header 
      title="Book de Indicadores"
      collaboratorName="Maria Santos"
      currentYear={anoSelecionado}
      onYearChange={(ano) => {
        setAnoSelecionado(ano);
        // Buscar dados do novo ano
        console.log('Carregar dados de', ano);
      }}
    />
  );
}
```

---

## 5. Criando Páginas Múltiplas

### Estrutura de Rotas

```
app/
├── page.tsx                    # Página inicial
├── colaborador/
│   └── [id]/
│       └── page.tsx            # Book individual
├── departamento/
│   └── [nome]/
│       └── page.tsx            # Book por departamento
└── comparacao/
    └── page.tsx                # Comparação de books
```

### Página de Comparação

```tsx
// app/comparacao/page.tsx

import IndicatorTable from '@/components/IndicatorTable';
import { mockBookData } from '@/lib/mockData';

export default function ComparacaoPage() {
  return (
    <main className="min-h-screen bg-white p-8">
      <div className="max-w-[1600px] mx-auto">
        <h1 className="font-display font-bold text-3xl mb-8">
          Comparação de Indicadores
        </h1>
        
        <div className="space-y-12">
          <div>
            <h2 className="font-display font-semibold text-xl mb-4">
              João Silva - Vendas
            </h2>
            <IndicatorTable data={mockBookData} />
          </div>
          
          <div>
            <h2 className="font-display font-semibold text-xl mb-4">
              Maria Santos - Marketing
            </h2>
            <IndicatorTable data={mockBookData} />
          </div>
        </div>
      </div>
    </main>
  );
}
```

---

## 6. Integrando com API

### Criando uma API Route

```typescript
// app/api/indicadores/route.ts

import { NextResponse } from 'next/server';
import { BookData } from '@/types/indicator';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const colaboradorId = searchParams.get('colaboradorId');
  const ano = searchParams.get('ano');

  // Buscar dados do banco de dados
  const dados: BookData = {
    indicators: [
      // ... dados do banco
    ]
  };

  return NextResponse.json(dados);
}

export async function POST(request: Request) {
  const body = await request.json();
  
  // Salvar no banco de dados
  // ...

  return NextResponse.json({ success: true });
}
```

### Consumindo a API no Front-end

```tsx
// app/page.tsx

'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import IndicatorTable from '@/components/IndicatorTable';
import { BookData } from '@/types/indicator';

export default function Home() {
  const [dados, setDados] = useState<BookData | null>(null);
  const [loading, setLoading] = useState(true);
  const [ano, setAno] = useState(2025);

  useEffect(() => {
    async function carregarDados() {
      setLoading(true);
      try {
        const response = await fetch(`/api/indicadores?ano=${ano}`);
        const data = await response.json();
        setDados(data);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setLoading(false);
      }
    }

    carregarDados();
  }, [ano]);

  if (loading) {
    return (
      <main className="min-h-screen bg-white p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-suno-red mx-auto mb-4"></div>
          <p className="text-neutral-8">Carregando indicadores...</p>
        </div>
      </main>
    );
  }

  if (!dados) {
    return (
      <main className="min-h-screen bg-white p-8 flex items-center justify-center">
        <p className="text-neutral-8">Nenhum dado encontrado.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white p-8">
      <div className="max-w-[1600px] mx-auto">
        <Header 
          title="Book de Indicadores"
          currentYear={ano}
          onYearChange={setAno}
        />
        <IndicatorTable data={dados} />
      </div>
    </main>
  );
}
```

### Salvando Alterações

```tsx
'use client';

import { useState } from 'react';

export default function EditarIndicador() {
  const [salvando, setSalvando] = useState(false);

  const salvarIndicador = async (indicador: IndicatorType) => {
    setSalvando(true);
    
    try {
      const response = await fetch('/api/indicadores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(indicador),
      });

      if (response.ok) {
        alert('Indicador salvo com sucesso!');
      } else {
        alert('Erro ao salvar indicador');
      }
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao salvar indicador');
    } finally {
      setSalvando(false);
    }
  };

  return (
    <button
      onClick={() => salvarIndicador(/* dados */)}
      disabled={salvando}
      className="px-4 py-2 bg-suno-red text-white rounded-lg disabled:opacity-50"
    >
      {salvando ? 'Salvando...' : 'Salvar'}
    </button>
  );
}
```

---

## 🎯 Dicas Avançadas

### 1. Validação de Dados

```typescript
const validarIndicador = (indicador: IndicatorType): boolean => {
  // Verificar se todos os campos obrigatórios estão preenchidos
  if (!indicador.id || !indicador.name) return false;
  
  // Verificar se as porcentagens estão corretas
  const meses = Object.values(indicador.months);
  for (const mes of meses) {
    const percentualCalculado = Math.round((mes.real / mes.meta) * 100);
    if (mes.percentage !== percentualCalculado && mes.real !== 0) {
      console.warn('Percentual incorreto detectado');
      return false;
    }
  }
  
  return true;
};
```

### 2. Exportar para Excel

```typescript
const exportarParaExcel = (dados: BookData) => {
  // Implementar exportação usando biblioteca como xlsx
  console.log('Exportando para Excel...', dados);
};
```

### 3. Filtros e Busca

```tsx
'use client';

import { useState } from 'react';

export default function ListaIndicadores() {
  const [busca, setBusca] = useState('');
  
  const indicadoresFiltrados = dados.indicators.filter(ind =>
    ind.name.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <>
      <input
        type="text"
        placeholder="Buscar indicador..."
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
        className="px-4 py-2 border-2 border-neutral-3 rounded-lg mb-4"
      />
      <IndicatorTable data={{ indicators: indicadoresFiltrados }} />
    </>
  );
}
```

---

## 📚 Recursos Adicionais

- Veja `COMPONENTES.md` para detalhes dos componentes
- Veja `GUIA_RAPIDO.md` para instruções básicas
- Veja `ROADMAP.md` para funcionalidades futuras

---

**Última atualização**: Novembro 2025

