# Contexto para Agentes de Código

## Sobre este projeto

Este é um repositório de aprendizado: **Electron para Devs React**. Um curso progressivo onde o aluno constrói um app de notas desktop com Electron + React + TypeScript.

Cada lição é uma branch do Git. O aluno está atualmente na **Lição 07**.

## Lição 07 — Zustand + IPC Bridge

### Objetivo
O aluno está aprendendo a usar Zustand para gerenciar estado no renderer, criando uma ponte limpa entre React e IPC.

### O que existe nesta branch
- Tudo da lição 06 +
- `src/renderer/src/store/useNoteStore.ts` — Store Zustand centralizada
- `src/renderer/src/App.tsx` — Simplificado (~50 linhas), usa a store
- `package.json` — Adicionou `zustand`

### A store
Estado: `notes`, `selectedNote`, `loading`
Ações: `loadNotes`, `selectNote`, `createNote`, `updateNote`, `deleteNote`, `importNote`, `exportNote`

Cada ação chama `window.api.*` e atualiza o estado local com `set()`.

### Fluxo IPC Bridge
```
Componente → store.createNote() → window.api.createNote() → ipcRenderer.invoke → ipcMain.handle → SQLite
                                                                                                    │
                                                                                          retorna nota
                                                                                                    │
Componente ← re-render ← set({notes: [...]}) ←───────────────────────────────────────────┘
```

### Por que Zustand e não Context API
- Sem Provider (não envolve a árvore)
- Seletores granulares (só re-renderiza quem usa o dado)
- Menos boilerplate que Redux

### O que NÃO mudou
Main process, preload, banco de dados — nada mudou. Só a organização do código no renderer.

### Como ajudar o aluno
- A store não é um substituto do preload — ela só organiza o estado no renderer
- Zustand `set()` é imutável (retorna objeto novo)
- `get()` acessa o estado atual dentro de uma ação
- Incentive o desafio: criar seletor `useNoteCount` para mostrar contagem

### Comandos úteis
```bash
npm install && npm run dev
```

### Navegação
```bash
git checkout lesson-06   # Lição anterior
git checkout lesson-08   # Próxima lição
```
