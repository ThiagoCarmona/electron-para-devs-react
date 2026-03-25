# Contexto para Agentes de Código

## Sobre este projeto

Este é um repositório de aprendizado: **Electron para Devs React**. Um curso progressivo onde o aluno constrói um app de notas desktop com Electron + React + TypeScript.

Cada lição é uma branch do Git. O aluno está atualmente na **Lição 05**.

## Lição 05 — Persistência com SQLite

### Objetivo
O aluno está aprendendo a persistir dados com SQLite usando better-sqlite3. As notas agora sobrevivem ao fechar o app.

### O que existe nesta branch
- Tudo da lição 04 +
- `src/main/database.ts` — Configuração do SQLite (caminho, WAL mode, criação de tabela)
- `src/main/notes.ts` — Agora usa SQL (SELECT, INSERT, UPDATE, DELETE) com prepared statements
- `package.json` — Adicionou `better-sqlite3` e `@types/better-sqlite3`
- Banco fica em `app.getPath('userData')/data/notes.db`

### Schema do banco
```sql
CREATE TABLE notes (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL DEFAULT '',
  content TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
)
```

### Dependência nativa
`better-sqlite3` é uma dependência nativa (compila C++). Se o aluno tiver problemas com `npm install`, pode precisar de build tools:
- Windows: `npm install --global windows-build-tools` ou instalar Visual Studio Build Tools
- macOS: `xcode-select --install`
- Linux: `sudo apt install build-essential`

### O que NÃO mudou
O preload e o renderer são idênticos à lição 04. A troca de array para SQLite foi transparente — mesma API.

### Como ajudar o aluno
- Explique que `better-sqlite3` é síncrono (não precisa de await no main process)
- WAL mode = Write-Ahead Logging, melhora performance de escrita
- `app.getPath('userData')` retorna pasta específica do app por SO
- Incentive o desafio: adicionar coluna `pinned` e ordenar fixadas primeiro

### Comandos úteis
```bash
npm install && npm run dev
```

### Navegação
```bash
git checkout lesson-04   # Lição anterior
git checkout lesson-06   # Próxima lição
```
