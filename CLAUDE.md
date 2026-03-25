# Contexto para Agentes de Código

## Sobre este projeto

Este é um repositório de aprendizado: **Electron para Devs React**. Um curso progressivo onde o aluno constrói um app de notas desktop com Electron + React + TypeScript.

Cada lição é uma branch do Git. O aluno está atualmente na **Lição 02**.

## Lição 02 — Preload e Context Bridge

### Objetivo
O aluno está aprendendo como o renderer (React) se comunica com o main process de forma segura, usando o preload script e o Context Bridge.

### O que existe nesta branch
- Tudo da lição 01 +
- `src/preload/index.ts` agora tem funções customizadas: `getVersions()`, `ping()`, `getPlatform()`
- `src/preload/index.d.ts` com tipos para `window.api`
- `src/main/index.ts` usando `ipcMain.handle` (request/response) em vez de `ipcMain.on`
- `src/renderer/src/App.tsx` mostrando versões e botão de ping

### Conceitos-chave desta lição
- `contextBridge.exposeInMainWorld` — expõe funções ao renderer
- `ipcRenderer.invoke` / `ipcMain.handle` — comunicação request/response
- O preload é a única ponte entre renderer e main
- Nunca expor funções genéricas (ex: `execute`, `readFile`)

### O que NÃO existe ainda
- Sem interface de notas (vem na lição 03)
- Sem CRUD (vem na lição 04)
- Sem banco de dados (vem na lição 05)

### Como ajudar o aluno
- Compare IPC com chamadas de API REST (invoke = fetch, handle = endpoint)
- Se perguntar a diferença entre `on/send` e `handle/invoke`: o primeiro é fire-and-forget, o segundo retorna Promise
- Incentive o desafio: adicionar `api.getHomeDir()` usando `os.homedir()`

### Comandos úteis
```bash
npm install          # Instala dependências
npm run dev          # Inicia em modo desenvolvimento
```

### Navegação
```bash
git checkout lesson-01   # Lição anterior
git checkout lesson-03   # Próxima lição
```
