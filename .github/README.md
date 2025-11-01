# 🎯 Suno Goals - Configurações do GitHub

Este diretório contém configurações e templates para o repositório do GitHub.

## 📁 Estrutura

```
.github/
├── ISSUE_TEMPLATE/
│   ├── bug_report.md         # Template para reportar bugs
│   └── feature_request.md    # Template para sugerir funcionalidades
├── workflows/
│   └── ci.yml                # GitHub Actions para CI/CD
├── PULL_REQUEST_TEMPLATE.md  # Template para Pull Requests
└── README.md                 # Este arquivo
```

## 🔄 GitHub Actions

### CI Workflow

O workflow de CI (`ci.yml`) executa automaticamente em:
- Push para branch `main`
- Pull Requests para branch `main`

**Jobs:**
1. **Lint**: Verifica qualidade do código
2. **Build**: Compila o projeto Next.js

## 📝 Templates de Issues

### Bug Report
Use para reportar bugs ou problemas no sistema.

**Inclui:**
- Descrição do bug
- Passos para reproduzir
- Comportamento esperado vs. atual
- Screenshots
- Informações de ambiente

### Feature Request
Use para sugerir novas funcionalidades.

**Inclui:**
- Descrição da funcionalidade
- Problema que resolve
- Solução proposta
- Exemplos de uso
- Prioridade

## 🔀 Template de Pull Request

Usado automaticamente ao criar um PR.

**Inclui:**
- Descrição das mudanças
- Tipo de mudança
- Como testar
- Screenshots
- Checklist de verificação

## 🎯 Boas Práticas

### Criando Issues

1. Use os templates fornecidos
2. Seja claro e específico
3. Adicione labels apropriadas
4. Referencie issues relacionadas

### Criando Pull Requests

1. Crie uma branch descritiva
2. Faça commits seguindo Conventional Commits
3. Preencha o template completamente
4. Aguarde review antes de mergear

### Labels Sugeridas

- `bug` - Algo não está funcionando
- `enhancement` - Nova funcionalidade ou melhoria
- `documentation` - Melhorias na documentação
- `good first issue` - Bom para iniciantes
- `help wanted` - Precisa de ajuda
- `priority: high` - Alta prioridade
- `priority: low` - Baixa prioridade
- `wontfix` - Não será trabalhado

## 🔒 Segurança

Para reportar vulnerabilidades de segurança:
1. **NÃO** abra uma issue pública
2. Entre em contato diretamente com a equipe
3. Aguarde resposta antes de divulgar

## 📚 Recursos

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Issue Templates](https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests)
- [Pull Request Templates](https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/creating-a-pull-request-template-for-your-repository)

---

**Última atualização**: Novembro 2025

