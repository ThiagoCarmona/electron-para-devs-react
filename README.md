# Lição 05 — Persistência com SQLite

> Nesta lição trocamos o array em memória por um banco de dados SQLite real. As notas agora sobrevivem ao fechar o app.

## O que mudou desde a lição 04

```bash
git diff lesson-04..lesson-05 --stat
```

Arquivos novos:
- `src/main/database.ts` — Configuração e inicialização do SQLite

Arquivos modificados:
- `package.json` — Adicionou `better-sqlite3` e `@types/better-sqlite3`
- `src/main/notes.ts` — Agora usa SQL em vez de array
- `src/main/index.ts` — Fecha o banco ao sair

## Por que better-sqlite3?

Existem várias opções para persistência local: JSON files, electron-store, SQLite, IndexedDB. Escolhemos `better-sqlite3` porque:

1. **Síncrono** — Não precisa de callbacks ou Promises. Roda no main process sem complicar o código.
2. **Rápido** — É a lib SQLite mais rápida do Node.js.
3. **Confiável** — SQLite é o banco de dados mais usado do mundo. Seu celular usa, seu navegador usa.
4. **Bom para Electron** — Funciona bem com electron-builder para empacotar.

## `src/main/database.ts` — O banco

Este arquivo cria e configura o banco de dados:

- **Onde o banco fica**: `app.getPath('userData')` retorna a pasta de dados do app no sistema do usuário (ex: `%APPDATA%` no Windows, `~/Library/Application Support` no macOS).
- **WAL mode**: `journal_mode = WAL` melhora a performance de escrita.
- **Tabela notes**: Criada automaticamente na primeira execução com `CREATE TABLE IF NOT EXISTS`.

## `src/main/notes.ts` — SQL no lugar do array

As funções têm a mesma assinatura de antes, mas agora usam SQL:

- `getAllNotes()` → `SELECT * FROM notes ORDER BY updated_at DESC`
- `createNote()` → `INSERT INTO notes ...`
- `updateNote()` → `UPDATE notes SET ... WHERE id = ?`
- `deleteNote()` → `DELETE FROM notes WHERE id = ?`

Note que usamos `?` para parâmetros (prepared statements). Isso previne SQL injection.

## O que não mudou

O preload e o renderer não sabem que agora usamos SQLite. A API é a mesma: `window.api.getNotes()`, `window.api.createNote()`, etc. Essa é a vantagem de ter o preload como contrato — podemos trocar a implementação no backend sem mudar o frontend.

## Teste seu entendimento

1. Por que não usamos SQLite diretamente no renderer?
2. O que é WAL mode e por que ativamos?
3. O que acontece se dois processos tentarem escrever no banco ao mesmo tempo?

<details>
<summary>Ver respostas</summary>

1. O renderer roda em ambiente de navegador e não tem acesso ao filesystem. Além disso, seria inseguro — qualquer código no renderer teria acesso ao banco.
2. WAL (Write-Ahead Logging) permite leituras e escritas simultâneas. Sem WAL, uma escrita bloqueia todas as leituras.
3. No nosso caso não é problema porque só o main process acessa o banco. Se tivéssemos múltiplos processos, o SQLite com WAL lida bem com isso.

</details>

## Desafio

Adicione uma coluna `pinned` (INTEGER, 0 ou 1) à tabela. Notas fixadas devem aparecer primeiro na lista. Atualize o `getAllNotes` para ordenar: fixadas primeiro, depois por data.

## Próxima lição

```bash
git checkout lesson-06
npm install
```

Na lição 06, vamos adicionar menus nativos, diálogos de arquivo, notificações e tray icon.
