# Contexto para Agentes de Código

## Sobre este projeto

Este é um repositório de aprendizado: **Electron para Devs React**. Um curso progressivo onde o aluno constrói um app de notas desktop com Electron + React + TypeScript.

Cada lição é uma branch do Git. O aluno está atualmente na **Lição 06**.

## Lição 06 — APIs Nativas

### Objetivo
O aluno está aprendendo a usar APIs nativas do Electron: menu, diálogos de arquivo, notificações e tray icon.

### O que existe nesta branch
- Tudo da lição 05 +
- `src/main/menu.ts` — Menu nativo com atalhos (Ctrl+N, Ctrl+Shift+E, Ctrl+Shift+I)
- `src/main/tray.ts` — Ícone na bandeja do sistema com menu de contexto
- Handlers IPC para exportar/importar notas como .txt/.md via `dialog`
- Notificações nativas via `Notification`
- Comunicação bidirecional: main → renderer via `webContents.send`

### Canais IPC (novos)
```
notes:export          → dialog.showSaveDialog + writeFile
notes:import          → dialog.showOpenDialog + readFile + createNote
app:showNotification  → new Notification().show()
```

### Eventos do menu (main → renderer)
```
menu:newNote      → Cria nova nota
menu:exportNote   → Exporta nota selecionada
menu:importNote   → Importa nota de arquivo
```

### Conceito importante
Até agora só tínhamos renderer → main (invoke/handle). Agora também temos main → renderer (webContents.send / ipcRenderer.on). O preload expõe listeners: `onMenuNewNote`, `onMenuExportNote`, `onMenuImportNote`.

### Como ajudar o aluno
- `dialog` é assíncrono (retorna Promise)
- Menu é diferente por plataforma (macOS tem menu do app, Windows/Linux não)
- `CmdOrCtrl` funciona como Ctrl no Windows/Linux e Cmd no macOS
- Incentive o desafio: "Exportar Todas" em um único Markdown

### Comandos úteis
```bash
npm install && npm run dev
```

### Navegação
```bash
git checkout lesson-05   # Lição anterior
git checkout lesson-07   # Próxima lição
```
