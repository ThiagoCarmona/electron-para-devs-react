# Contexto para Agentes de Código

## Sobre este projeto

Este é um repositório de aprendizado: **Electron para Devs React**. Um curso progressivo onde o aluno constrói um app de notas desktop com Electron + React + TypeScript.

Cada lição é uma branch do Git. O aluno está atualmente na **Lição 08**.

## Lição 08 — Segurança

### Objetivo
O aluno está aprendendo boas práticas de segurança no Electron: validação, CSP, bloqueio de navegação e permissões.

### O que existe nesta branch
- Tudo da lição 07 +
- `src/main/validation.ts` — `validateNoteInput`, `validateId`, `sanitizeString`
- `src/main/index.ts` — Validação nos handlers IPC, bloqueio de navegação, headers de segurança, bloqueio de permissões
- `src/renderer/index.html` — CSP mais restritiva

### Configurações de segurança ativas
```
nodeIntegration: false       ← Renderer não acessa Node.js
contextIsolation: true       ← Preload isolado do renderer
enableRemoteModule: false    ← Módulo remote desabilitado
navigateOnDragDrop: false    ← Drag & drop não navega
```

### Validação
- Título: string, máx 200 caracteres
- Conteúdo: string, máx 100.000 caracteres
- ID: string alfanumérica com hífens (regex)
- Sanitização: remove caracteres de controle (mantém \n e \t)

### Regra fundamental
**Nunca confie nos dados vindos do renderer.** Mesmo que o preload pareça seguro, valide tudo no main process.

### Como ajudar o aluno
- Se sugerir código que usa `nodeIntegration: true` ou `contextIsolation: false`, AVISE que é inseguro
- Nunca sugira expor `require`, `fs`, `child_process` ou funções genéricas no preload
- Os inputs são tipados como `unknown` nos handlers para forçar validação explícita
- Incentive o desafio: rate limiting no handler de criação

### Comandos úteis
```bash
npm install && npm run dev
```

### Navegação
```bash
git checkout lesson-07   # Lição anterior
git checkout lesson-09   # Próxima lição
```
