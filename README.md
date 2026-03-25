# Lição 06 — APIs Nativas

> Nesta lição adicionamos menu nativo, diálogos de arquivo, notificações do sistema e tray icon.

## O que mudou desde a lição 05

```bash
git diff lesson-05..lesson-06 --stat
```

Arquivos novos:
- `src/main/menu.ts` — Menu nativo da aplicação
- `src/main/tray.ts` — Ícone na bandeja do sistema

Arquivos modificados:
- `src/shared/types.ts` — Novos canais IPC
- `src/main/index.ts` — Diálogos, notificações, menu e tray
- `src/preload/index.ts` — Novas funções + listeners de menu
- `src/renderer/src/App.tsx` — Integração com menu e arquivo

## Menu nativo

O `src/main/menu.ts` cria um menu com atalhos de teclado:

- **Ctrl+N** — Nova nota
- **Ctrl+Shift+E** — Exportar nota
- **Ctrl+Shift+I** — Importar nota

O menu envia eventos ao renderer via `webContents.send()`. O renderer escuta esses eventos com `ipcRenderer.on()` no preload.

Isso é comunicação **main → renderer** (o inverso do que fizemos até agora).

## Diálogos de arquivo

`dialog.showSaveDialog` e `dialog.showOpenDialog` são APIs nativas do Electron que abrem os diálogos padrão do sistema operacional. Eles:

- São assíncronos (retornam Promise)
- Aceitam filtros de extensão
- Retornam o caminho escolhido ou `canceled: true`

## Notificações

A classe `Notification` do Electron cria notificações nativas do SO. No Windows aparecem no Action Center, no macOS no Notification Center.

## Tray

O `src/main/tray.ts` cria um ícone na bandeja do sistema com menu de contexto. Clicar no ícone mostra/esconde a janela.

## Comunicação bidirecional

Até agora tínhamos só renderer → main (invoke/handle). Agora também temos main → renderer:

```
Renderer → Main:  ipcRenderer.invoke / ipcMain.handle  (request/response)
Main → Renderer:  webContents.send / ipcRenderer.on    (push/event)
```

## Teste seu entendimento

1. Por que usamos `webContents.send` do menu em vez de `ipcMain.handle`?
2. Por que o diálogo de arquivo roda no main process e não no renderer?
3. Qual a diferença entre `dialog.showSaveDialog` e `dialog.showSaveDialogSync`?

<details>
<summary>Ver respostas</summary>

1. Porque o menu é quem inicia a ação (main → renderer), não o renderer. `handle` espera o renderer chamar; `send` envia proativamente.
2. Porque diálogos de arquivo são APIs do sistema operacional, acessíveis apenas no main process via Node.js.
3. A versão síncrona bloqueia o main process até o usuário fechar o diálogo. A versão assíncrona não bloqueia — preferimos ela.

</details>

## Desafio

Adicione um item "Exportar Todas" no menu que exporta todas as notas em um único arquivo Markdown, com cada nota separada por `---`.

## Próxima lição

```bash
git checkout lesson-07
npm install
```

Na lição 07, vamos adicionar Zustand para gerenciamento de estado no renderer.
