# Lição 04 — IPC na Prática

> Nesta lição movemos os dados das notas para o main process e criamos um CRUD completo via IPC.

## O que mudou desde a lição 03

```bash
git diff lesson-03..lesson-04 --stat
```

Arquivos novos:
- `src/shared/types.ts` — Tipos e constantes de canais IPC compartilhados
- `src/main/notes.ts` — Lógica de CRUD no main process

Arquivos modificados:
- `src/main/index.ts` — Registra handlers IPC
- `src/preload/index.ts` — Expõe funções de CRUD ao renderer
- `src/preload/index.d.ts` — Tipos atualizados
- `src/renderer/src/App.tsx` — Usa IPC em vez de estado local
- `src/renderer/src/types.ts` — Re-exporta tipos compartilhados

## A grande mudança

Na lição 03, as notas viviam no `useState` do React. Se você fechasse o app, perdia tudo. Agora, as notas vivem no **main process**. O React pede dados via IPC e recebe respostas.

O fluxo fica assim:

```
React (renderer)  --->  preload (api.getNotes)  --->  ipcRenderer.invoke
       ↑                                                      │
       │                                                      ↓
       └─────────────  retorna Promise  <─────  ipcMain.handle
                                                        (main process)
```

## `src/shared/types.ts` — Código compartilhado

Criamos uma pasta `shared/` para código que o main, o preload e o renderer usam. Isso evita duplicar a interface `Note` e garante que os canais IPC sejam consistentes.

As constantes `IPC_CHANNELS` evitam erros de digitação nos nomes dos canais. Se você errar o nome, o TypeScript avisa.

## `src/main/notes.ts` — O "backend"

Este arquivo contém a lógica de dados. Por enquanto usa um array em memória, mas a interface é a mesma que vamos usar com SQLite na lição 05.

Funções:
- `getAllNotes()` — Retorna todas as notas ordenadas por data
- `createNote(title, content)` — Cria uma nova nota com UUID
- `updateNote(id, title, content)` — Atualiza uma nota existente
- `deleteNote(id)` — Remove uma nota

## `ipcMain.handle` — Os endpoints

No `src/main/index.ts`, registramos quatro handlers:

```ts
ipcMain.handle('notes:getAll', () => getAllNotes())
ipcMain.handle('notes:create', (_, title, content) => createNote(title, content))
ipcMain.handle('notes:update', (_, id, title, content) => updateNote(id, title, content))
ipcMain.handle('notes:delete', (_, id) => deleteNote(id))
```

Pense neles como rotas de uma API REST, mas sem HTTP. O primeiro parâmetro `_` é o evento do IPC (que ignoramos aqui).

## O preload como contrato

O preload define o contrato entre main e renderer:

```ts
const api = {
  getNotes: () => ipcRenderer.invoke('notes:getAll'),
  createNote: (title, content) => ipcRenderer.invoke('notes:create', title, content),
  // ...
}
```

O renderer não sabe que existe `ipcRenderer`. Ele só vê `window.api.getNotes()` — uma função assíncrona que retorna notas.

## O React agora é assíncrono

A principal mudança no `App.tsx`: todas as operações agora são `async/await`, e o `useEffect` carrega as notas ao iniciar.

## Teste seu entendimento

1. Por que `ipcMain.handle` em vez de `ipcMain.on`?
2. O que acontece se o renderer chamar um canal IPC que não existe no main?
3. Por que colocamos os tipos em `shared/` em vez de definir em cada processo?

<details>
<summary>Ver respostas</summary>

1. Porque `handle`/`invoke` retorna uma Promise. O renderer pode `await` a resposta. `on`/`send` é fire-and-forget.
2. A Promise retorna `undefined`. Não dá erro, mas também não faz nada — um bug silencioso. Por isso usamos constantes para os canais.
3. Para garantir que main, preload e renderer usem os mesmos tipos. Se mudarmos a interface `Note`, todos os processos são atualizados juntos.

</details>

## Desafio

Adicione um handler IPC `notes:search` que recebe um termo de busca e retorna só as notas cujo título ou conteúdo contém esse termo. Exponha como `api.searchNotes(term)` no preload.

## Próxima lição

```bash
git checkout lesson-05
npm install
```

Na lição 05, vamos trocar o array em memória por um banco SQLite com better-sqlite3.
