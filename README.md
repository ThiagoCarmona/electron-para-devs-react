# Lição 07 — Zustand + IPC Bridge

> Nesta lição extraímos toda a lógica de estado do App.tsx para uma store Zustand, criando uma ponte limpa entre o estado do React e o IPC.

## O que mudou desde a lição 06

```bash
git diff lesson-06..lesson-07 --stat
```

Arquivos novos:
- `src/renderer/src/store/useNoteStore.ts` — Store Zustand

Arquivos modificados:
- `package.json` — Adicionou `zustand`
- `src/renderer/src/App.tsx` — Simplificado, usa a store

## Por que Zustand?

O `App.tsx` estava ficando grande: estado, lógica de CRUD, integração com IPC, handlers de menu... Tudo junto. O Zustand resolve isso separando **estado + lógica** dos **componentes**.

Por que Zustand e não Context API, Redux ou Jotai?

- **Menos boilerplate que Redux** — Sem actions, reducers, dispatch
- **Sem Provider** — Não precisa envolver a árvore em providers
- **Seletores nativos** — Componentes só re-renderizam quando o dado que usam muda
- **Simples** — Uma função `create` e pronto

## A store

O `useNoteStore` contém:

**Estado:**
- `notes` — Lista de notas
- `selectedNote` — Nota atualmente selecionada
- `loading` — Flag de carregamento

**Ações:**
- `loadNotes()` — Carrega do main process
- `selectNote(note)` — Seleciona uma nota
- `createNote()` — Cria via IPC e adiciona ao estado
- `updateNote(id, title, content)` — Atualiza via IPC e no estado
- `deleteNote(id)` — Remove via IPC e do estado
- `importNote()` / `exportNote()` — Operações de arquivo

Cada ação chama o IPC e atualiza o estado local. O estado é a "cópia local" dos dados do main process.

## O App.tsx agora

Compare o antes e o depois:

**Antes (lesson-06):** ~80 linhas com useState, useCallback, lógica de CRUD inline.

**Depois (lesson-07):** ~50 linhas. Desestrutura a store e passa funções aos componentes. Sem lógica de negócio.

## O padrão IPC Bridge

O fluxo agora é:

```
Componente React
    │
    │  chama store.createNote()
    ↓
  Zustand Store
    │
    │  chama window.api.createNote()
    ↓
  Preload (ponte)
    │
    │  chama ipcRenderer.invoke('notes:create')
    ↓
  Main Process
    │
    │  insere no SQLite
    ↓
  Retorna a nota criada
    │
    ↓
  Store atualiza o estado
    │
    ↓
  React re-renderiza
```

Cada camada tem uma responsabilidade clara.

## Teste seu entendimento

1. Por que a store chama `window.api` diretamente em vez de `ipcRenderer`?
2. O que acontece se o IPC falhar (ex: banco corrompido)? A store lida com isso?
3. Por que não usamos Context API em vez de Zustand?

<details>
<summary>Ver respostas</summary>

1. Porque a store roda no renderer, que não tem acesso ao `ipcRenderer` diretamente. Só o que o preload expõe em `window.api` está disponível.
2. Não lida bem — as Promises vão dar erro silencioso. Na lição 09 (Debug) vamos adicionar tratamento de erros adequado.
3. Context API causaria re-render de toda a árvore a cada mudança de estado. Zustand permite seletores granulares — só o componente que usa `selectedNote` re-renderiza quando ela muda.

</details>

## Desafio

Adicione um seletor `useNoteCount` que retorna a quantidade de notas. Use-o na sidebar para mostrar "Notas (3)" em vez de só "Notas".

Dica:
```ts
const noteCount = useNoteStore((state) => state.notes.length)
```

## Próxima lição

```bash
git checkout lesson-08
npm install
```

Na lição 08, vamos endurecer a segurança do app.
