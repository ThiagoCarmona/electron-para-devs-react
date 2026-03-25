# Lição 09 — Debug

> Nesta lição aprendemos a debugar um app Electron: logs estruturados, DevTools, sourcemaps e captura de erros.

## O que mudou desde a lição 08

```bash
git diff lesson-08..lesson-09 --stat
```

Arquivos novos:
- `src/main/logger.ts` — Sistema de logging com níveis e arquivo

Arquivos modificados:
- `src/main/index.ts` — Logs em todo lugar, DevTools automático, captura de erros

## O desafio de debugar no Electron

No web, você abre o DevTools e tudo está lá. No Electron, existem **dois processos separados** para debugar:

- **Renderer** — DevTools normal (Ctrl+Shift+I)
- **Main process** — Não tem DevTools. Precisa de outra abordagem.

## O sistema de logging

Criamos `src/main/logger.ts` com:

- **4 níveis**: debug, info, warn, error
- **Saída dupla**: console + arquivo
- **Contexto**: cada log tem um contexto (ex: `ipc`, `app`, `security`)
- **Timestamp**: ISO 8601 em cada linha

Os logs ficam em `{userData}/logs/YYYY-MM-DD.log`. Para encontrar esse caminho:

```ts
app.getPath('userData')
// Windows: %APPDATA%/electron-notas
// macOS: ~/Library/Application Support/electron-notas
// Linux: ~/.config/electron-notas
```

## DevTools automático

Em dev, o DevTools abre automaticamente no lado direito. Em produção, é desabilitado:

```ts
devTools: is.dev
```

## Captura de erros

Dois handlers globais capturam erros no main process:

- `process.on('uncaughtException')` — Erros síncronos não tratados
- `process.on('unhandledRejection')` — Promises rejeitadas sem catch

Além disso, escutamos eventos do renderer:

- `render-process-gone` — Renderer crashou
- `console-message` — Console.warn e console.error do renderer aparecem nos logs do main

## Como debugar cada parte

### Renderer (React)

1. Abra o DevTools (Ctrl+Shift+I ou automático em dev)
2. Aba Console: erros do React, logs do `console.log`
3. Aba Sources: breakpoints no código TypeScript (sourcemaps)
4. Aba Network: chamadas IPC aparecem como mensagens

### Main process

1. Logs no terminal onde você rodou `npm run dev`
2. Arquivo de log em `{userData}/logs/`
3. Para breakpoints: rode com `--inspect`:

```bash
# No package.json, adicione temporariamente:
"dev:debug": "electron-vite dev -- --inspect=5858"
```

Depois abra `chrome://inspect` no Chrome e conecte.

### IPC

Problemas comuns e como diagnosticar:

- **Canal errado**: O log mostra "chamado" mas não "respondido" → Verifique o nome do canal
- **Dados errados**: O log mostra os dados enviados → Compare com o esperado
- **Sem resposta**: O handler não está registrado → Verifique `registerIpcHandlers()`

## Teste seu entendimento

1. Por que não usamos só `console.log` para tudo?
2. Como você debugaria um problema que só acontece em produção?
3. Por que desabilitamos DevTools em produção?

<details>
<summary>Ver respostas</summary>

1. `console.log` no main process vai para o terminal, mas se perde quando o terminal fecha. O logger salva em arquivo, tem níveis (filtrar debug em prod) e contexto (saber de onde veio).
2. Pelos arquivos de log! O logger salva em `{userData}/logs/`. Também podemos adicionar error reporting (Sentry, etc) no futuro.
3. Para impedir que usuários acessem o console e executem código JavaScript diretamente, o que seria um risco de segurança.

</details>

## Desafio

Adicione um comando "Ver Logs" no menu Ajuda que abre a pasta de logs no gerenciador de arquivos do sistema (use `shell.openPath`).

## Próxima lição

```bash
git checkout lesson-10
npm install
```

Na lição 10, vamos adicionar testes automatizados.
