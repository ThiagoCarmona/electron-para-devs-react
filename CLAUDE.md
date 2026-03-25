# Contexto para Agentes de Código

## Sobre este projeto

Este é um repositório de aprendizado: **Electron para Devs React**. Um curso progressivo onde o aluno constrói um app de notas desktop com Electron + React + TypeScript.

Cada lição é uma branch do Git. O aluno está atualmente na **Lição 04**.

## Lição 04 — IPC na Prática

### Objetivo
O aluno está aprendendo a mover dados para o main process e criar um CRUD completo via IPC.

### O que existe nesta branch
- Tudo da lição 03 +
- `src/shared/types.ts` — Tipos e constantes IPC compartilhadas entre processos
- `src/main/notes.ts` — CRUD em memória (getAllNotes, createNote, updateNote, deleteNote)
- `src/main/index.ts` — 4 handlers IPC registrados via `ipcMain.handle`
- `src/preload/index.ts` — Expõe 4 funções de CRUD + utilitários
- `src/renderer/src/App.tsx` — Agora async, carrega notas via IPC no useEffect

### Canais IPC
```
notes:getAll   → getAllNotes()
notes:create   → createNote(title, content)
notes:update   → updateNote(id, title, content)
notes:delete   → deleteNote(id)
```

### Fluxo de dados
```
React → window.api.getNotes() → ipcRenderer.invoke → ipcMain.handle → notes.ts → retorna
```

### O que NÃO existe ainda
- Dados em memória (sem SQLite, vem na lição 05)
- Sem menu nativo, atalhos ou tray (vem na lição 06)
- Sem gerenciamento de estado (vem na lição 07)

### Como ajudar o aluno
- Compare canais IPC com endpoints REST
- O primeiro parâmetro dos handlers (`_`) é o evento IPC — ignoramos aqui
- Se perguntar sobre persistência: explique que vem na próxima lição
- Incentive o desafio: criar `notes:search` com filtro por termo

### Comandos úteis
```bash
npm install && npm run dev
```

### Navegação
```bash
git checkout lesson-03   # Lição anterior
git checkout lesson-05   # Próxima lição
```
