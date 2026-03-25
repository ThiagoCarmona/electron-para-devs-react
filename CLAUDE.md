# Contexto para Agentes de Código

## Sobre este projeto

Este é um repositório de aprendizado: **Electron para Devs React**. Um curso progressivo onde o aluno constrói um app de notas desktop com Electron + React + TypeScript.

Cada lição é uma branch do Git. O aluno está atualmente na **Lição 10**.

## Lição 10 — Testes

### Objetivo
O aluno está aprendendo a testar um app Electron: testes unitários com Vitest e testes E2E com Playwright.

### O que existe nesta branch
- Tudo da lição 09 +
- `vitest.config.ts` — Configuração do Vitest (testes em `tests/unit/`)
- `playwright.config.ts` — Configuração do Playwright (testes em `tests/e2e/`)
- `tests/unit/validation.test.ts` — Testes das funções de validação
- `tests/e2e/app.spec.ts` — Testes E2E (janela abre, sidebar, criar nota)
- `package.json` — Adicionou `vitest`, `@playwright/test` e scripts `test`, `test:watch`, `test:e2e`

### Tipos de teste
- **Unitários (Vitest):** Funções puras, sem Electron. Rodam rápido: `npm test`
- **E2E (Playwright):** Abre o app real. Precisa buildar antes: `npm run build && npm run test:e2e`

### Testes unitários existentes
- `validateNoteInput` — tipos válidos, inválidos, limites
- `validateId` — UUID, alfanumérico, SQL injection, vazio
- `sanitizeString` — texto normal, newlines, caracteres de controle, acentos/emojis

### Testes E2E existentes
- Janela abre com título "Electron Notas"
- Sidebar mostra "Notas"
- Botão "+ Nova" cria uma nota

### Como ajudar o aluno
- Vitest API é compatível com Jest: `describe`, `it`, `expect`
- Playwright usa `_electron` para lançar apps Electron
- Testes E2E precisam do build: `out/main/index.js` deve existir
- Incentive o desafio: testar `getAllNotes` com banco mock em memória

### Comandos úteis
```bash
npm install
npm test                  # Unitários
npm run test:watch        # Unitários em modo watch
npm run build && npm run test:e2e   # E2E
```

### Navegação
```bash
git checkout lesson-09   # Lição anterior
git checkout lesson-11   # Próxima lição
```
