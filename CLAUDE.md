# Contexto para Agentes de Código

## Sobre este projeto

Este é um repositório de aprendizado: **Electron para Devs React**. Um curso progressivo onde o aluno constrói um app de notas desktop com Electron + React + TypeScript.

Cada lição é uma branch do Git. O aluno está atualmente na **Lição 01**.

## Lição 01 — Entendendo o Electron

### Objetivo
O aluno está conhecendo a estrutura de um projeto Electron pela primeira vez. Ele precisa entender o papel de cada arquivo e a separação entre main process, preload e renderer.

### O que existe nesta branch
- Scaffold do electron-vite com React + TypeScript
- `src/main/index.ts` — Cria a janela (BrowserWindow)
- `src/preload/index.ts` — Expõe API vazia via contextBridge
- `src/renderer/` — React básico com App.tsx simples
- Sem dependências extras além do scaffold

### O que NÃO existe ainda
- Sem lógica de negócio (notas, CRUD)
- Sem banco de dados
- Sem componentes React além do App.tsx
- Sem estilos customizados

### Como ajudar o aluno
- Explique conceitos comparando com o mundo web (Express = main process, React no browser = renderer)
- Se o aluno pedir para "rodar o projeto": `npm install && npm run dev`
- Se perguntar sobre IPC, diga que será abordado na lição 02
- Incentive o aluno a completar o **desafio** do README: mostrar versões do Electron/Chrome/Node no App.tsx

### Comandos úteis
```bash
npm install          # Instala dependências
npm run dev          # Inicia em modo desenvolvimento
npm run build        # Build de produção
npm run typecheck    # Verifica tipos TypeScript
```

### Próxima lição
```bash
git checkout lesson-02
npm install
```
