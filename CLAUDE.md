# Contexto para Agentes de Código

## Sobre este projeto

Este é um repositório de aprendizado: **Electron para Devs React**. Um curso progressivo onde o aluno constrói um app de notas desktop com Electron + React + TypeScript.

Cada lição é uma branch do Git. O aluno está atualmente na **Lição 03**.

## Lição 03 — React no Renderer

### Objetivo
O aluno está construindo a interface do app de notas com componentes React e CSS.

### O que existe nesta branch
- Tudo da lição 02 +
- `src/renderer/src/types.ts` — Interface `Note`
- `src/renderer/src/components/NoteList.tsx` — Lista de notas na sidebar
- `src/renderer/src/components/NoteEditor.tsx` — Editor com título e conteúdo
- `src/renderer/src/styles/global.css` — Tema escuro completo
- `src/renderer/src/App.tsx` — Layout sidebar + editor, estado com useState
- Notas hardcoded em memória (sampleNotes)

### Arquitetura da UI
```
┌─────────────┬───────────────────────┐
│  Sidebar    │  Editor               │
│  (NoteList) │  (NoteEditor)         │
│             │                       │
│  [Nota 1]   │  Título               │
│  [Nota 2]   │  Data                 │
│             │  Conteúdo...          │
│  [+ Nova]   │                       │
└─────────────┴───────────────────────┘
```

### Padrões React usados
- Lifting state up (estado no App, callbacks nos filhos)
- Controlled components (inputs controlados)
- useEffect com `note.id` como dependência (não o objeto inteiro)

### O que NÃO existe ainda
- Dados estão em memória (sem IPC, sem banco)
- Sem menu nativo, atalhos ou tray
- CSS puro (sem Tailwind/styled-components) — proposital para focar no Electron

### Como ajudar o aluno
- Estes são padrões React que o aluno já deve conhecer
- Se perguntar "por que CSS puro?": simplicidade, foco é Electron não estilização
- Incentive o desafio: barra de busca com filter

### Comandos úteis
```bash
npm install && npm run dev
```

### Navegação
```bash
git checkout lesson-02   # Lição anterior
git checkout lesson-04   # Próxima lição
```
