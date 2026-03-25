# Contexto para Agentes de Código

## Sobre este projeto

Este é um repositório de aprendizado: **Electron para Devs React**. Um curso progressivo onde o aluno constrói um app de notas desktop com Electron + React + TypeScript.

Cada lição é uma branch do Git. O aluno está atualmente na **Lição 09**.

## Lição 09 — Debug

### Objetivo
O aluno está aprendendo a debugar um app Electron: logs estruturados, DevTools, sourcemaps e captura de erros.

### O que existe nesta branch
- Tudo da lição 08 +
- `src/main/logger.ts` — Sistema de logging com 4 níveis (debug, info, warn, error), saída dual (console + arquivo)
- `src/main/index.ts` — Logs em todos os handlers IPC, DevTools automático em dev, captura de erros globais

### Sistema de logging
- Logs salvos em `{userData}/logs/YYYY-MM-DD.log`
- Nível `debug` em dev, `info` em produção
- Formato: `[timestamp] [LEVEL] [context] message`
- Contextos: `app`, `ipc`, `security`, `renderer`, `renderer-console`

### Captura de erros
- `process.on('uncaughtException')` — erros síncronos
- `process.on('unhandledRejection')` — Promises rejeitadas
- `render-process-gone` — renderer crashou
- `console-message` — warn/error do renderer logados no main

### DevTools
- Abre automaticamente em dev (`mode: 'right'`)
- Desabilitado em produção (`devTools: is.dev`)

### Como ajudar o aluno
- Para debugar main process com breakpoints: rodar com `--inspect=5858` e conectar via `chrome://inspect`
- Logs de IPC mostram o canal chamado e os dados enviados
- Se algo não funciona, primeiro checar o terminal (logs do main) e depois o DevTools (erros do renderer)
- Incentive o desafio: menu "Ver Logs" que abre a pasta com `shell.openPath`

### Comandos úteis
```bash
npm install && npm run dev
```

### Navegação
```bash
git checkout lesson-08   # Lição anterior
git checkout lesson-10   # Próxima lição
```
