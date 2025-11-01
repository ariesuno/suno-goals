# 🤝 Contribuindo para o Suno Goals

Obrigado por considerar contribuir com o Suno Goals! Este documento fornece diretrizes para contribuições.

## 📋 Código de Conduta

- Seja respeitoso e profissional
- Aceite feedback construtivo
- Foque no que é melhor para o projeto
- Mostre empatia com outros membros da comunidade

## 🚀 Como Contribuir

### 1. Reportar Bugs

Ao reportar bugs, inclua:

- **Descrição clara** do problema
- **Passos para reproduzir** o bug
- **Comportamento esperado** vs. comportamento atual
- **Screenshots** (se aplicável)
- **Ambiente**: SO, navegador, versão do Node.js

**Template de Issue de Bug:**
```markdown
## Descrição
[Descreva o bug]

## Passos para Reproduzir
1. [Primeiro passo]
2. [Segundo passo]
3. [...]

## Comportamento Esperado
[O que deveria acontecer]

## Comportamento Atual
[O que está acontecendo]

## Screenshots
[Se aplicável]

## Ambiente
- SO: [ex: macOS 14.0]
- Navegador: [ex: Chrome 120]
- Node.js: [ex: 20.10.0]
```

### 2. Sugerir Funcionalidades

Ao sugerir novas funcionalidades:

- **Descreva o problema** que a funcionalidade resolve
- **Explique a solução proposta**
- **Forneça exemplos** de uso
- **Considere alternativas**

**Template de Issue de Funcionalidade:**
```markdown
## Problema
[Qual problema esta funcionalidade resolve?]

## Solução Proposta
[Como você imagina que isso funcione?]

## Exemplos de Uso
[Mostre como seria usado]

## Alternativas Consideradas
[Outras formas de resolver o problema]
```

### 3. Contribuir com Código

#### Preparação

1. **Fork** o repositório
2. **Clone** seu fork:
   ```bash
   git clone https://github.com/seu-usuario/suno-goals.git
   cd suno-goals
   ```
3. **Instale** as dependências:
   ```bash
   npm install
   ```
4. **Crie uma branch** para sua feature:
   ```bash
   git checkout -b feature/minha-funcionalidade
   ```

#### Desenvolvimento

1. **Faça suas alterações**
2. **Teste localmente**:
   ```bash
   npm run dev
   ```
3. **Verifique o linting**:
   ```bash
   npm run lint
   ```
4. **Faça commits** seguindo o padrão:
   ```bash
   git commit -m "feat: adiciona nova funcionalidade"
   ```

#### Padrão de Commits

Use [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` Nova funcionalidade
- `fix:` Correção de bug
- `docs:` Alterações na documentação
- `style:` Formatação, ponto e vírgula, etc
- `refactor:` Refatoração de código
- `test:` Adição de testes
- `chore:` Tarefas de manutenção

**Exemplos:**
```bash
feat: adiciona filtro de indicadores por departamento
fix: corrige cálculo de percentual em indicadores down
docs: atualiza README com novas instruções
style: formata código com prettier
refactor: simplifica lógica de cores de status
test: adiciona testes para IndicatorRow
chore: atualiza dependências do projeto
```

#### Pull Request

1. **Push** para seu fork:
   ```bash
   git push origin feature/minha-funcionalidade
   ```
2. **Abra um Pull Request** no GitHub
3. **Descreva suas alterações** claramente
4. **Aguarde review** da equipe

**Template de Pull Request:**
```markdown
## Descrição
[Descreva o que foi alterado e por quê]

## Tipo de Mudança
- [ ] Bug fix
- [ ] Nova funcionalidade
- [ ] Breaking change
- [ ] Documentação

## Como Testar
1. [Passo 1]
2. [Passo 2]
3. [...]

## Checklist
- [ ] Código segue o style guide do projeto
- [ ] Comentários foram adicionados onde necessário
- [ ] Documentação foi atualizada
- [ ] Testes foram adicionados/atualizados
- [ ] Todas as alterações foram testadas
- [ ] Não há warnings de linting
```

## 📝 Style Guide

### TypeScript

- Use **TypeScript** para todo código novo
- Defina **tipos explícitos** para props e funções
- Evite usar `any`
- Use **interfaces** para objetos complexos

**Exemplo:**
```typescript
interface IndicatorProps {
  name: string;
  value: number;
  unit: '%' | '#' | 'R$' | 'H$';
}

export function Indicator({ name, value, unit }: IndicatorProps) {
  // ...
}
```

### React

- Use **componentes funcionais** com hooks
- Prefira **named exports** para componentes
- Use **destructuring** para props
- Adicione **comentários** para lógica complexa

**Exemplo:**
```typescript
export default function IndicatorTable({ data }: IndicatorTableProps) {
  const [filter, setFilter] = useState('');
  
  // Filtra indicadores baseado no nome
  const filteredIndicators = data.indicators.filter(
    ind => ind.name.toLowerCase().includes(filter.toLowerCase())
  );
  
  return (
    // JSX
  );
}
```

### CSS/Tailwind

- Use **classes do Tailwind** sempre que possível
- Para estilos customizados, adicione em `globals.css`
- Use **variáveis CSS** para cores do tema
- Prefira **utility classes** a CSS customizado

**Exemplo:**
```tsx
<div className="flex items-center gap-4 px-4 py-2 bg-suno-red text-white rounded-lg hover:opacity-90 transition-opacity">
  {/* Conteúdo */}
</div>
```

### Nomenclatura

- **Componentes**: PascalCase (`IndicatorTable`)
- **Funções**: camelCase (`calculatePercentage`)
- **Constantes**: UPPER_SNAKE_CASE (`MAX_INDICATORS`)
- **Arquivos**: PascalCase para componentes, camelCase para utils

## 🧪 Testes

(A ser implementado)

Quando testes forem adicionados ao projeto:

- Escreva testes para novas funcionalidades
- Mantenha cobertura de testes acima de 80%
- Use Jest + React Testing Library
- Execute testes antes de fazer PR

## 📚 Documentação

Ao adicionar funcionalidades:

- **Atualize o README** se necessário
- **Documente componentes** em `COMPONENTES.md`
- **Adicione exemplos** em `EXEMPLOS.md`
- **Comente código complexo**

## 🔍 Review Process

1. **Automated checks**: Linting, testes (quando implementado)
2. **Code review**: Pelo menos 1 aprovação necessária
3. **Testing**: Verificação manual se necessário
4. **Merge**: Após aprovação e checks passarem

## ❓ Dúvidas?

- Consulte a documentação em `/docs`
- Abra uma issue com a tag `question`
- Entre em contato com a equipe de desenvolvimento

## 🎯 Prioridades

Veja o [ROADMAP.md](ROADMAP.md) para entender as prioridades do projeto.

## 📄 Licença

Ao contribuir, você concorda que suas contribuições serão licenciadas sob a mesma licença do projeto (MIT).

---

**Obrigado por contribuir com o Suno Goals! 🎉**

