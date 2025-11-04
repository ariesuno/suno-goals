# Módulo de Indicadores - Regras de Negócio

## Visão Geral
Sistema de gestão de indicadores (KPIs) para composição de books de colaboradores.

## Características dos Indicadores

### 1. Reutilização
- **Um indicador pode estar em vários books**
- Exemplo: "Leads Qualificados" pode estar no book de 10 pessoas diferentes
- Cada pessoa pode ter meta diferente para o mesmo indicador

### 2. Metas Customizadas
- **Meta global**: Definida no cadastro do indicador
- **Meta por usuário**: Definida ao adicionar indicador no book
- **Meta por time**: Para indicadores compartilhados
- Meta customizada sobrescreve meta global

### 3. Permissões no Book
Ao adicionar indicador no book, definir:
- **Gestor**: Pode editar valores realizados
- **Visualizador**: Apenas visualiza, não edita

### 4. Formatos Suportados
- **Percentual (%)**: Taxa de conversão, atingimento
- **Número (#)**: Quantidade de leads, vendas
- **Financeiro (R$)**: Budget, receita, custos
- **Booleano (✓/✗)**: Projeto concluído sim/não
- **Horas (H)**: Tempo de treinamento, desenvolvimento

### 5. Direção
- **Up (↑)**: Maior é melhor (vendas, conversão)
- **Down (↓)**: Menor é melhor (custos, tempo)

### 6. Agregação
Indicadores podem agregar outros:
- **Média**: Média de atingimento de outros indicadores
- **Soma**: Soma de valores de outros indicadores
- **Contagem**: Quantos indicadores foram atingidos

Exemplo: "Média de Atingimento do Time" agrega todos indicadores do time

### 7. Status
- **Em Construção**: Indicador sendo criado
- **Em Revisão**: Aguardando validação
- **Validado**: Aprovado para uso

### 8. Tags
- Categorização livre (Financeiro, Operacional, Estratégico, etc)
- Múltiplas tags por indicador
- Facilita filtros e organização

## Funcionalidades Implementadas

### Listagem
- Grid responsivo (1/2/3 colunas)
- Busca por nome/descrição
- Filtros: status, formato, tags, com/sem books
- Contador de resultados

### Card do Indicador
- Nome, descrição
- Status, formato, direção
- Tags (até 3 visíveis + contador)
- Número de books
- Taxa média de atingimento

### Drawer de Detalhes
3 abas:
1. **Detalhes**: Todas informações do indicador
2. **Books**: Lista de books que usam este indicador
   - Nome do owner
   - Tipo (gestor/visualizador)
   - Taxa de atingimento
3. **Histórico**: Log de alterações
   - Quem alterou
   - O que mudou
   - Quando

### Formulário
Campos:
- Nome (obrigatório)
- Descrição (obrigatório)
- Notas (opcional)
- Formato (obrigatório)
- Direção (obrigatório)
- Status (obrigatório)
- Tipo de agregação
- Tags (múltipla escolha)

### Histórico Automático
Trigger SQL registra:
- Criação
- Alterações (campo, valor antigo, valor novo)
- Mudança de status
- Exclusão

## Fluxo de Uso

### 1. Criar Indicador
FP&A cria indicador com todas características

### 2. Definir Metas Globais (Opcional)
Cadastrar metas padrão por usuário/time

### 3. Adicionar ao Book
Ao montar book do colaborador:
- Selecionar indicador
- Definir se é gestor ou visualizador
- Opcionalmente customizar meta
- Definir ordem de exibição

### 4. Acompanhamento
FP&A pode expandir indicador e ver:
- Quantos books usam
- Taxa de atingimento por book
- Média geral de atingimento

## Integrações

### Com Books
- `book_indicator_config`: Configuração de indicador no book
- Campos: is_manager, display_order, custom_goals

### Com Usuários
- `indicator_goals`: Metas por usuário/time/ano
- Permite desdobramento de metas

### Com Audit
- `indicator_change_log`: Histórico completo
- Rastreabilidade total

## Validações

### Obrigatórios
- Nome
- Descrição
- Formato
- Direção
- Status

### Opcionais
- Notas
- Tags
- Agregação
- Indicadores agregados

## Permissões (RLS)
- Apenas admins podem gerenciar indicadores
- Usuários normais veem apenas seus indicadores (via books)
- Managers veem indicadores de sua equipe

## Performance
- Índices em: status, format, created_by, is_active
- View `indicators_with_stats` pré-calcula estatísticas
- Paginação recomendada para +100 indicadores

## Próximas Evoluções
- Importação em lote (CSV/Excel)
- Duplicação de indicadores
- Templates de indicadores
- Dashboard de análise de indicadores
- Alertas automáticos (indicador sem book, baixo atingimento)

